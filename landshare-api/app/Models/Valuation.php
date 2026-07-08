<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Valuation extends Model
{
    use HasFactory;

    protected $fillable = [
        'land_id',
        'estimated_value_per_sqm',
        'valuation_date',
        'source',
        'notes',
    ];

    protected $casts = [
        'estimated_value_per_sqm' => 'decimal:2',
        'valuation_date'          => 'date',
    ];

    // ── Relations ──────────────────────────────────

    // Le terrain évalué
    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    // ── Helpers ────────────────────────────────────

    // Calcule la valeur totale du terrain à cette date
    public function getTotalValueAttribute(): float
    {
        return $this->estimated_value_per_sqm * $this->land->total_sqm;
    }
}
