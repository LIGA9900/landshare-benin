<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'terrain',
        'action',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'action'  => 'array',
    ];

    // ── Relation ──────────────────────────────────────────────────
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ✅ types Builder explicites ────────────────────────
    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    // ── Helper statique ───────────────────────────────────────────
    public static function notify(
        int     $userId,
        string  $type,
        string  $title,
        string  $message,
        ?string $terrain = null,
        ?array  $action  = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'type'    => $type,
            'title'   => $title,
            'message' => $message,
            'terrain' => $terrain,
            'action'  => $action,
        ]);
    }
}
