<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// ← Les 4 imports manquants ajoutés ici
use App\Models\Investment;
use App\Models\Reservation;
use App\Models\Land;
use App\Models\KycDocument;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Champs qu'on peut remplir en masse
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'country',
        'role',
        'status',
        'kyc_status',
        'last_login_at',
    ];

    // Champs cachés (jamais envoyés en JSON)
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Conversions automatiques de types
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
        'password'          => 'hashed',
    ];

    // ── Relations ──────────────────────────────────

    // Un utilisateur peut avoir plusieurs investissements
    public function investments()
    {
        return $this->hasMany(Investment::class, 'investor_id');
    }

    // Un utilisateur peut avoir plusieurs réservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'investor_id');
    }

    // Un opérateur peut gérer plusieurs terrains
    public function lands()
    {
        return $this->hasMany(Land::class, 'operator_id'); // ← "Land" avec L majuscule corrigé
    }

    // Un utilisateur peut avoir plusieurs documents KYC
    public function kycDocuments()
    {
        return $this->hasMany(KycDocument::class);
    }

    // ── Helpers ────────────────────────────────────

    // Vérifie si l'utilisateur est admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Vérifie si l'utilisateur est opérateur
    public function isOperator(): bool
    {
        return $this->role === 'operator';
    }

    // Vérifie si le KYC est validé
    public function isKycValidated(): bool
    {
        return $this->kyc_status === 'validated';
    }

    // Retourne le nom complet
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}") ?: $this->name;
    }

    // Calcule le total investi
    public function getTotalInvestedAttribute(): float
    {
        return $this->investments()
            ->where('status', 'confirmed')
            ->sum('total_paid');
    }

    // Calcule les m² totaux détenus
    public function getTotalSqmAttribute(): int
    {
        return $this->investments()
            ->where('status', 'confirmed')
            ->sum('sqm_bought');
    }
}
