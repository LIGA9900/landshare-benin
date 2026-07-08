<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // Enregistrement des middlewares personnalisés
        $middleware->alias([
            'check.role' => \App\Http\Middleware\CheckRole::class,
        ]);

        // Retourner du JSON au lieu de rediriger vers 'login'
        // quand un utilisateur non authentifié accède à une route protégée
        $middleware->redirectGuestsTo(fn() => response()->json([
            'message' => 'Non authentifié. Veuillez vous connecter.',
            'code'    => 'UNAUTHENTICATED',
        ], 401));
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // Forcer les réponses JSON pour toutes les routes API
        $exceptions->shouldRenderJsonWhen(function ($request, $e) {
            return $request->is('api/*');
        });
    })
    ->create();
