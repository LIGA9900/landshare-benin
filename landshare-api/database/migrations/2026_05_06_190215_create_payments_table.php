<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('investment_id')
                ->constrained('investments')
                ->onDelete('cascade');

            // Mode de paiement
            $table->enum('method', [
                'mtn_momo',
                'moov_money',
                'stripe',
                'paystack',
                'simulation',  // pour les tests
            ]);

            // Données transaction
            $table->string('provider_reference')->nullable(); // ID retourné par MTN/Stripe
            $table->decimal('amount', 15, 2);
            $table->char('currency', 3)->default('XOF'); // Franc CFA

            // Statut
            $table->enum('status', [
                'initiated',  // demande envoyée
                'pending',    // en attente confirmation
                'success',    // paiement confirmé
                'failed',     // échoué
                'expired',    // timeout
                'refunded',   // remboursé
            ])->default('initiated');

            // Mobile Money
            $table->string('phone_number')->nullable();

            // Anti double-paiement
            $table->string('idempotency_key')->unique();

            $table->timestamp('webhook_received_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
