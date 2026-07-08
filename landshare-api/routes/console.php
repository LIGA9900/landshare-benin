<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\ExpireReservations;

// ─── Commande d'expiration manuelle (pour les tests) ─────────────
Artisan::command('reservations:expire', function () {
    $expired = \App\Models\Reservation::where('status', 'active')
        ->where('expires_at', '<', now())
        ->get();

    $count = 0;
    foreach ($expired as $reservation) {
        \DB::transaction(function () use ($reservation) {
            \App\Models\Land::where('id', $reservation->land_id)
                ->increment('available_sqm', $reservation->sqm_reserved);
            $reservation->update(['status' => 'expired']);
        });
        $count++;
    }

    $this->info("✅ {$count} réservation(s) expirée(s).");

})->purpose('Expirer les réservations dont le timer a dépassé 10 minutes');

// ─── Scheduler : toutes les minutes ──────────────────────────────
Schedule::job(new ExpireReservations)->everyMinute();