<?php
// ═══════════════════════════════════════════════════════════════════
// MIGRATION : create_notifications_table
// Fichier : database/migrations/2025_10_01_000001_create_notifications_table.php
// ═══════════════════════════════════════════════════════════════════

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // Destinataire
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // Type : paiement | attestation | kyc | terrain | alerte | info | systeme
            $table->string('type')->default('info');

            // Contenu
            $table->string('title');
            $table->text('message');

            // Données optionnelles
            $table->string('terrain')->nullable();   // Nom du terrain associé
            $table->json('action')->nullable();      // { label: '...', href: '...' }

            // Statut lecture
            $table->timestamp('read_at')->nullable();

            $table->timestamps();

            // Index pour performances
            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
