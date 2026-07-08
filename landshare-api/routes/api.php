<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AttestationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\VerifyController;
use App\Http\Controllers\ValuationController;

// ═══════════════════════════════════════════════════════════════════
// ROUTES PUBLIQUES (sans authentification)
// ═══════════════════════════════════════════════════════════════════

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::get('lands',      [LandController::class, 'index']);
Route::get('lands/{id}', [LandController::class, 'show']);

Route::get('verify/{query}', [VerifyController::class, 'verify']);

Route::post('webhooks/momo',   [PaymentController::class, 'webhookMomo']);
Route::post('webhooks/stripe', [PaymentController::class, 'webhookStripe']);

// ═══════════════════════════════════════════════════════════════════
// ROUTES PROTÉGÉES (authentification requise)
// ═══════════════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ──────────────────────────────────────────────────────
    Route::post('auth/logout',         [AuthController::class, 'logout']);
    Route::get('auth/me',              [AuthController::class, 'me']);
    Route::put('auth/change-password', [AuthController::class, 'changePassword']);

    // ── Profil & Dashboard investisseur ───────────────────────────
    Route::get('dashboard', [UserController::class, 'dashboard']);
    Route::get('portfolio', [UserController::class, 'portfolio']);
    Route::put('profile',   [UserController::class, 'updateProfile']);

    // ── KYC ───────────────────────────────────────────────────────
    Route::get('kyc/status',  [KycController::class, 'myStatus']);
    Route::post('kyc/submit', [KycController::class, 'store']);

    // ── Réservations ──────────────────────────────────────────────
    Route::post('reservations',               [ReservationController::class, 'store']);
    Route::get('reservations/{id}',           [ReservationController::class, 'show']);
    Route::delete('reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    // ── Investissements ───────────────────────────────────────────
    Route::get('investments',               [InvestmentController::class, 'myInvestments']);
    Route::post('investments',              [InvestmentController::class, 'store']);
    Route::get('investments/{id}',          [InvestmentController::class, 'show']);
    Route::post('investments/{id}/confirm', [InvestmentController::class, 'confirm']);

    // ── Paiements ─────────────────────────────────────────────────
    Route::post('payments/initiate',   [PaymentController::class, 'initiate']);
    Route::get('payments/{id}/status', [PaymentController::class, 'status']);

    // ── Valorisations (historique public pour investisseur) ───────
    Route::get('lands/{land}/valuations', [ValuationController::class, 'publicHistory']);

    // ── Attestations ──────────────────────────────────────────────
    Route::get('investments/{id}/attestation', [AttestationController::class, 'download']);

    // ── Notifications ─────────────────────────────────────────────
    Route::prefix('notifications')->group(function () {
        Route::get('/',            [NotificationController::class, 'index']);
        Route::get('unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('read-all',     [NotificationController::class, 'markAllRead']);
        Route::put('{id}/read',    [NotificationController::class, 'markRead']);
        Route::delete('/',         [NotificationController::class, 'destroyAll']);
        Route::delete('{id}',      [NotificationController::class, 'destroy']);
    });

    // ── Documents investisseur ────────────────────────────────────
    Route::prefix('documents')->group(function () {
        Route::get('/',             [DocumentController::class, 'index']);
        Route::get('attestations',  [DocumentController::class, 'attestations']);
        Route::get('kyc',           [DocumentController::class, 'kycDocuments']);
        Route::get('{id}',          [DocumentController::class, 'show']);
        Route::get('{id}/download', [DocumentController::class, 'download']);
        Route::delete('{id}',       [DocumentController::class, 'destroy']);
    });

    // ═══════════════════════════════════════════════════════════════
    // ROUTES ADMIN
    // ═══════════════════════════════════════════════════════════════
    Route::middleware('check.role:admin')->prefix('admin')->group(function () {

        // Utilisateurs
        Route::get('users',             [UserController::class, 'adminIndex']);
        Route::get('users/{id}',        [UserController::class, 'adminShow']);
        Route::put('users/{id}/toggle', [UserController::class, 'toggleStatus']);

        // Terrains
        Route::get('lands',               [LandController::class, 'adminIndex']);
        Route::post('lands',                          [LandController::class, 'store']);
        Route::match(['PUT', 'POST'], 'lands/{id}',   [LandController::class, 'update']); // ✅ supporte multipart/form-data
        Route::post('lands/{id}/publish', [LandController::class, 'publish']);
        Route::post('lands/{id}/archive', [LandController::class, 'archive']);

        // ✅ Valorisations foncières
        Route::post('lands/{land}/valuations', [ValuationController::class, 'store']);
        Route::get('lands/{land}/valuations',  [ValuationController::class, 'history']);

        // KYC
        Route::get('kyc',                [KycController::class, 'adminIndex']);
        Route::post('kyc/{id}/validate', [KycController::class, 'validate']);
        Route::post('kyc/{id}/reject',   [KycController::class, 'reject']);

        // Investissements
        Route::get('investments', [InvestmentController::class, 'adminIndex']);

        // Paiements
        Route::get('payments', [PaymentController::class, 'adminIndex']);

        // Attestations admin
        Route::post('investments/{id}/attestation/regenerate', [AttestationController::class, 'regenerate']);

        // Statistiques admin
        Route::prefix('statistics')->group(function () {
            Route::get('/',           [UserController::class, 'adminStatistics']);
            Route::get('revenue',     [PaymentController::class, 'revenueStats']);
            Route::get('investments', [InvestmentController::class, 'investmentStats']);
        });

        // Notifications admin
        Route::prefix('notifications')->group(function () {
            Route::post('send',      [NotificationController::class, 'adminSend']);
            Route::post('broadcast', [NotificationController::class, 'adminBroadcast']);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // ROUTES OPÉRATEUR
    // ═══════════════════════════════════════════════════════════════
    Route::middleware('check.role:operator,admin')
        ->prefix('operator')
        ->group(function () {
            Route::post('lands',                        [LandController::class, 'store']);
            Route::match(['PUT', 'POST'], 'lands/{id}',  [LandController::class, 'update']);
        });
});
