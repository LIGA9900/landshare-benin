<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'land_id',
        'uploaded_by',
        'type',
        'file_name',
        'file_url',
        'file_size',
        'mime_type',
        'is_public',
        'is_verified',
        // ✅ Ajout — colonnes pour les attestations
        'reference',
        'hash',
    ];

    protected $casts = [
        'is_public'   => 'boolean',
        'is_verified' => 'boolean',
    ];

    // ── Relations ──────────────────────────────────────────────────

    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // ── Relation inverse vers Investment ───────────────────────────
    // Permet Document::with('investment') dans VerifyController
    public function investment()
    {
        return $this->belongsTo(Investment::class, 'reference', 'reference');
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'title_deed'     => 'Titre foncier',
            'cadastral_plan' => 'Plan cadastral',
            'notary_report'  => 'Rapport notarial',
            'photo'          => 'Photo du terrain',
            'drone_photo'    => 'Photo drone',
            'other'          => 'Autre',
            default          => 'Inconnu',
        };
    }

    public function getFileSizeFormattedAttribute(): string
    {
        if (!$this->file_size) return 'N/A';
        $kb = $this->file_size / 1024;
        if ($kb < 1024) return round($kb, 1) . ' Ko';
        return round($kb / 1024, 1) . ' Mo';
    }
}
