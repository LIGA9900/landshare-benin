<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Investment;
use App\Models\Valuation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UserController extends Controller
{
    // ─── Dashboard investisseur ──────────────────────────────────────
    public function dashboard(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $investments = Investment::where('investor_id', $user->id)
            ->where('status', 'confirmed')
            ->with('land:id,title,city,price_per_sqm,status,total_sqm,available_sqm')
            ->orderBy('confirmed_at', 'asc')
            ->get();

        $totalInvested = (float) $investments->sum('total_paid');
        $totalSqm      = (int)   $investments->sum('sqm_bought');

        // Valeur actuelle = m² détenus × prix actuel du terrain
        $currentValue = 0.0;
        foreach ($investments as $inv) {
            $currentValue += $inv->sqm_bought * (float) ($inv->land->price_per_sqm ?? 0);
        }

        // ✅ CORRECTION — Plus-value calculée sur subtotal (prix foncier pur)
        // et NON sur total_paid qui inclut la commission LandShare.
        // Explication : l'investisseur a payé 25 750 F dont 750 F de commission.
        // La commission est un frais de service, pas un investissement foncier.
        // Donc la plus-value doit se calculer sur les 25 000 F fonciers uniquement.
        $totalSubtotal = (float) $investments->sum('subtotal');
        $plusValue     = $currentValue - $totalSubtotal;
        $plusValuePct  = $totalSubtotal > 0
            ? round(($plusValue / $totalSubtotal) * 100, 1)
            : 0;

        $chartData = $this->buildChartData($investments);

        $recentActivity = $investments
            ->sortByDesc('confirmed_at')
            ->take(5)
            ->values()
            ->map(fn($inv) => [
                'id'            => $inv->id,
                'reference'     => $inv->reference,
                'status'        => $inv->status,
                'sqm_bought'    => $inv->sqm_bought,
                'total_paid'    => $inv->total_paid,
                // ✅ current_value = sqm × prix actuel du terrain
                'current_value' => $inv->land
                    ? round($inv->sqm_bought * (float) $inv->land->price_per_sqm)
                    : (float) $inv->total_paid,
                // ✅ plus_value = current_value - subtotal (pas total_paid)
                'plus_value'    => $inv->land
                    ? round(
                        $inv->sqm_bought * (float) $inv->land->price_per_sqm
                            - (float) $inv->subtotal
                    )
                    : 0,
                'confirmed_at'  => $inv->confirmed_at,
                'created_at'    => $inv->created_at,
                'land'          => $inv->land ? [
                    'id'            => $inv->land->id,
                    'title'         => $inv->land->title,
                    'city'          => $inv->land->city,
                    'price_per_sqm' => $inv->land->price_per_sqm,
                ] : null,
            ]);

        return response()->json([
            'user' => [
                'id'         => $user->id,
                'full_name'  => $user->full_name,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'phone'      => $user->phone,
                'country'    => $user->country,
                'kyc_status' => $user->kyc_status,
                'role'       => $user->role,
            ],
            'portfolio' => [
                'total_invested'    => $totalInvested,
                'total_sqm'         => $totalSqm,
                'investments_count' => $investments->count(),
                'current_value'     => round($currentValue),
                // ✅ CORRIGÉ : plus_value basée sur subtotal
                'plus_value'        => round($plusValue),
                'plus_value_pct'    => $plusValuePct,
            ],
            'chart_data'      => $chartData,
            'recent_activity' => $recentActivity,
        ]);
    }

    // ─── buildChartData ──────────────────────────────────────────────
    //
    // ✅ CORRECTION v3 — Graphe régresse à chaque nouvel achat
    //
    // PROBLÈME :
    // Quand l'investisseur achète 1 m² à 40 000 F le 26 Mai,
    // alors qu'il avait déjà 5 m² valorisés à 40 000 F/m²,
    // l'ancien code recalculait un prix moyen pondéré :
    //   (5 × 5000 + 1 × 40000) / 6 = 11 667 F/m²
    // ce qui donnait 6 × 11 667 = 70 000 F → régression visible.
    //
    // CAUSE :
    // L'ancien code trackait 'price' comme prix moyen pondéré
    // des ACHATS. Un nouvel achat au prix actuel (40 000 F)
    // ramenait le prix moyen vers le bas, écrasant les valorisations.
    //
    // SOLUTION :
    // On sépare deux concepts distincts dans portfolioState :
    //   - 'sqm'           : m² cumulés (mis à jour à chaque achat)
    //   - 'current_price' : dernier prix connu du terrain
    //                       (mis à jour par les valorisations UNIQUEMENT)
    //
    // Un achat ne modifie JAMAIS le current_price.
    // Seule une valorisation modifie le current_price.
    // Le prix initial est le unit_price du PREMIER achat sur ce terrain.
    //
    // ORDRE DES ÉVÉNEMENTS :
    // Valorisations AVANT achats le même jour (sort_key _0 vs _1).
    // Ainsi un achat fait le même jour qu'une valorisation
    // hérite du nouveau prix — ce qui est correct.
    //
    // EXEMPLE avec tes données :
    //   23 Mai : achat 5 m² à 5 000 F → state = { sqm:5, price:5000 }
    //   23 Mai : valoration 10 000 F  → state = { sqm:5, price:10000 } → 50 000 F
    //   23 Mai : valoration 15 000 F  → state = { sqm:5, price:15000 } → 75 000 F
    //   25 Mai : valoration 40 000 F  → state = { sqm:5, price:40000 } → 200 000 F
    //   26 Mai : achat 1 m² à 40 000 F→ state = { sqm:6, price:40000 } → 240 000 F ✅
    //
    private function buildChartData($investments): array
    {
        if ($investments->isEmpty()) return [];

        $landIds = $investments->pluck('land_id')->unique()->filter()->values();

        $valuations = Valuation::whereIn('land_id', $landIds)
            ->orderBy('valuation_date', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        // ── Date du premier achat par terrain ──────────────────────
        $firstBuyDate = [];
        foreach ($investments as $inv) {
            $landId = $inv->land_id;
            $date   = Carbon::parse($inv->confirmed_at ?? $inv->created_at)->format('Y-m-d');
            if (!isset($firstBuyDate[$landId]) || $date < $firstBuyDate[$landId]) {
                $firstBuyDate[$landId] = $date;
            }
        }

        // ── Prix du premier achat par terrain ──────────────────────
        // Sert à initialiser current_price avant toute valorisation
        $firstBuyPrice = [];
        foreach ($investments as $inv) {
            $landId = $inv->land_id;
            $date   = Carbon::parse($inv->confirmed_at ?? $inv->created_at)->format('Y-m-d');
            if (isset($firstBuyDate[$landId]) && $date === $firstBuyDate[$landId]) {
                // On prend le premier achat chronologiquement
                if (!isset($firstBuyPrice[$landId])) {
                    $firstBuyPrice[$landId] = (float) $inv->unit_price;
                }
            }
        }

        // ── État initial du portefeuille ────────────────────────────
        // current_price = dernier prix connu (valorisation ou prix achat)
        // Un achat ne modifie PAS current_price — seules les valorisations le font
        $portfolioState = [];
        foreach ($landIds as $landId) {
            $portfolioState[$landId] = [
                'sqm'           => 0,
                'current_price' => $firstBuyPrice[$landId] ?? 0.0,
            ];
        }

        // ── Construction des événements ─────────────────────────────
        $events = collect();

        // Valorisations — sort_key _0 = AVANT les achats ce jour-là
        foreach ($valuations as $val) {
            $date   = Carbon::parse($val->valuation_date)->format('Y-m-d');
            $landId = $val->land_id;

            if (!isset($firstBuyDate[$landId])) continue;
            if ($date < $firstBuyDate[$landId]) continue;

            $events->push([
                'sort_key'  => $date . '_0_' . str_pad($val->id, 6, '0', STR_PAD_LEFT),
                'date'      => $date,
                'type'      => 'valuation',
                'label'     => Carbon::parse($date)->format('d M'),
                'land_id'   => $landId,
                'new_price' => (float) $val->estimated_value_per_sqm,
            ]);
        }

        // Achats groupés par jour — sort_key _1 = APRÈS les valorisations
        $investmentsByDay = $investments->groupBy(function ($inv) {
            return Carbon::parse($inv->confirmed_at ?? $inv->created_at)->format('Y-m-d');
        });
        foreach ($investmentsByDay as $date => $dayInvs) {
            $events->push([
                'sort_key' => $date . '_1',
                'date'     => $date,
                'type'     => 'investment',
                'label'    => Carbon::parse($date)->format('d M'),
            ]);
        }

        $events = $events->sortBy('sort_key')->values();
        if ($events->isEmpty()) return [];

        // ── Calcul valeur portefeuille après chaque événement ───────
        $pointsParDate = [];

        foreach ($events as $event) {
            $date = $event['date'];

            if ($event['type'] === 'valuation') {
                // ✅ Seule une valorisation met à jour le prix courant
                $landId = $event['land_id'];
                if (isset($portfolioState[$landId])) {
                    $portfolioState[$landId]['current_price'] = $event['new_price'];
                }
            } elseif ($event['type'] === 'investment') {
                // ✅ Un achat met à jour UNIQUEMENT les m² — pas le prix
                $dayInvs = $investments->filter(
                    fn($inv) => Carbon::parse($inv->confirmed_at ?? $inv->created_at)
                        ->format('Y-m-d') === $date
                );
                foreach ($dayInvs as $inv) {
                    $landId = $inv->land_id;
                    $sqm    = (int) $inv->sqm_bought;

                    $portfolioState[$landId]['sqm'] += $sqm;

                    // Si c'est le tout premier achat sur ce terrain,
                    // on initialise current_price avec le unit_price
                    // (au cas où aucune valorisation n'est encore passée)
                    if ($portfolioState[$landId]['current_price'] === 0.0) {
                        $portfolioState[$landId]['current_price'] = (float) $inv->unit_price;
                    }
                }
            }

            // Calculer la valeur totale = Σ (sqm × current_price)
            $totalValue = 0;
            foreach ($portfolioState as $state) {
                $totalValue += $state['sqm'] * $state['current_price'];
            }

            // Un seul point par date — on écrase si même jour
            if ($totalValue > 0) {
                $pointsParDate[$date] = [
                    'month' => $event['label'],
                    'value' => round($totalValue),
                    'type'  => $event['type'],
                ];
            }
        }

        return array_values($pointsParDate);
    }


    // ─── Portefeuille complet ────────────────────────────────────────
    public function portfolio(): JsonResponse
    {
        $user = Auth::user();

        $investments = Investment::where('investor_id', $user->id)
            ->where('status', 'confirmed')
            ->with(['land:id,title,city,location,price_per_sqm,status,total_sqm,available_sqm'])
            ->orderBy('confirmed_at', 'desc')
            ->get();

        $totalInvested  = (float) $investments->sum('total_paid');
        $totalSubtotal  = (float) $investments->sum('subtotal');
        $totalSqm       = (int)   $investments->sum('sqm_bought');

        $currentValue = 0.0;
        foreach ($investments as $inv) {
            $currentValue += $inv->sqm_bought * (float) ($inv->land->price_per_sqm ?? 0);
        }

        return response()->json([
            'portfolio' => $investments->map(fn($inv) => [
                'id'             => $inv->id,
                'reference'      => $inv->reference,
                'sqm_bought'     => $inv->sqm_bought,
                'unit_price'     => (float) $inv->unit_price,
                'subtotal'       => (float) $inv->subtotal,
                'commission'     => (float) $inv->commission,
                'total_paid'     => (float) $inv->total_paid,
                // Valeur actuelle = m² × prix actuel du terrain
                'current_value'  => $inv->land
                    ? round($inv->sqm_bought * (float) $inv->land->price_per_sqm)
                    : (float) $inv->subtotal,
                // ✅ CORRIGÉ : plus_value = current_value - subtotal (pas total_paid)
                'plus_value'     => $inv->land
                    ? round(
                        $inv->sqm_bought * (float) $inv->land->price_per_sqm
                            - (float) $inv->subtotal
                    )
                    : 0,
                // ✅ CORRIGÉ : pourcentage basé sur subtotal aussi
                'plus_value_pct' => $inv->land && (float) $inv->subtotal > 0
                    ? round(
                        (($inv->sqm_bought * (float) $inv->land->price_per_sqm - (float) $inv->subtotal)
                            / (float) $inv->subtotal) * 100,
                        1
                    )
                    : 0,
                'confirmed_at'    => $inv->confirmed_at,
                'certificate_url'    => $inv->certificate_url,
                'tx_hash'            => $inv->tx_hash,
                'blockchain_network' => $inv->blockchain_network,
                'anchored_at'        => $inv->anchored_at,
                'land'            => $inv->land ? [
                    'id'            => $inv->land->id,
                    'title'         => $inv->land->title,
                    'city'          => $inv->land->city,
                    'location'      => $inv->land->location,
                    'status'        => $inv->land->status,
                    'price_per_sqm' => (float) $inv->land->price_per_sqm,
                ] : null,
            ]),
            'summary' => [
                'total_paid'       => $totalInvested,
                'total_subtotal'   => $totalSubtotal,
                'total_commission' => (float) $investments->sum('commission'),
                'total_sqm'        => $totalSqm,
                'count'            => $investments->count(),
                'current_value'    => round($currentValue),
                // ✅ CORRIGÉ : plus_value et pct basés sur subtotal
                'plus_value'       => round($currentValue - $totalSubtotal),
                'plus_value_pct'   => $totalSubtotal > 0
                    ? round((($currentValue - $totalSubtotal) / $totalSubtotal) * 100, 1)
                    : 0,
            ],
        ]);
    }

    // ─── Liste admin des utilisateurs ───────────────────────────────
    public function adminIndex(Request $request): JsonResponse
    {
        $query = User::withSum(
            ['investments as investments_sum_total_paid' => fn($q) => $q->where('status', 'confirmed')],
            'total_paid'
        )->withSum(
            ['investments as investments_sum_sqm_bought' => fn($q) => $q->where('status', 'confirmed')],
            'sqm_bought'
        )->orderBy('created_at', 'desc');

        if ($request->kyc_status) {
            $query->where('kyc_status', $request->kyc_status);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', '%' . $request->search . '%')
                    ->orWhere('last_name',  'like', '%' . $request->search . '%')
                    ->orWhere('email',      'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate(20);

        return response()->json([
            'users' => $users->map(fn($u) => $this->formatUser($u)),
            'meta'  => [
                'total'        => $users->total(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
            'stats' => [
                'total'       => User::count(),
                'active'      => User::where('status', 'active')->count(),
                'suspended'   => User::where('status', 'suspended')->count(),
                'kyc_pending' => User::where('kyc_status', 'pending')->count(),
            ],
        ]);
    }

    // ─── Détail utilisateur (admin) ──────────────────────────────────
    public function adminShow(int $id): JsonResponse
    {
        $user = User::with([
            'investments'  => fn($q) => $q->where('status', 'confirmed'),
            'kycDocuments' => fn($q) => $q->latest()->limit(1),
        ])->findOrFail($id);

        return response()->json([
            'user' => $this->formatUser($user, detailed: true),
        ]);
    }

    // ─── Suspendre / réactiver ───────────────────────────────────────
    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre statut.'
            ], 400);
        }

        $newStatus = $user->status === 'active' ? 'suspended' : 'active';
        $user->update(['status' => $newStatus]);

        if ($newStatus === 'suspended') {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $newStatus === 'suspended' ? 'Compte suspendu.' : 'Compte réactivé.',
            'status'  => $newStatus,
        ]);
    }

    // ─── Mettre à jour le profil ─────────────────────────────────────
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name'  => 'sometimes|string|max:100',
            'phone'      => 'sometimes|string|max:20',
            'country'    => 'sometimes|string|max:100',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user'    => $this->formatUser($user->fresh()),
        ]);
    }

    // ─── Statistiques admin ──────────────────────────────────────────
    public function adminStatistics(): JsonResponse
    {
        $totalRevenue     = Investment::where('status', 'confirmed')->sum('total_paid');
        $totalInvestments = Investment::where('status', 'confirmed')->count();
        $totalUsers       = User::where('role', 'investor')->count();
        $pendingKyc       = User::where('kyc_status', 'pending')->count();

        return response()->json([
            'total_revenue'     => (float) $totalRevenue,
            'total_investments' => $totalInvestments,
            'total_users'       => $totalUsers,
            'pending_kyc'       => $pendingKyc,
        ]);
    }

    // ─── Format utilisateur ──────────────────────────────────────────
    private function formatUser(User $user, bool $detailed = false): array
    {
        $data = [
            'id'             => $user->id,
            'full_name'      => $user->full_name,
            'first_name'     => $user->first_name,
            'last_name'      => $user->last_name,
            'email'          => $user->email,
            'phone'          => $user->phone,
            'country'        => $user->country,
            'role'           => $user->role,
            'status'         => $user->status,
            'kyc_status'     => $user->kyc_status,
            'created_at'     => $user->created_at,
            'total_invested' => (float) ($user->investments_sum_total_paid ?? 0),
            'total_sqm'      => (int)   ($user->investments_sum_sqm_bought ?? 0),
        ];

        if ($detailed) {
            $data['latest_kyc'] = $user->kycDocuments->first();
        }

        return $data;
    }
}
