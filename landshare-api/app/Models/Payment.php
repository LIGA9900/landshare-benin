<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'investment_id',
        'method',
        'provider_reference',
        'amount',
        'currency',
        'status',
        'phone_number',
        'idempotency_key',
        'webhook_received_at',
    ];

    protected $casts = [
        'amount'               => 'decimal:2',
        'webhook_received_at'  => 'datetime',
    ];

    // ── Relations ──────────────────────────────────

    // L'investissement lié à ce paiement
    public function investment()
    {
        return $this->belongsTo(Investment::class);
    }

    // ── Helpers ────────────────────────────────────

    // Vérifie si le paiement est réussi
    public function isSuccess(): bool
    {
        return $this->status === 'success';
    }

    // Vérifie si le paiement est en attente
    public function isPending(): bool
    {
        return in_array($this->status, ['initiated', 'pending']);
    }

    // Label lisible du mode de paiement
    public function getMethodLabelAttribute(): string
    {
        return match ($this->method) {
            'mtn_momo'   => 'MTN MoMo',
            'moov_money' => 'Moov Money',
            'stripe'     => 'Stripe',
            'paystack'   => 'Paystack',
            'simulation' => 'Simulation (test)',
            default      => 'Inconnu',
        };
    }
    // Génère une clé idempotente unique
    public static function generateIdempotencyKey(int $investmentId): string
    {
        return 'pay_' . $investmentId . '_' . uniqid();
    }
}
