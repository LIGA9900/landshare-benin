<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class NotificationController extends Controller
{
    // ── GET /api/notifications ────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $user  = Auth::user();
        $query = Notification::where('user_id', $user->id)->orderBy('created_at', 'desc');

        if ($request->query('filter') === 'unread') {
            $query->whereNull('read_at');
        }
        if ($type = $request->query('type')) {
            if ($type !== 'all') $query->where('type', $type);
        }

        return response()->json([
            'notifications' => $query->get()->map(fn($n) => $this->format($n)),
            'unread_count'  => Notification::where('user_id', $user->id)->whereNull('read_at')->count(),
        ]);
    }

    // ── GET /api/notifications/unread-count ───────────────────────
    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'count' => Notification::where('user_id', Auth::id())->whereNull('read_at')->count(),
        ]);
    }

    // ── PUT /api/notifications/{id}/read ─────────────────────────
    public function markRead(int $id): JsonResponse
    {
        $notif = Notification::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        if (! $notif->read_at) $notif->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marquée comme lue.', 'notification' => $this->format($notif)]);
    }

    // ── PUT /api/notifications/read-all ───────────────────────────
    public function markAllRead(): JsonResponse
    {
        $updated = Notification::where('user_id', Auth::id())->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues.', 'updated' => $updated]);
    }

    // ── DELETE /api/notifications/{id} ───────────────────────────
    public function destroy(int $id): JsonResponse
    {
        Notification::where('id', $id)->where('user_id', Auth::id())->firstOrFail()->delete();
        return response()->json(['message' => 'Notification supprimée.']);
    }

    // ── DELETE /api/notifications ─────────────────────────────────
    public function destroyAll(): JsonResponse
    {
        $deleted = Notification::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Toutes les notifications ont été supprimées.', 'deleted' => $deleted]);
    }

    // ── POST /api/admin/notifications/send ───────────────────────
    public function adminSend(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type'    => 'required|string|in:paiement,attestation,kyc,terrain,alerte,info,systeme',
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'action'  => 'nullable|array',
            'terrain' => 'nullable|string',
        ]);

        $notif = Notification::notify(
            userId: $request->user_id,
            type: $request->type,
            title: $request->title,
            message: $request->message,
            terrain: $request->terrain,
            action: $request->action,
        );

        return response()->json(['message' => 'Notification envoyée.', 'notification' => $this->format($notif)], 201);
    }

    // ── POST /api/admin/notifications/broadcast ──────────────────
    public function adminBroadcast(Request $request): JsonResponse
    {
        $request->validate([
            'type'    => 'required|string|in:paiement,attestation,kyc,terrain,alerte,info,systeme',
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'action'  => 'nullable|array',
        ]);

        $users   = \App\Models\User::where('status', 'active')->where('role', 'investor')->pluck('id');
        $now     = now();
        $records = $users->map(fn(int $uid) => [
            'user_id'    => $uid,
            'type'       => $request->type,
            'title'      => $request->title,
            'message'    => $request->message,
            'action'     => $request->action ? json_encode($request->action) : null,
            'terrain'    => null,
            'read_at'    => null,
            'created_at' => $now,
            'updated_at' => $now,
        ])->toArray();

        Notification::insert($records);

        return response()->json(['message' => 'Notification envoyée à tous les investisseurs.', 'recipients' => count($records)], 201);
    }

    // ─── Helper ───────────────────────────────────────────────────
    private function format(Notification $n): array
    {
        return [
            'id'         => $n->id,
            'type'       => $n->type,
            'titre'      => $n->title,
            'message'    => $n->message,
            'read'       => ! is_null($n->read_at),
            'read_at'    => $n->read_at,
            'terrain'    => $n->terrain,
            'action'     => $n->action,
            'date'       => $n->created_at->translatedFormat('d M Y'),
            'time'       => $n->created_at->format('H:i'),
            'created_at' => $n->created_at,
        ];
    }
}
