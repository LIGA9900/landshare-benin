<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('investments', function (Blueprint $table) {

            // Hash de la transaction blockchain
            // Ex : 0xcaa5478a9c1110495d3ebe99e8b9376506f75fd...
            $table->string('tx_hash')->nullable()->after('certificate_url');

            // Réseau sur lequel la transaction a été envoyée
            // Ex : localhost, amoy, bnbtest
            $table->string('blockchain_network')->nullable()->after('tx_hash');

            // Timestamp du moment où l'ancrage blockchain a été fait
            $table->timestamp('anchored_at')->nullable()->after('blockchain_network');
        });
    }

    public function down(): void
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropColumn(['tx_hash', 'blockchain_network', 'anchored_at']);
        });
    }
};
