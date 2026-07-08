<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ═══════════════════════════════════════════════════════════════════
// Migration : add_new_columns_to_lands_table
// Fichier   : database/migrations/2025_11_01_000001_add_new_columns_to_lands_table.php
//
// Commande  : php artisan make:migration add_new_columns_to_lands_table
// ═══════════════════════════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lands', function (Blueprint $table) {

            // ── Informations légales & documents ────────────────────
            // URL du titre foncier uploadé (PDF ou image)
            $table->string('title_deed_url')->nullable()->after('notary_cabinet');

            // URL du plan de bornage uploadé
            $table->string('survey_plan_url')->nullable()->after('title_deed_url');

            // ── Médias ───────────────────────────────────────────────
            // URL de la photo principale du terrain
            $table->string('main_photo_url')->nullable()->after('survey_plan_url');

            // JSON array des URLs des photos supplémentaires
            // Ex: '["\/storage\/lands\/1\/photos\/img1.jpg", ...]'
            $table->text('extra_photos_urls')->nullable()->after('main_photo_url');

            // ── Informations notariales ───────────────────────────────
            // Date de vérification par le notaire (si pas encore dans la table)
            if (! Schema::hasColumn('lands', 'notary_verified_at')) {
                $table->date('notary_verified_at')->nullable()->after('notary_cabinet');
            }

            // ── Infos générales (si pas encore présents) ─────────────
            if (! Schema::hasColumn('lands', 'subtitle')) {
                $table->string('subtitle')->nullable()->after('title');
            }
            if (! Schema::hasColumn('lands', 'district')) {
                $table->string('district')->nullable()->after('city');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lands', function (Blueprint $table) {
            $columns = [
                'title_deed_url',
                'survey_plan_url',
                'main_photo_url',
                'extra_photos_urls',
            ];

            // Ne supprimer que si la colonne existe
            foreach ($columns as $col) {
                if (Schema::hasColumn('lands', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};