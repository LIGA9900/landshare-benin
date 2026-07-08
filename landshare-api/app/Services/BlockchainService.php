<?php

namespace App\Services;

use App\Models\Investment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BlockchainService
{
    // URL du microservice Node.js
    private string $serviceUrl;

    // Réseau blockchain actif
    private string $network;


    public function __construct()
    {
        // ✅ strval() évite l'erreur de type null — config() peut retourner null
        $this->serviceUrl = strval(config('blockchain.service_url', 'http://localhost:3001'));
        $this->network    = strval(config('blockchain.network', 'localhost'));
    }

    // ─── Ancrer un investissement sur la blockchain ───────────────
    //
    // Appelé dans PaymentController::confirmPayment() après la
    // génération de l'attestation PDF.
    //
    // Retourne le tx_hash si succès, null si échec.
    // Un échec blockchain ne bloque JAMAIS la confirmation du paiement.
    //
    public function anchor(Investment $investment): ?string
    {
        // Vérifier que le microservice est configuré
        if (empty($this->serviceUrl)) {
            Log::warning('BlockchainService : BLOCKCHAIN_SERVICE_URL non configuré');
            return null;
        }

        // ✅ Calculer le hash SHA-256 directement via AttestationService
        // On utilise la même méthode que l'attestation PDF pour garantir
        // la cohérence entre le hash ancré on-chain et celui du PDF.
        $attestationService = app(\App\Services\AttestationService::class);
        $docHash = $attestationService->generateHash($investment);

        try {
            Log::info("BlockchainService : ancrage de {$investment->reference} en cours...");

            $response = Http::timeout(30)->post("{$this->serviceUrl}/anchor", [
                'investRef' => $investment->reference,
                'docHash'   => $docHash,
                'terrain'   => $investment->land?->title ?? 'Terrain LandShare',
                'city'      => $investment->land?->city  ?? 'Bénin',
                'amount'    => (int) round((float) $investment->total_paid),
                'sqm'       => (int) $investment->sqm_bought,
            ]); // ✅ point-virgule ajouté

            if ($response->successful() && $response->json('success')) {
                $txHash = $response->json('tx_hash');

                // Sauvegarder le tx_hash dans la base de données
                $investment->update([
                    'tx_hash'            => $txHash,
                    'blockchain_network' => $this->network,
                    'anchored_at'        => now(),
                ]);

                Log::info("BlockchainService : ✅ {$investment->reference} ancré — tx: {$txHash}");
                return $txHash;
            }

            // Cas spécial : déjà ancré (pas une erreur)
            if ($response->json('code') === 'ALREADY_ANCHORED') {
                Log::info("BlockchainService : {$investment->reference} déjà ancré");
                return $investment->tx_hash;
            }

            Log::warning("BlockchainService : échec ancrage {$investment->reference} — " . $response->body());
            return null;
        } catch (\Throwable $e) {
            // Le microservice n'est pas disponible ou timeout
            // On log mais on ne bloque pas le paiement
            Log::error("BlockchainService : erreur pour {$investment->reference} — " . $e->getMessage());
            return null;
        }
    }

    // ─── Vérifier un investissement par référence ─────────────────
    public function verify(string $investRef): ?array
    {
        try {
            $response = Http::timeout(10)->get("{$this->serviceUrl}/verify/{$investRef}");

            if ($response->successful() && $response->json('found')) {
                return $response->json();
            }
            return null;
        } catch (\Throwable $e) {
            Log::error("BlockchainService::verify erreur : " . $e->getMessage());
            return null;
        }
    }

    // ─── Vérifier par hash SHA-256 ────────────────────────────────
    public function verifyByHash(string $docHash): ?array
    {
        try {
            $response = Http::timeout(10)->get("{$this->serviceUrl}/verify-hash/{$docHash}");

            if ($response->successful() && $response->json('found')) {
                return $response->json();
            }
            return null;
        } catch (\Throwable $e) {
            Log::error("BlockchainService::verifyByHash erreur : " . $e->getMessage());
            return null;
        }
    }

    // ─── Vérifier si le microservice est disponible ───────────────
    public function isAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->serviceUrl}/health");
            return $response->successful();
        } catch (\Throwable $e) {
            return false;
        }
    }
}
