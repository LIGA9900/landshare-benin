<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('land_id')
                ->constrained('lands')
                ->onDelete('cascade');

            $table->foreignId('uploaded_by')
                ->constrained('users')
                ->onDelete('cascade');

            $table->enum('type', [
                'title_deed',       // titre foncier
                'cadastral_plan',   // plan cadastral
                'notary_report',    // rapport notarial
                'photo',            // photo du terrain
                'drone_photo',      // photo drone
                'other',
            ]);

            $table->string('file_name');
            $table->string('file_url');          // URL Cloudinary/S3
            $table->integer('file_size')->nullable(); // en bytes
            $table->string('mime_type')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_verified')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
