<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // ─── Créer une réservation (verrou 10 min) ───────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'land_id'      => 'required|integer|exists:lands,id',
            'sqm_reserved' => 'required|integer|min:1',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // RG01 : KYC obligatoire
        if (!$user->isKycValidated()) {
            return response()->json([
                'message' => 'Votre identité doit être vérifiée (KYC) avant d\'investir.',
                'code'    => 'KYC_REQUIRED',
            ], 403);
        }

        $land = Land::findOrFail($validated['land_id']);

        // Vérifier que le terrain est disponible
        if (!$land->isAvailable()) {
            return response()->json([
                'message' => 'Ce terrain n\'est pas disponible à l\'investissement.',
                'code'    => 'LAND_NOT_AVAILABLE',
            ], 400);
        }

        // RG04 : Stock suffisant
        if (!$land->hasEnoughSqm($validated['sqm_reserved'])) {
            return response()->json([
                'message'       => "Seulement {$land->available_sqm} m² disponibles.",
                'code'          => 'INSUFFICIENT_STOCK',
                'available_sqm' => $land->available_sqm,
            ], 400);
        }

        // ✅ BUG CORRIGÉ — Libérer les m² de l'ancienne réservation
        //    avant d'en créer une nouvelle.
        //
        // PROBLÈME DE L'ANCIENNE VERSION :
        //   Reservation::where(...)->update(['status' => 'cancelled']);
        //   → On annulait juste le statut en BDD mais on ne redonnait
        //     jamais les m² au terrain. Résultat : si l'investisseur
        //     annulait puis recréait une réservation sur le même terrain,
        //     les m² de l'ancienne réservation restaient bloqués jusqu'à
        //     ce que le scheduler tourne (toutes les minutes).
        //     Exemple : terrain de 100 m², investisseur réserve 10 m²,
        //     annule et re-réserve → disponible_sqm = 80 au lieu de 90.
        //
        // SOLUTION :
        //   On fait la même chose que expireReservation() :
        //   increment(available_sqm) + update(status = cancelled)
        //   le tout dans une transaction pour l'atomicité.
        //
        $anciennesReservations = Reservation::where('investor_id', $user->id)
            ->where('land_id', $land->id)
            ->where('status', 'active')
            ->get();

        if ($anciennesReservations->isNotEmpty()) {
            DB::transaction(function () use ($anciennesReservations, $land) {
                // Calculer le total de m² à rendre
                $sqmALiberer = $anciennesReservations->sum('sqm_reserved');

                // Remettre les m² disponibles sur le terrain
                Land::where('id', $land->id)
                    ->increment('available_sqm', $sqmALiberer);

                // Annuler toutes les anciennes réservations actives
                $anciennesReservations->each(
                    fn($r) => $r->update(['status' => 'cancelled'])
                );
            });

            // Recharger le terrain pour avoir available_sqm à jour
            $land->refresh();

            // Re-vérifier le stock après libération
            if (!$land->hasEnoughSqm($validated['sqm_reserved'])) {
                return response()->json([
                    'message'       => "Seulement {$land->available_sqm} m² disponibles.",
                    'code'          => 'INSUFFICIENT_STOCK',
                    'available_sqm' => $land->available_sqm,
                ], 400);
            }
        }

        // Créer la nouvelle réservation avec verrou 10 min (RG02)
        $reservation = DB::transaction(function () use ($user, $land, $validated) {

            // Bloquer les m² (décrémentation atomique)
            $updated = Land::where('id', $land->id)
                ->where('available_sqm', '>=', $validated['sqm_reserved'])
                ->decrement('available_sqm', $validated['sqm_reserved']);

            if (!$updated) {
                throw new \Exception('Stock insuffisant — race condition détectée.');
            }

            return Reservation::create([
                'investor_id'  => $user->id,
                'land_id'      => $land->id,
                'sqm_reserved' => $validated['sqm_reserved'],
                'expires_at'   => now()->addMinutes(10),
                'status'       => 'active',
            ]);
        });

        // Calcul du montant total
        $subtotal   = $land->price_per_sqm * $validated['sqm_reserved'];
        $commission = round($subtotal * 0.03, 2);
        $total      = $subtotal + $commission;

        return response()->json([
            'message'     => 'Réservation créée. Vous avez 10 minutes pour payer.',
            'reservation' => [
                'id'           => $reservation->id,
                'land_id'      => $land->id,
                'land_title'   => $land->title,
                'sqm_reserved' => $reservation->sqm_reserved,
                'expires_at'   => $reservation->expires_at,
                'expires_in'   => 600,
                'pricing'      => [
                    'unit_price' => $land->price_per_sqm,
                    'sqm'        => $validated['sqm_reserved'],
                    'subtotal'   => $subtotal,
                    'commission' => $commission,
                    'total'      => $total,
                ],
            ],
        ], 201);
    }

    // ─── Vérifier le statut d'une réservation ───────────────────────
    public function show(int $id): JsonResponse
    {
        $reservation = Reservation::where('id', $id)
            ->where('investor_id', Auth::id())
            ->with('land:id,title,price_per_sqm')
            ->firstOrFail();

        // Auto-expiration si le timer est dépassé
        if ($reservation->status === 'active' && $reservation->isExpired()) {
            $this->expireReservation($reservation);
        }

        return response()->json([
            'reservation' => [
                'id'                => $reservation->id,
                'status'            => $reservation->fresh()->status,
                'sqm_reserved'      => $reservation->sqm_reserved,
                'expires_at'        => $reservation->expires_at,
                'remaining_seconds' => $reservation->remaining_seconds,
                'land'              => $reservation->land,
            ],
        ]);
    }

    // ─── Annuler une réservation (action manuelle investisseur) ──────
    public function cancel(int $id): JsonResponse
    {
        $reservation = Reservation::where('id', $id)
            ->where('investor_id', Auth::id())
            ->where('status', 'active')
            ->firstOrFail();

        DB::transaction(function () use ($reservation) {
            // Remettre les m² disponibles
            Land::where('id', $reservation->land_id)
                ->increment('available_sqm', $reservation->sqm_reserved);

            $reservation->update(['status' => 'cancelled']);
        });

        return response()->json([
            'message' => 'Réservation annulée. Les m² ont été libérés.',
        ]);
    }

    // ─── Expirer une réservation (interne + cron) ────────────────────
    public function expireReservation(Reservation $reservation): void
    {
        DB::transaction(function () use ($reservation) {
            Land::where('id', $reservation->land_id)
                ->increment('available_sqm', $reservation->sqm_reserved);

            $reservation->update(['status' => 'expired']);
        });
    }

    // ─── Expirer toutes les réservations périmées (scheduler) ────────
    public function expireAll(): int
    {
        $expired = Reservation::where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expired as $reservation) {
            $this->expireReservation($reservation);
        }

        return $expired->count();
    }
}
