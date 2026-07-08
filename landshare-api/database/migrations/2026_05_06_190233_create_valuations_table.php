<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('valuations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('land_id')
                ->constrained('lands')
                ->onDelete('cascade');

            $table->decimal('estimated_value_per_sqm', 15, 2);
            $table->date('valuation_date');
            $table->string('source')->nullable(); // ex: "estimation interne"
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('valuations');
    }
};
