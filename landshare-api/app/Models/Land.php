<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Investment;
use App\Models\Reservation;
use App\Models\Document;
use App\Models\Valuation;

class Land extends Model
{
    use HasFactory;

    protected $fillable = [
        'operator_id',
        'title',
        'subtitle',
        'description',
        'city',
        'district',
        'location',
        'latitude',
        'longitude',
        'total_sqm',
        'available_sqm',
        'price_per_sqm',
        'rendement',
        'status',
        'notary_name',
        'notary_cabinet',
        'notary_verified_at',
        'published_at',
    ];

    protected $casts = [
        'notary_verified_at' => 'date',
        'published_at'       => 'datetime',
        'price_per_sqm'      => 'decimal:2',
        'rendement'          => 'decimal:2',
        'latitude'           => 'decimal:8',
        'longitude'          => 'decimal:8',
    ];

    // ── Relations ──────────────────────────────────

    // L'opérateur foncier qui gère ce terrain
    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    // Tous les investissements sur ce terrain
    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    // Toutes les réservations actives sur ce terrain
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    // Documents liés au terrain (titre foncier, photos, etc.)
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Historique des valuations
    public function valuations()
    {
        return $this->hasMany(Valuation::class);
    }

    // ── Helpers ────────────────────────────────────

    // Pourcentage de financement
    public function getFundingProgressAttribute(): float
    {
        if ($this->total_sqm === 0) return 0;
        $sold = $this->total_sqm - $this->available_sqm;
        return round(($sold / $this->total_sqm) * 100, 1);
    }

    // Vérifie si le terrain est disponible
    public function isAvailable(): bool
    {
        return $this->status === 'published' && $this->available_sqm > 0;
    }

    // Vérifie si assez de m² disponibles
    public function hasEnoughSqm(int $sqm): bool
    {
        return $this->available_sqm >= $sqm;
    }
    
}
