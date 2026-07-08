<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('investor_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('land_id')
                ->constrained('lands')
                ->onDelete('cascade');

            $table->integer('sqm_reserved');        // m² réservés
            $table->timestamp('expires_at');        // expiration (10 min)

            $table->enum('status', [
                'active',     // réservation en cours
                'expired',    // timer expiré
                'converted',  // transformée en investissement
                'cancelled',  // annulée par l'utilisateur
            ])->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
