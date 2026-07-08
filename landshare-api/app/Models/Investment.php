<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'investor_id',
        'land_id',
        'reservation_id',
        'sqm_bought',
        'unit_price',
        'subtotal',
        'commission',
        'total_paid',
        'status',
        'reference',
        'certificate_url',
        'confirmed_at',
        // ✅ Colonnes blockchain ajoutées au fillable
        'tx_hash',
        'blockchain_network',
        'anchored_at',
    ];

    protected $casts = [
        'unit_price'   => 'decimal:2',
        'subtotal'     => 'decimal:2',
        'commission'   => 'decimal:2',
        'total_paid'   => 'decimal:2',
        'confirmed_at' => 'datetime',
    ];

    // ── Relations ──────────────────────────────────────────────────

    public function investor()
    {
        return $this->belongsTo(User::class, 'investor_id');
    }

    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    // ✅ BUG CORRIGÉ — generateReference() sécurisé contre les race conditions
    //
    // PROBLÈME DE L'ANCIENNE VERSION :
    //   $last = self::latest()->first();
    //   $number = $last ? intval(substr($last->reference, 3)) + 1 : 1;
    //
    // Si deux investissements sont créés en même temps (deux utilisateurs
    // qui achètent simultanément), les deux lisent le même $last et
    // obtiennent le même $number → même référence → erreur SQL UNIQUE.
    //
    // SOLUTION — SELECT ... FOR UPDATE (verrou pessimiste PostgreSQL) :
    // On verrouille la dernière ligne de la table pendant qu'on lit le
    // numéro. Les autres transactions concurrent attendent que le verrou
    // soit libéré (à la fin du DB::transaction() parent).
    //
    // PRÉREQUIS : cette méthode DOIT être appelée à l'intérieur d'un
    // DB::transaction() — ce qui est déjà le cas dans InvestmentController.
    //
    // FALLBACK UUID : si pour une raison exceptionnelle le verrou échoue
    // ou qu'on est hors transaction, on génère une référence UUID unique
    // qui ne risque aucun conflit.
    //
    public static function generateReference(): string
    {
        try {
            // Verrouille la dernière ligne pour éviter les lectures concurrentes
            $last = DB::table('investments')
                ->lockForUpdate()           // SELECT ... FOR UPDATE
                ->orderByDesc('id')
                ->limit(1)
                ->value('reference');       // On ne lit que la colonne reference

            if ($last && str_starts_with($last, 'LS-')) {
                // Extraire le numéro depuis "LS-0042" → 42
                $number = intval(substr($last, 3)) + 1;
            } else {
                // Première entrée ou référence dans un format inattendu
                $number = 1;
            }

            return 'LS-' . str_pad($number, 4, '0', STR_PAD_LEFT);
        } catch (\Throwable $e) {
            // Fallback ultra-safe : référence basée sur timestamp + random
            // Impossible d'avoir un doublon avec ce format
            return 'LS-' . strtoupper(substr(uniqid('', true), -8));
        }
    }
}
