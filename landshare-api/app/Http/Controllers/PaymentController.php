<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Payment;
use App\Models\Notification;
use App\Services\AttestationService;
use App\Services\BlockchainService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\PaymentConfirmedMail;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function __construct(
        private AttestationService $attestationService,
        private BlockchainService  $blockchainService,
    ) {}

    // ─── Initier un paiement (appelé depuis PaymentController direct) ─
    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'investment_id' => 'required|integer|exists:investments,id',
            'method'        => 'required|in:mtn_momo,moov_money,stripe,paystack,simulation',
            'phone_number'  => 'required_if:method,mtn_momo,moov_money|nullable|string',
        ]);

        $investment = Investment::where('id', $validated['investment_id'])
            ->where('investor_id', Auth::id())
            ->where('status', 'reserved')
            ->firstOrFail();

        $existingPayment = Payment::where('investment_id', $investment->id)
            ->whereIn('status', ['initiated', 'pending'])
            ->first();

        if ($existingPayment) {
            return response()->json([
                'message' => 'Un paiement est déjà en cours pour cet investissement.',
                'payment' => [
                    'id'     => $existingPayment->id,
                    'status' => $existingPayment->status,
                    'method' => $existingPayment->method,
                    'amount' => $existingPayment->amount,
                ],
            ], 200);
        }

        $payment = Payment::create([
            'investment_id'   => $investment->id,
            'method'          => $validated['method'],
            'amount'          => $investment->total_paid,
            'currency'        => 'XOF',
            'status'          => 'initiated',
            'phone_number'    => $validated['phone_number'] ?? null,
            'idempotency_key' => Payment::generateIdempotencyKey($investment->id),
        ]);

        if ($validated['method'] === 'simulation') {
            return $this->simulateSuccess($payment, $investment);
        }

        return response()->json([
            'message' => 'Paiement initié. Confirmez sur votre téléphone.',
            'payment' => [
                'id'              => $payment->id,
                'method'          => $payment->method,
                'amount'          => $payment->amount,
                'currency'        => $payment->currency,
                'status'          => $payment->status,
                'idempotency_key' => $payment->idempotency_key,
                'phone_number'    => $payment->phone_number,
            ],
        ], 201);
    }

    // ─── Statut paiement ─────────────────────────────────────────────
    public function status(int $id): JsonResponse
    {
        $payment = Payment::where('id', $id)
            ->whereHas('investment', fn($q) => $q->where('investor_id', Auth::id()))
            ->with('investment:id,reference,status,sqm_bought,total_paid,land_id')
            ->firstOrFail();

        return response()->json([
            'payment' => [
                'id'                  => $payment->id,
                'method'              => $payment->method,
                'amount'              => $payment->amount,
                'status'              => $payment->status,
                'provider_reference'  => $payment->provider_reference,
                'webhook_received_at' => $payment->webhook_received_at,
                'investment'          => $payment->investment,
            ],
        ]);
    }

    // ─── Webhook MTN MoMo ─────────────────────────────────────────────
    public function webhookMomo(Request $request): JsonResponse
    {
        $referenceId = $request->input('referenceId') ?? $request->input('externalId');
        $status      = $request->input('status');

        if (!$referenceId) {
            return response()->json(['message' => 'referenceId manquant.'], 400);
        }

        $payment = Payment::where('provider_reference', $referenceId)
            ->orWhere('idempotency_key', $referenceId)
            ->first();

        if (!$payment) {
            return response()->json(['message' => 'Paiement introuvable.'], 404);
        }

        if ($payment->status === 'success') {
            return response()->json(['message' => 'Déjà traité.'], 200);
        }

        if ($status === 'SUCCESSFUL') {
            $this->confirmPayment($payment, $referenceId);
        } else {
            $payment->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'Webhook traité.'], 200);
    }

    // ─── Webhook Stripe ───────────────────────────────────────────────
    public function webhookStripe(Request $request): JsonResponse
    {
        $eventType = $request->input('type');
        $object    = $request->input('data.object');

        if ($eventType === 'payment_intent.succeeded') {
            $payment = Payment::where(
                'idempotency_key',
                $object['metadata']['idempotency_key'] ?? null
            )->first();

            if ($payment && $payment->status !== 'success') {
                $this->confirmPayment($payment, $object['id']);
            }
        }

        return response()->json(['received' => true], 200);
    }

    // ─── Simulation ───────────────────────────────────────────────────
    private function simulateSuccess(Payment $payment, Investment $investment): JsonResponse
    {
        $this->confirmPayment($payment, 'SIM-' . strtoupper(uniqid()));
        $investment->refresh();

        return response()->json([
            'message' => '✅ Paiement simulé avec succès !',
            'payment' => [
                'id'     => $payment->id,
                'status' => 'success',
                'amount' => $payment->amount,
                'method' => 'simulation',
            ],
            'investment' => [
                'id'              => $investment->id,
                'reference'       => $investment->reference,
                'status'          => 'confirmed',
                'confirmed_at'    => $investment->confirmed_at,
                'certificate_url' => $investment->certificate_url,
            ],
        ]);
    }

    // ─── Confirmer paiement — appelé aussi depuis InvestmentController
    // ✅ PUBLIC pour que InvestmentController puisse l'appeler
    public function confirmPayment(Payment $payment, string $providerRef): void
    {
        // ── Étape 1 : Transaction BDD ────────────────────────────────
        DB::transaction(function () use ($payment, $providerRef) {
            $payment->update([
                'status'              => 'success',
                'provider_reference'  => $providerRef,
                'webhook_received_at' => now(),
            ]);

            $investment = $payment->investment;
            $investment->update([
                'status'       => 'confirmed',
                'confirmed_at' => now(),
            ]);

            $land = $investment->land;
            if ($land && $land->available_sqm !== null) {
                $newAvailable = $land->available_sqm - $investment->sqm_bought;
                $land->update([
                    'available_sqm' => max(0, $newAvailable),
                    'status'        => $newAvailable <= 0 ? 'full' : $land->status,
                ]);
            }

            if ($investment->reservation_id) {
                $investment->reservation?->update(['status' => 'converted']);
            }
        });

        // ── Étape 2 : Attestation + Blockchain + Notifications ───────
        try {
            $investment = $payment->investment()
                ->with(['investor', 'land', 'payments'])
                ->first();

            if (!$investment || !$investment->investor || !$investment->land) {
                Log::warning("confirmPayment : relations manquantes pour payment #{$payment->id}");
                return;
            }

            Log::info("=== Confirmation payment #{$payment->id} — {$investment->reference} ===");

            // ✅ Attestation PDF
            $certificateUrl = $this->attestationService->generate($investment);
            $investment->update(['certificate_url' => $certificateUrl]);
            Log::info("Attestation générée : {$certificateUrl}");

            // ✅ Ancrage blockchain
            if (config('blockchain.enabled', true)) {
                $txHash = $this->blockchainService->anchor($investment->fresh());
                Log::info("Blockchain tx_hash : " . ($txHash ?? 'NULL'));
            }

            // ✅ Notifications
            Notification::notify(
                userId: $investment->investor_id,
                type: 'paiement',
                title: "Paiement confirmé — {$investment->reference}",
                message: "Votre transaction de "
                    . number_format($investment->total_paid, 0, ',', ' ')
                    . " FCFA pour {$investment->sqm_bought} m² sur {$investment->land->title} a été confirmée.",
                terrain: $investment->land->title,
                action: ['label' => 'Voir la transaction', 'href' => '/historique'],
            );

            Notification::notify(
                userId: $investment->investor_id,
                type: 'attestation',
                title: "Attestation disponible — {$investment->reference}",
                message: "Votre attestation est prête au téléchargement dans la section Documents.",
                terrain: $investment->land->title,
                action: ['label' => 'Télécharger', 'href' => '/documents'],
            );

            // ✅ Email
            Mail::to($investment->investor->email)
                ->send(new PaymentConfirmedMail($investment));

            Log::info("=== Confirmation terminée pour {$investment->reference} ===");
        } catch (\Throwable $e) {
            Log::error("Erreur post-confirmation payment #{$payment->id} : " . $e->getMessage());
        }
    }

    // ─── Admin : liste paiements ──────────────────────────────────────
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Payment::with([
            'investment.investor:id,first_name,last_name,email',
            'investment.land:id,title,city',
        ])->orderBy('created_at', 'desc');

        if ($request->status) $query->where('status', $request->status);
        if ($request->method) $query->where('method', $request->method);

        $payments = $query->paginate(20);

        return response()->json([
            'payments' => $payments->map(fn($p) => [
                'id'                 => $p->id,
                'method'             => $p->method,
                'amount'             => $p->amount,
                'status'             => $p->status,
                'provider_reference' => $p->provider_reference,
                'phone_number'       => $p->phone_number,
                'created_at'         => $p->created_at,
                'investment'         => $p->investment ? [
                    'reference' => $p->investment->reference,
                    'investor'  => $p->investment->investor?->full_name,
                    'land'      => $p->investment->land?->title,
                ] : null,
            ]),
            'meta' => [
                'total'        => $payments->total(),
                'current_page' => $payments->currentPage(),
                'last_page'    => $payments->lastPage(),
            ],
        ]);
    }

    // ─── Revenus mensuels (admin) ─────────────────────────────────────
    public function revenueStats(): JsonResponse
    {
        $data = Payment::where('status', 'success')
            ->selectRaw("TO_CHAR(created_at, 'Mon') as month, SUM(amount) as revenue, COUNT(*) as transactions")
            ->whereNotNull('created_at')
            ->groupByRaw("TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)")
            ->orderByRaw("DATE_TRUNC('month', created_at) ASC")
            ->limit(12)
            ->get();

        return response()->json([
            'revenue' => $data->map(fn($r) => [
                'month'        => $r->month,
                'revenue'      => (float) $r->revenue,
                'transactions' => (int)   $r->transactions,
            ]),
        ]);
    }
}
