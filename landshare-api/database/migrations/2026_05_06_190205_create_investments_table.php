<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('investor_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('land_id')
                ->constrained('lands')
                ->onDelete('cascade');

            $table->foreignId('reservation_id')
                ->nullable()
                ->constrained('reservations')
                ->onDelete('set null');

            // Données financières
            $table->integer('sqm_bought');
            $table->decimal('unit_price', 15, 2);      // prix au moment de l'achat
            $table->decimal('subtotal', 15, 2);
            $table->decimal('commission', 15, 2)->default(0);
            $table->decimal('total_paid', 15, 2);

            // Statut
            $table->enum('status', [
                'reserved',   // en cours de paiement
                'confirmed',  // paiement confirmé
                'failed',     // paiement échoué
                'cancelled',  // annulé
                'refunded',   // remboursé
            ])->default('reserved');

            // Référence unique (ex: LS-0042)
            $table->string('reference')->unique();

            // Attestation PDF
            $table->string('certificate_url')->nullable();

            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
