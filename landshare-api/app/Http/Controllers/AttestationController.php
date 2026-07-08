<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Services\AttestationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AttestationController extends Controller
{
    public function __construct(
        private AttestationService $attestationService
    ) {}

    // ─── Télécharger l'attestation PDF ───────────────────────────────
    public function download(int $investmentId)
    {
        $investment = Investment::where('id', $investmentId)
            ->where('investor_id', Auth::id())
            ->where('status', 'confirmed')
            ->with(['investor', 'land', 'payments'])
            ->firstOrFail();

        return $this->attestationService->download($investment);
    }

    // ─── Régénérer l'attestation (admin) ─────────────────────────────
    public function regenerate(int $investmentId): JsonResponse
    {
        $investment = Investment::where('id', $investmentId)
            ->where('status', 'confirmed')
            ->with(['investor', 'land', 'payments'])
            ->firstOrFail();

        $url = $this->attestationService->generate($investment);

        $investment->update(['certificate_url' => $url]);

        return response()->json([
            'message'         => 'Attestation régénérée avec succès.',
            'certificate_url' => $url,
        ]);
    }
}
