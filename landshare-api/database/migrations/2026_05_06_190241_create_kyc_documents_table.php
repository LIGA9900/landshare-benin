<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kyc_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->enum('document_type', [
                'national_id',      // CNI
                'passport',         // Passeport
                'residence_permit', // Titre de séjour
                'driving_license',  // Permis de conduire
            ]);

            $table->string('file_url');              // URL du document
            $table->string('file_url_back')->nullable(); // verso si CNI

            $table->enum('status', [
                'pending',    // en attente
                'validated',  // approuvé
                'rejected',   // refusé
            ])->default('pending');

            $table->text('rejection_reason')->nullable(); // motif si rejeté
            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kyc_documents');
    }
};
