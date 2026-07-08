<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Informations personnelles
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('phone')->nullable()->after('email');
            $table->string('country')->nullable()->after('phone');

            // Rôle dans le système
            $table->enum('role', [
                'investor',   // investisseur de la diaspora
                'admin',      // administrateur LandShare
                'operator',   // opérateur foncier
            ])->default('investor')->after('country');

            // Statut du compte
            $table->enum('status', [
                'active',
                'suspended',
                'pending',
            ])->default('active')->after('role');

            // KYC
            $table->enum('kyc_status', [
                'none',
                'pending',
                'validated',
                'rejected',
            ])->default('none')->after('status');

            // Métadonnées
            $table->timestamp('last_login_at')->nullable()->after('kyc_status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'phone',
                'country',
                'role',
                'status',
                'kyc_status',
                'last_login_at',
            ]);
        });
    }
};
