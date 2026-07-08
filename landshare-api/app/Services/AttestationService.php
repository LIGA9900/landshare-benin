<?php

namespace App\Services;

use App\Models\Investment;
use App\Models\Document;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

// ═══════════════════════════════════════════════════════════════════
// AttestationService — ✅ Corrigé
//
// Corrections :
// 1. QR code — nouvelle API endroid/qr-code v4+
//    setSize() n'existe plus → passer les options au constructeur
// 2. Sauvegarde hash — dans documents.hash au lieu de investments.document_hash
//    (la colonne document_hash n'existe pas dans investments)
// 3. Suppression des requêtes avec colonnes inexistantes
//    (reference et category n'existent pas dans documents)
// ═══════════════════════════════════════════════════════════════════

class AttestationService
{
    // ─── URL de base pour la vérification ────────────────────────────
    private string $verifyBaseUrl = 'https://landshare.bj/verifier';

    // ─── Générer et sauvegarder l'attestation PDF ────────────────────
    public function generate(Investment $investment): string
    {
        $investment->load(['investor', 'land', 'payments']);

        $latestPayment = $investment->payments()
            ->where('status', 'success')
            ->latest()
            ->first();

        $paymentMethod     = $latestPayment ? $this->formatMethod($latestPayment->method) : 'N/A';
        $hash              = $this->generateHash($investment);
        $attestationNumber = $this->generateAttestationNumber($investment);
        $qrCodeBase64      = $this->generateQrCode($investment->reference);

        $pdf = Pdf::loadView('pdf.attestation', [
            'investment'         => $investment,
            'investor'           => $investment->investor,
            'attestation_number' => $attestationNumber,
            'payment_method'     => $paymentMethod,
            'hash'               => $hash,
            'qr_code_base64'     => $qrCodeBase64,
        ]);

        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled'      => false,
            'defaultFont'          => 'DejaVu Sans',
            'dpi'                  => 150,
        ]);

        $fileName = "attestations/{$investment->reference}_{$attestationNumber}.pdf";
        Storage::disk('public')->put($fileName, $pdf->output());

        // ✅ CORRECTION 2 — Sauvegarder le hash dans la table documents
        // L'ancienne version faisait $investment->update(['document_hash' => $hash])
        // mais la colonne document_hash n'existe pas dans investments.
        // On sauvegarde dans documents.hash avec uploaded_by = investor_id.
        // On vérifie d'abord si un document existe déjà pour cette référence.
        $existingDoc = Document::where('file_name', "Attestation_{$investment->reference}.pdf")
            ->where('uploaded_by', $investment->investor_id)
            ->first();

        if ($existingDoc) {
            // ✅ Mettre à jour hash, référence et URL
            $existingDoc->update([
                'hash'      => $hash,
                'reference' => $investment->reference,
                'file_url'  => Storage::url($fileName),
            ]);
        } else {
            // Créer un nouveau document
            Document::create([
                'land_id'     => $investment->land_id,
                'uploaded_by' => $investment->investor_id,
                'type'        => 'other', // attestation PDF — seule valeur générique acceptée
                'file_name'   => "Attestation_{$investment->reference}.pdf",
                'file_url'    => Storage::url($fileName),
                'file_size'   => 0,
                'mime_type'   => 'application/pdf',
                'is_public'   => false,
                'is_verified' => true,
                'reference'   => $investment->reference,
                'hash'        => $hash,
            ]);
        }

        return Storage::url($fileName);
    }

    // ─── Télécharger l'attestation ────────────────────────────────────
    public function download(Investment $investment)
    {
        $investment->load(['investor', 'land', 'payments']);

        $latestPayment = $investment->payments()
            ->where('status', 'success')
            ->latest()
            ->first();

        $paymentMethod     = $latestPayment ? $this->formatMethod($latestPayment->method) : 'N/A';
        $hash              = $this->generateHash($investment);
        $attestationNumber = $this->generateAttestationNumber($investment);
        $qrCodeBase64      = $this->generateQrCode($investment->reference);

        $pdf = Pdf::loadView('pdf.attestation', [
            'investment'         => $investment,
            'investor'           => $investment->investor,
            'attestation_number' => $attestationNumber,
            'payment_method'     => $paymentMethod,
            'hash'               => $hash,
            'qr_code_base64'     => $qrCodeBase64,
        ]);

        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled'      => false,
            'defaultFont'          => 'DejaVu Sans',
            'dpi'                  => 150,
        ]);

        return $pdf->download("Attestation_{$investment->reference}.pdf");
    }

    // ─── Générer le QR code en base64 ────────────────────────────────
    //
    // ✅ API endroid/qr-code v6.x
    //
    // En v6, QrCode prend uniquement $data dans le constructeur.
    // La taille et la marge se passent au PngWriter via les options.
    // Il n'y a plus de Builder ni de setSize().
    //
    private function generateQrCode(string $reference): ?string
    {
        try {
            $url = "{$this->verifyBaseUrl}/{$reference}";

            // ✅ v6 : constructeur prend uniquement les données
            $qrCode = new \Endroid\QrCode\QrCode($url);

            // ✅ v6 : PngWriter écrit le QR code
            $writer = new \Endroid\QrCode\Writer\PngWriter();
            $result = $writer->write($qrCode);

            return base64_encode($result->getString());
        } catch (\Throwable $e) {
            // QR code non critique — on continue sans
            Log::warning("QR code non généré pour {$reference} : " . $e->getMessage());
            return null;
        }
    }

    // ─── Générer le numéro d'attestation ─────────────────────────────
    private function generateAttestationNumber(Investment $investment): string
    {
        return 'ATT-' . date('Y') . '-LS-' . str_pad($investment->id, 5, '0', STR_PAD_LEFT);
    }

    // ─── Générer le hash SHA-256 de vérification ─────────────────────
    public function generateHash(Investment $investment): string
    {
        $data = implode('|', [
            $investment->id,
            $investment->reference,
            $investment->investor_id,
            $investment->land_id,
            $investment->sqm_bought,
            $investment->total_paid,
            $investment->confirmed_at,
        ]);

        return hash('sha256', $data);
    }

    // ─── Format lisible du mode de paiement ──────────────────────────
    private function formatMethod(string $method): string
    {
        return match ($method) {
            'mtn_momo'   => 'MTN MoMo',
            'moov_money' => 'Moov Money',
            'stripe'     => 'Stripe',
            'paystack'   => 'Paystack',
            'simulation' => 'Simulation (test)',
            default      => 'Inconnu',
        };
    }
}
