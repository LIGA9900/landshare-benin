<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KycDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'document_type',
        'file_url',
        'file_url_back',
        'status',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    // ── Relations ──────────────────────────────────

    // L'utilisateur propriétaire du document
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // L'admin qui a reviewé le document
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // ── Helpers ────────────────────────────────────

    // Vérifie si le document est validé
    public function isValidated(): bool
    {
        return $this->status === 'validated';
    }

    // Vérifie si le document est en attente
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    // Label lisible du type de document
    public function getDocumentTypeLabelAttribute(): string
    {
        return match ($this->document_type) {
            'national_id'       => 'Carte Nationale d\'Identité',
            'passport'          => 'Passeport',
            'residence_permit'  => 'Titre de séjour',
            'driving_license'   => 'Permis de conduire',
            default             => 'Document inconnu',
        };
    }
    
}
