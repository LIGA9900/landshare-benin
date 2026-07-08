<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Investment;
use App\Models\KycDocument;

class DocumentController extends Controller
{
    // ── GET /api/documents ────────────────────────────────────────
    public function index(): JsonResponse
    {
        $user         = Auth::user();
        $attestations = $this->getAttestations($user->id);
        $kycDocs      = $this->getKycDocs($user->id);

        $all = collect($attestations)
            ->merge($kycDocs)
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'documents'          => $all,
            'total'              => $all->count(),
            'attestations_count' => count($attestations),
            'kyc_count'          => count($kycDocs),
        ]);
    }

    // ── GET /api/documents/attestations ───────────────────────────
    public function attestations(): JsonResponse
    {
        $docs = $this->getAttestations(Auth::id());
        return response()->json(['documents' => $docs, 'total' => count($docs)]);
    }

    // ── GET /api/documents/kyc ────────────────────────────────────
    public function kycDocuments(): JsonResponse
    {
        $docs = $this->getKycDocs(Auth::id());
        return response()->json(['documents' => $docs, 'total' => count($docs)]);
    }

    // ── GET /api/documents/{id} ───────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $user = Auth::user();

        $investment = Investment::where('investor_id', $user->id)
            ->where('id', $id)
            ->where('status', 'confirmed')
            ->whereNotNull('certificate_url')
            ->first();

        if ($investment) {
            return response()->json(['document' => $this->formatAttestation($investment)]);
        }

        $kycDoc = KycDocument::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json(['document' => $this->formatKycDoc($kycDoc)]);
    }

    // ── GET /api/documents/{id}/download ─────────────────────────
    // ✅ Utilise response()->download() avec chemin absolu
    public function download(Request $request, int $id)
    {
        $user = Auth::user();
        $type = $request->query('type', 'attestation');

        if ($type === 'attestation') {
            $investment = Investment::where('investor_id', $user->id)
                ->where('id', $id)
                ->where('status', 'confirmed')
                ->whereNotNull('certificate_url')
                ->firstOrFail();

            $path = $this->normalizePath($investment->certificate_url);

            if (! Storage::disk('public')->exists($path)) {
                return response()->json(['message' => 'Fichier introuvable.'], 404);
            }

            return response()->download(
                Storage::disk('public')->path($path),
                "Attestation_LandShare_{$investment->reference}.pdf",
                ['Content-Type' => 'application/pdf']
            );
        }

        // KYC
        $kycDoc = KycDocument::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $path = $this->normalizePath($kycDoc->file_path ?? $kycDoc->file_url ?? '');

        if (! $path || ! Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }

        $ext      = pathinfo($path, PATHINFO_EXTENSION);
        $fileName = "KYC_{$user->first_name}_{$user->last_name}_{$id}.{$ext}";

        return response()->download(Storage::disk('public')->path($path), $fileName);
    }

    // ── DELETE /api/documents/{id} ────────────────────────────────
    // Supprime uniquement les docs KYC (attestations = archives légales intouchables)
    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();

        $kycDoc = KycDocument::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $path = $this->normalizePath($kycDoc->file_path ?? $kycDoc->file_url ?? '');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        $kycDoc->delete();

        return response()->json(['message' => 'Document supprimé.']);
    }

    // ─── Helpers privés ──────────────────────────────────────────
    private function getAttestations(int $userId): array
    {
        return Investment::where('investor_id', $userId)
            ->where('status', 'confirmed')
            ->whereNotNull('certificate_url')
            ->with('land:id,title,city')
            ->orderBy('confirmed_at', 'desc')
            ->get()
            ->map(fn($inv) => $this->formatAttestation($inv))
            ->toArray();
    }

    private function getKycDocs(int $userId): array
    {
        return KycDocument::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($doc) => $this->formatKycDoc($doc))
            ->toArray();
    }

    private function formatAttestation(Investment $inv): array
    {
        return [
            'id'           => $inv->id,
            'category'     => 'attestation',
            'type'         => 'pdf',
            'name'         => "Attestation — {$inv->reference}",
            'description'  => 'Attestation d\'investissement — ' . ($inv->land->title ?? 'Terrain LandShare'),
            'reference'    => $inv->reference,
            'terrain'      => $inv->land->title ?? null,
            'city'         => $inv->land->city  ?? null,
            'sqm'          => $inv->sqm_bought,
            'amount'       => (float) $inv->total_paid,
            'status'       => 'verified',
            'size'         => '~120 Ko',
            'download_url' => "/api/documents/{$inv->id}/download?type=attestation",
            'date'         => $inv->confirmed_at
                ? \Carbon\Carbon::parse($inv->confirmed_at)->translatedFormat('d M Y')
                : null,
            'created_at'   => $inv->confirmed_at ?? $inv->created_at,
        ];
    }

    private function formatKycDoc(KycDocument $doc): array
    {
        $typeLabels = [
            'national_id'      => "Carte Nationale d'Identité",
            'passport'         => 'Passeport',
            'residence_permit' => 'Titre de séjour',
            'driving_license'  => 'Permis de conduire',
        ];

        $statusLabels = [
            'pending'   => 'En attente',
            'validated' => 'Validé',
            'rejected'  => 'Rejeté',
        ];

        return [
            'id'               => $doc->id,
            'category'         => 'kyc',
            'type'             => $doc->document_type,
            'name'             => $typeLabels[$doc->document_type] ?? 'Document KYC',
            'description'      => "Document de vérification d'identité",
            'reference'        => "KYC-{$doc->id}",
            'terrain'          => null,
            'status'           => $doc->status,
            'status_label'     => $statusLabels[$doc->status] ?? $doc->status,
            'rejection_reason' => $doc->rejection_reason ?? null,
            'size'             => $doc->file_size_formatted ?? 'N/A',
            'download_url'     => "/api/documents/{$doc->id}/download?type=kyc",
            'date'             => $doc->created_at->translatedFormat('d M Y'),
            'created_at'       => $doc->created_at,
        ];
    }

    // ✅ Normalise /storage/xxx → chemin relatif pour Storage::disk('public')
    private function normalizePath(string $urlOrPath): string
    {
        if (str_starts_with($urlOrPath, '/storage/')) {
            return ltrim(str_replace('/storage/', '', $urlOrPath), '/');
        }
        return ltrim($urlOrPath, '/');
    }
}
