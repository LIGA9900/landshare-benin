<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // ─── Inscription ────────────────────────────────────────────────
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8|confirmed',
            'phone'      => 'nullable|string|max:20',
            'country'    => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name'       => $validated['first_name'] . ' ' . $validated['last_name'],
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'phone'      => $validated['phone'] ?? null,
            'country'    => $validated['country'] ?? null,
            'role'       => 'investor',
            'status'     => 'active',
            'kyc_status' => 'none',
        ]);

        try {
            Mail::to($user->email)->send(new WelcomeMail($user));
        } catch (\Exception $e) {
            Log::error('Erreur email welcome: ' . $e->getMessage());
        }


        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ], 201);
    }

    // ─── Connexion ──────────────────────────────────────────────────
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Votre compte a été suspendu. Contactez le support.',
            ], 403);
        }

        // Mise à jour de la dernière connexion
        $user->update(['last_login_at' => now()]);

        // Révoquer les anciens tokens avant d'en créer un nouveau
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ]);
    }

    // ─── Déconnexion ────────────────────────────────────────────────
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    // ─── Profil connecté ────────────────────────────────────────────
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }

    // ─── Changement de mot de passe ─────────────────────────────────
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mot de passe actuel incorrect.',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Révoquer tous les tokens (forcer reconnexion)
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Mot de passe modifié avec succès. Reconnectez-vous.',
        ]);
    }

    // ─── Format utilisateur pour les réponses JSON ──────────────────
    private function formatUser(User $user): array
    {
        return [
            'id'         => $user->id,
            'full_name'  => $user->full_name,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'phone'      => $user->phone,
            'country'    => $user->country,
            'role'       => $user->role,
            'status'     => $user->status,
            'kyc_status' => $user->kyc_status,
            'created_at' => $user->created_at,
        ];
    }
}
