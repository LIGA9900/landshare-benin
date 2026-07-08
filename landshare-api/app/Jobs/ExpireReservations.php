<?php

namespace App\Jobs;

use App\Models\Land;
use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpireReservations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Récupérer toutes les réservations actives expirées
        $expired = Reservation::where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();

        $count = 0;

        foreach ($expired as $reservation) {
            try {
                DB::transaction(function () use ($reservation) {
                    // Remettre les m² disponibles sur le terrain
                    Land::where('id', $reservation->land_id)
                        ->increment('available_sqm', $reservation->sqm_reserved);

                    // Marquer la réservation comme expirée
                    $reservation->update(['status' => 'expired']);
                });

                $count++;

            } catch (\Exception $e) {
                Log::error("Erreur expiration réservation #{$reservation->id}: " . $e->getMessage());
            }
        }

        if ($count > 0) {
            Log::info("Scheduler : {$count} réservation(s) expirée(s) automatiquement.");
        }
    }
}