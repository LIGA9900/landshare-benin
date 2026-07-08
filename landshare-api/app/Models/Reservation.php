<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'investor_id',
        'land_id',
        'sqm_reserved',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // ── Relations ──────────────────────────────────

    // L'investisseur qui a réservé
    public function investor()
    {
        return $this->belongsTo(User::class, 'investor_id');
    }

    // Le terrain réservé
    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    // L'investissement créé après confirmation
    public function investment()
    {
        return $this->hasOne(Investment::class);
    }

    // ── Helpers ────────────────────────────────────

    // Vérifie si la réservation est encore active
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->expires_at->isFuture();
    }

    // Vérifie si la réservation a expiré
    public function isExpired(): bool
    {
        return $this->expires_at->isPast() || $this->status === 'expired';
    }

    // Temps restant en secondes
    public function getRemainingSecondsAttribute(): int
    {
        if ($this->isExpired()) return 0;
        return max(0, now()->diffInSeconds($this->expires_at));
    }
}
