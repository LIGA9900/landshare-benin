<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Models\Valuation;
use App\Models\Investment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ValuationController extends Controller
{
    // ─── Créer une nouvelle valorisation ────────────────────────
    // POST /api/admin/lands/{land}/valuations
    public function store(Request $request, Land $land): JsonResponse
    {
        $validated = $request->validate([
            'estimated_value_per_sqm' => 'required|numeric|min:1',
            'valuation_date'          => 'required|date',
            'source'                  => 'nullable|string|max:255',
            'notes'                   => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            // 1. Créer la valorisation
            $valuation = Valuation::create([
                'land_id'                 => $land->id,
                'estimated_value_per_sqm' => $validated['estimated_value_per_sqm'],
                'valuation_date'          => $validated['valuation_date'],
                'source'                  => $validated['source'] ?? null,
                'notes'                   => $validated['notes'] ?? null,
            ]);

            // 2. Mettre à jour le prix actuel du terrain
            $ancienPrix  = (float) $land->price_per_sqm;
            $nouveauPrix = (float) $validated['estimated_value_per_sqm'];
            $land->update(['price_per_sqm' => $nouveauPrix]);

            // 3. Calculer la variation en %
            $variation = $ancienPrix > 0
                ? round((($nouveauPrix - $ancienPrix) / $ancienPrix) * 100, 1)
                : 0;

            // 4. Notifier tous les investisseurs du terrain
            $investments = Investment::where('land_id', $land->id)
                ->where('status', 'confirmed')
                ->with('investor')
                ->get();

            foreach ($investments as $investment) {
                if (!$investment->investor) continue;

                $valeurActuelle = $investment->sqm_bought * $nouveauPrix;

                // ✅ Plus-value basée sur subtotal (pas total_paid)
                $plusValue = $valeurActuelle - (float) $investment->subtotal;
                $signe     = $variation >= 0 ? '+' : '';

                // ✅ BUG CORRIGÉ — Type notification 'terrain' au lieu de 'investment'
                //
                // L'ancien code utilisait 'type' => 'investment' qui n'existe pas
                // dans l'enum de la table notifications.
                // Les types valides sont : paiement, attestation, kyc, terrain,
                //                          alerte, info, systeme
                // La valorisation concerne un terrain → type 'terrain' est correct.
                // PostgreSQL rejetait silencieusement ou levait une erreur selon
                // la configuration stricte de l'enum.
                Notification::create([
                    'user_id' => $investment->investor_id,
                    'title'   => "📈 {$land->title} a été réévalué !",
                    'message' => "Votre terrain {$land->title} vient d'être réévalué "
                        . "à " . number_format($nouveauPrix, 0, ',', ' ') . " FCFA/m² "
                        . "({$signe}{$variation}%). "
                        . "Votre investissement de {$investment->sqm_bought} m² "
                        . "vaut maintenant "
                        . number_format($valeurActuelle, 0, ',', ' ') . " FCFA.",
                    'type'    => 'terrain', // ✅ CORRIGÉ : était 'investment'
                    'is_read' => false,
                    'terrain' => $land->title,
                    'action'  => [
                        'label' => 'Voir mon portefeuille',
                        'href'  => '/portefeuille',
                    ],
                ]);
            }

            DB::commit();

            return response()->json([
                'message'            => "Valorisation enregistrée. {$investments->count()} investisseur(s) notifié(s).",
                'valuation'          => $valuation,
                'variation'          => $variation,
                'investors_notified' => $investments->count(),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la valorisation.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ─── Historique des valorisations d'un terrain ──────────────
    // GET /api/admin/lands/{land}/valuations
    public function history(Land $land): JsonResponse
    {
        $valuations = Valuation::where('land_id', $land->id)
            ->orderBy('valuation_date', 'desc')
            ->get();

        // Construire le graphe d'évolution (ordre chronologique)
        $chartData = $valuations->sortBy('valuation_date')->map(fn($v) => [
            'date'  => $v->valuation_date->format('d M Y'),
            'value' => (float) $v->estimated_value_per_sqm,
        ])->values();

        // Variation totale = entre la première et la dernière valorisation
        $sorted           = $valuations->sortBy('valuation_date');
        $premiereValeur   = (float) $sorted->first()?->estimated_value_per_sqm;
        $derniereValeur   = (float) $sorted->last()?->estimated_value_per_sqm;
        $variationTotale  = $premiereValeur > 0
            ? round((($derniereValeur - $premiereValeur) / $premiereValeur) * 100, 1)
            : 0;

        return response()->json([
            'land' => [
                'id'            => $land->id,
                'title'         => $land->title,
                'price_per_sqm' => (float) $land->price_per_sqm,
            ],
            'valuations'       => $valuations,
            'chart_data'       => $chartData,
            'variation_totale' => $variationTotale,
        ]);
    }

    // ─── Historique public d'un terrain (pour l'investisseur) ───
    // GET /api/lands/{land}/valuations
    public function publicHistory(Land $land): JsonResponse
    {
        $valuations = Valuation::where('land_id', $land->id)
            ->orderBy('valuation_date', 'asc')
            ->get(['id', 'estimated_value_per_sqm', 'valuation_date', 'source']);

        $chartData = $valuations->map(fn($v) => [
            'date'  => $v->valuation_date->format('d M'),
            'value' => (float) $v->estimated_value_per_sqm,
        ]);

        return response()->json([
            'land_id'    => $land->id,
            'valuations' => $valuations,
            'chart_data' => $chartData,
        ]);
    }
}
