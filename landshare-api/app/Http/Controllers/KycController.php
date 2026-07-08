<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Mail\KycValidatedMail;
use Illuminate\Support\Facades\Mail;

class KycController extends Controller
{
    // ─── Soumettre un document KYC ───────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'document_type' => 'required|in:national_id,passport,residence_permit,driving_license',
            'file'          => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'file_back'     => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->kyc_status === 'validated') {
            return response()->json(['message' => 'Votre KYC est déjà validé.'], 400);
        }

        $filePath = $request->file('file')->store('kyc/' . $user->id, 'public');
        $fileUrl  = Storage::url($filePath);

        $fileUrlBack = null;
        if ($request->hasFile('file_back')) {
            $filePathBack = $request->file('file_back')->store('kyc/' . $user->id, 'public');
            $fileUrlBack  = Storage::url($filePathBack);
        }

        KycDocument::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected', 'rejection_reason' => 'Remplacé par un nouveau document.']);

        $kyc = KycDocument::create([
            'user_id'       => $user->id,
            'document_type' => $request->document_type,
            'file_url'      => $fileUrl,
            'file_url_back' => $fileUrlBack,
            'status'        => 'pending',
        ]);

        $user->update(['kyc_status' => 'pending']);

        return response()->json([
            'message' => 'Document KYC soumis. En attente de validation par notre équipe.',
            'kyc'     => $this->formatKyc($kyc),
        ], 201);
    }

    // ─── Statut KYC de l'utilisateur connecté ───────────────────────
    public function myStatus(): JsonResponse
    {
        $user      = Auth::user();
        $latestKyc = KycDocument::where('user_id', $user->id)->latest()->first();

        return response()->json([
            'kyc_status' => $user->kyc_status,
            'document'   => $latestKyc ? $this->formatKyc($latestKyc) : null,
        ]);
    }

    // ─── Liste admin des KYC ─────────────────────────────────────────
    public function adminIndex(Request $request): JsonResponse
    {
        $status = $request->status ?? 'pending';

        $kycs = KycDocument::where('status', $status)
            ->with('user:id,first_name,last_name,email,country')
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return response()->json([
            'kycs' => $kycs->map(fn($k) => $this->formatKyc($k, detailed: true)),
            'meta' => [
                'total'        => $kycs->total(),
                'current_page' => $kycs->currentPage(),
                'last_page'    => $kycs->lastPage(),
            ],
        ]);
    }

    // ─── Valider un KYC (admin) ──────────────────────────────────────
    public function validate(int $id): JsonResponse
    {
        $kyc = KycDocument::with('user')->findOrFail($id);

        if ($kyc->status !== 'pending') {
            return response()->json(['message' => 'Ce document a déjà été traité.'], 400);
        }

        $kyc->update([
            'status'      => 'validated',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        $kyc->user->update(['kyc_status' => 'validated']);

        // ✅ Notification DANS la méthode, AVANT le return
        Notification::notify(
            userId: $kyc->user_id,
            type: 'kyc',
            title: 'KYC validé avec succès ✓',
            message: 'Votre identité a été vérifiée et validée. Vous pouvez maintenant investir librement sur LandShare Bénin.',
        );

        Mail::to($kyc->user->email)->send(new KycValidatedMail($kyc->user));

        return response()->json([
            'message' => 'KYC validé. L\'utilisateur peut maintenant investir.',
            'kyc'     => $this->formatKyc($kyc->fresh()),
        ]);
    }

    // ─── Rejeter un KYC (admin) ──────────────────────────────────────
    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['reason' => 'nullable|string|max:500']);

        $kyc = KycDocument::with('user')->findOrFail($id);

        if ($kyc->status !== 'pending') {
            return response()->json(['message' => 'Ce document a déjà été traité.'], 400);
        }

        $kyc->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->reason ?? 'Document non conforme.',
            'reviewed_by'      => Auth::id(),
            'reviewed_at'      => now(),
        ]);

        $kyc->user->update(['kyc_status' => 'rejected']);

        // ✅ Notification DANS la méthode, AVANT le return
        Notification::notify(
            userId: $kyc->user_id,
            type: 'alerte',
            title: 'KYC rejeté — Action requise',
            message: 'Votre document a été rejeté. Raison : ' . ($request->reason ?? 'Document non conforme.') . ' Veuillez soumettre un nouveau document.',
        );

        return response()->json([
            'message' => 'KYC rejeté.',
            'kyc'     => $this->formatKyc($kyc->fresh()),
        ]);
    }

    // ─── Format KYC ──────────────────────────────────────────────────
    private function formatKyc(KycDocument $kyc, bool $detailed = false): array
    {
        $data = [
            'id'               => $kyc->id,
            'document_type'    => $kyc->document_type,
            'document_label'   => $kyc->document_type_label ?? $kyc->document_type,
            'status'           => $kyc->status,
            'file_url'         => $kyc->file_url,
            'file_url_back'    => $kyc->file_url_back,
            'rejection_reason' => $kyc->rejection_reason,
            'reviewed_at'      => $kyc->reviewed_at,
            'created_at'       => $kyc->created_at,
        ];

        if ($detailed && $kyc->user) {
            $data['user'] = [
                'id'      => $kyc->user->id,
                'name'    => $kyc->user->full_name,
                'email'   => $kyc->user->email,
                'country' => $kyc->user->country,
            ];
        }

        return $data;
    }
}
