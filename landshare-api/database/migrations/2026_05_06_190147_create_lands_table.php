<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lands', function (Blueprint $table) {
            $table->id();

            // Relation avec l'opérateur foncier (user)
            $table->foreignId('operator_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Informations générales
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('city');
            $table->string('district')->nullable();
            $table->string('location')->nullable(); // texte complet ex: "Abomey-Calavi, Atlantique"

            // Géolocalisation
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Données foncières
            $table->integer('total_sqm');           // superficie totale
            $table->integer('available_sqm');       // parts restantes
            $table->decimal('price_per_sqm', 15, 2); // prix par m²
            $table->decimal('rendement', 5, 2)->nullable(); // rendement estimé %

            // Statut
            $table->enum('status', [
                'draft',        // brouillon
                'published',    // publié et disponible
                'full',         // complet (plus de parts)
                'archived',     // archivé
            ])->default('draft');

            // Informations notariales
            $table->string('notary_name')->nullable();
            $table->string('notary_cabinet')->nullable();
            $table->date('notary_verified_at')->nullable();

            // Métadonnées
            $table->timestamp('published_at')->nullable();
            $table->timestamps(); // created_at + updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
