<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Document;
use App\Services\AttestationService;
use Illuminate\Http\JsonResponse;

class VerifyController extends Controller
{
    public function verify(string $query): JsonResponse
    {
        $query = trim($query);

        if (empty($query)) {
            return response()->json(['message' => 'Requête vide.'], 400);
        }

        // Hash SHA-256 = exactement 64 caractères hexadécimaux
        $isHash = preg_match('/^[a-f0-9]{64}$/i', $query);

        if ($isHash) {
            return $this->searchByHash($query);
        }

        return $this->searchByReference($query);
    }

    // ─── Recherche par référence ───────────────────────────────────
    private function searchByReference(string $ref): JsonResponse
    {
        // Cherche directement dans investments par référence (ex: LS-0013)
        $investment = Investment::with(['land', 'investor'])
            ->where('reference', $ref)
            ->where('status', 'confirmed')
            ->first();

        if ($investment) {
            return $this->formatResult($investment, $this->getHash($investment));
        }

        // Cherche aussi dans documents par référence (ex: ATT-2026-LS-00013)
        // ✅ CORRECTION : suppression du ->where('category', ...) inexistant
        $document = Document::with(['investment.land', 'investment.investor'])
            ->where('reference', $ref)
            ->whereNotNull('hash')
            ->first();

        if ($document && $document->investment) {
            return $this->formatResult($document->investment, $document->hash);
        }

        return response()->json(['message' => 'Investissement introuvable.'], 404);
    }

    // ─── Recherche par hash SHA-256 ────────────────────────────────
    private function searchByHash(string $hash): JsonResponse
    {
        // ✅ Cherche dans la table documents — c'est là que le hash est stocké
        $document = Document::with(['investment.land', 'investment.investor'])
            ->where('hash', $hash)
            ->first();

        if ($document && $document->investment) {
            return $this->formatResult($document->investment, $hash);
        }

        // ✅ Fallback — recalculer le hash pour tous les investissements confirmés
        // Utile si le document n'a pas encore été créé mais l'investment existe
        $attestationService = app(AttestationService::class);

        $investment = Investment::with(['land', 'investor'])
            ->where('status', 'confirmed')
            ->get()
            ->first(function ($inv) use ($hash, $attestationService) {
                return $attestationService->generateHash($inv) === $hash;
            });

        if ($investment) {
            return $this->formatResult($investment, $hash);
        }

        return response()->json(['message' => 'Document introuvable avec ce hash.'], 404);
    }

    // ─── Récupérer le hash d'un investissement ─────────────────────
    private function getHash(Investment $investment): ?string
    {
        // Chercher dans documents d'abord
        $doc = Document::where('reference', $investment->reference)
            ->whereNotNull('hash')
            ->first();

        if ($doc) return $doc->hash;

        // Recalculer si pas trouvé
        return app(AttestationService::class)->generateHash($investment);
    }

    // ─── Formater la réponse publique ──────────────────────────────
    private function formatResult(Investment $investment, ?string $hash): JsonResponse
    {
        $investor = $investment->investor;
        $land     = $investment->land;

        // Masquer le nom : "Fouad LIGALI" → "F. LIGALI"
        $maskedName = null;
        if ($investor) {
            $firstName = $investor->first_name ?? '';
            $lastName  = $investor->last_name  ?? '';
            $full      = trim($firstName . ' ' . $lastName);
            if ($full) {
                $parts      = explode(' ', $full);
                $maskedName = strtoupper($parts[0][0] ?? '') . '. '
                    . implode(' ', array_slice($parts, 1));
            }
        }

        // ✅ CORRECTION : tx_hash au lieu de blockchain_tx_hash
        $txHash = $investment->tx_hash ?? null;

        return response()->json([
            'reference' => $investment->reference,
            'terrain'   => $land?->title ?? '—',
            'city'      => $land?->city  ?? '—',
            'sqm'       => $investment->sqm_bought,
            'amount'    => (float) $investment->total_paid,
            'investor'  => $maskedName,
            'date'      => $investment->confirmed_at
                ? $investment->confirmed_at->format('d M Y')
                : $investment->created_at->format('d M Y'),
            'status'    => $investment->status,
            'hash'      => $hash,
            // ✅ Blockchain — utilise tx_hash et blockchain_network
            'blockchain' => $txHash ? [
                'tx_hash'  => $txHash,
                'network'  => $investment->blockchain_network ?? 'localhost',
                'explorer' => $investment->blockchain_network === 'amoy'
                    ? 'https://amoy.polygonscan.com/tx/' . $txHash
                    : null,
                'anchored_at' => $investment->anchored_at,
            ] : null,
        ]);
    }
}
