<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Notification;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\PaymentConfirmedMail;
use Illuminate\Support\Facades\Mail;

class InvestmentController extends Controller
{
    // ─── Créer un investissement depuis une réservation ──────────────
    // ✅ POST /api/investments — appelé par Payment.jsx
    // Cette route reçoit reservation_id + method et crée l'investissement
    // + le paiement. Si method=simulation, confirme immédiatement.
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reservation_id' => 'required|integer|exists:reservations,id',
            'method'         => 'required|in:mtn_momo,moov_money,stripe,paystack,simulation',
            'phone_number'   => 'required_if:method,mtn_momo,moov_money|nullable|string',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->isKycValidated()) {
            return response()->json([
                'message' => 'KYC requis avant tout investissement.',
                'code'    => 'KYC_REQUIRED',
            ], 403);
        }

        $reservation = Reservation::where('id', $validated['reservation_id'])
            ->where('investor_id', $user->id)
            ->where('status', 'active')
            ->with('land')
            ->firstOrFail();

        if ($reservation->isExpired()) {
            $reservation->update(['status' => 'expired']);
            return response()->json([
                'message' => 'Votre réservation a expiré. Veuillez recommencer.',
                'code'    => 'RESERVATION_EXPIRED',
            ], 400);
        }

        $land       = $reservation->land;
        $subtotal   = $land->price_per_sqm * $reservation->sqm_reserved;
        $commission = round($subtotal * 0.03, 2);
        $total      = $subtotal + $commission;

        $result = DB::transaction(function () use ($user, $reservation, $land, $validated, $subtotal, $commission, $total) {
            $investment = Investment::create([
                'investor_id'    => $user->id,
                'land_id'        => $land->id,
                'reservation_id' => $reservation->id,
                'sqm_bought'     => $reservation->sqm_reserved,
                'unit_price'     => $land->price_per_sqm,
                'subtotal'       => $subtotal,
                'commission'     => $commission,
                'total_paid'     => $total,
                'status'         => 'reserved',
                'reference'      => Investment::generateReference(),
            ]);

            $payment = Payment::create([
                'investment_id'   => $investment->id,
                'method'          => $validated['method'],
                'amount'          => $total,
                'currency'        => 'XOF',
                'status'          => 'initiated',
                'phone_number'    => $validated['phone_number'] ?? null,
                'idempotency_key' => uniqid('pay_', true),
            ]);

            $reservation->update(['status' => 'converted']);

            return compact('investment', 'payment');
        });

        $investment = $result['investment'];
        $payment    = $result['payment'];

        // ✅ Si simulation → confirmer immédiatement via PaymentController
        // On délègue TOUTE la logique de confirmation à PaymentController
        // qui gère : confirmation BDD + attestation + blockchain + notifications
        if ($validated['method'] === 'simulation') {
            Log::info("InvestmentController::store — simulation détectée pour {$investment->reference}");

            $paymentController = app(PaymentController::class);
            $paymentController->confirmPayment($payment, 'SIM-' . strtoupper(uniqid()));

            $investment->refresh();

            return response()->json([
                'message' => '✅ Investissement confirmé via simulation !',
                'investment' => [
                    'id'              => $investment->id,
                    'reference'       => $investment->reference,
                    'status'          => $investment->status,
                    'sqm'             => $investment->sqm_bought,
                    'total'           => $total,
                    'certificate_url' => $investment->certificate_url,
                ],
                'payment' => [
                    'id'     => $payment->id,
                    'method' => 'simulation',
                    'amount' => $total,
                    'status' => 'success',
                ],
            ], 201);
        }

        // Pour les vrais paiements → retourner les infos et attendre le webhook
        return response()->json([
            'message'    => 'Investissement initié. Procédez au paiement.',
            'investment' => [
                'id'        => $investment->id,
                'reference' => $investment->reference,
                'status'    => $investment->status,
                'sqm'       => $investment->sqm_bought,
                'total'     => $total,
            ],
            'payment' => [
                'id'              => $payment->id,
                'method'          => $payment->method,
                'amount'          => $total,
                'idempotency_key' => $payment->idempotency_key,
            ],
        ], 201);
    }

    // ─── Mes investissements ─────────────────────────────────────────
    public function myInvestments(): JsonResponse
    {
        $investments = Investment::where('investor_id', Auth::id())
            ->with('land:id,title,city,location,price_per_sqm,status')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'investments'    => $investments->map(fn($inv) => $this->formatInvestment($inv)),
            'total_invested' => $investments->where('status', 'confirmed')->sum('total_paid'),
            'total_sqm'      => $investments->where('status', 'confirmed')->sum('sqm_bought'),
        ]);
    }

    // ─── Détail d'un investissement ──────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $investment = Investment::where('id', $id)
            ->where('investor_id', Auth::id())
            ->with(['land', 'payments'])
            ->firstOrFail();

        return response()->json([
            'investment' => $this->formatInvestment($investment, detailed: true),
        ]);
    }

    // ─── Confirmer manuellement (route legacy) ───────────────────────
    // Garde pour compatibilité — délègue à PaymentController
    public function confirm(Request $request, int $id): JsonResponse
    {
        $investment = Investment::where('id', $id)
            ->where('investor_id', Auth::id())
            ->with(['land', 'payments', 'investor'])
            ->firstOrFail();

        if ($investment->status === 'confirmed') {
            return response()->json([
                'message' => 'Cet investissement est déjà confirmé.',
                'code'    => 'ALREADY_CONFIRMED',
            ], 400);
        }

        $payment = $investment->payments()->latest()->first();
        if (!$payment) {
            return response()->json(['message' => 'Aucun paiement trouvé.'], 404);
        }

        $paymentController = app(PaymentController::class);
        $paymentController->confirmPayment($payment, 'MANUAL-' . strtoupper(uniqid()));

        $investment->refresh();

        return response()->json([
            'message'    => 'Paiement confirmé ! Votre investissement est validé.',
            'investment' => [
                'id'              => $investment->id,
                'reference'       => $investment->reference,
                'status'          => 'confirmed',
                'confirmed_at'    => $investment->confirmed_at,
                'certificate_url' => $investment->certificate_url,
            ],
        ]);
    }

    // ─── Liste admin ─────────────────────────────────────────────────
    public function adminIndex(Request $request): JsonResponse
    {
        $investments = Investment::with([
            'investor:id,first_name,last_name,email',
            'land:id,title,city',
            'payments',
        ])->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'investments' => $investments->map(fn($inv) => $this->formatInvestment($inv)),
            'meta' => [
                'total'        => $investments->total(),
                'current_page' => $investments->currentPage(),
                'last_page'    => $investments->lastPage(),
            ],
        ]);
    }

    // ─── Stats investissements par mois (admin) ──────────────────────
    public function investmentStats(): JsonResponse
    {
        $data = Investment::where('status', 'confirmed')
            ->selectRaw("TO_CHAR(confirmed_at, 'Mon') as month, COUNT(*) as count, SUM(total_paid) as revenue")
            ->whereNotNull('confirmed_at')
            ->groupByRaw("TO_CHAR(confirmed_at, 'Mon'), DATE_TRUNC('month', confirmed_at)")
            ->orderByRaw("DATE_TRUNC('month', confirmed_at) ASC")
            ->limit(12)
            ->get();

        return response()->json([
            'investments' => $data->map(fn($r) => [
                'month'   => $r->month,
                'count'   => (int) $r->count,
                'revenue' => (float) $r->revenue,
            ]),
        ]);
    }

    // ─── Format investissement ────────────────────────────────────────
    private function formatInvestment(Investment $inv, bool $detailed = false): array
    {
        $paymentMethod = $inv->payments?->first()?->method ?? null;

        return [
            'id'              => $inv->id,
            'reference'       => $inv->reference,
            'status'          => $inv->status,
            'sqm_bought'      => $inv->sqm_bought,
            'unit_price'      => $inv->unit_price,
            'subtotal'        => $inv->subtotal,
            'commission'      => $inv->commission,
            'total_paid'      => $inv->total_paid,
            'confirmed_at'    => $inv->confirmed_at,
            'created_at'      => $inv->created_at,
            'payment_method'  => $paymentMethod,
            'certificate_url' => $inv->certificate_url ?? null,
            'tx_hash'         => $inv->tx_hash ?? null,
            'investor' => $inv->investor ? [
                'id'         => $inv->investor->id,
                'first_name' => $inv->investor->first_name,
                'last_name'  => $inv->investor->last_name,
                'email'      => $inv->investor->email,
            ] : null,
            'land' => $inv->land ? [
                'id'            => $inv->land->id,
                'title'         => $inv->land->title,
                'city'          => $inv->land->city,
                'location'      => $inv->land->location ?? null,
                'price_per_sqm' => $inv->land->price_per_sqm,
            ] : null,
            'payments' => $detailed ? ($inv->payments ?? []) : [],
        ];
    }
}
