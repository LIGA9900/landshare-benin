<?php

namespace App\Http\Controllers;

use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LandController extends Controller
{
    // ─── Liste des terrains publiés (public) ────────────────────────
    public function index(Request $request): JsonResponse
    {
        $query = Land::where('status', 'published')
            ->with(['operator:id,first_name,last_name'])
            ->orderBy('created_at', 'desc');

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        if ($request->max_price) {
            $query->where('price_per_sqm', '<=', $request->max_price);
        }
        if ($request->available_only) {
            $query->where('available_sqm', '>', 0);
        }

        $lands = $query->paginate(12);

        return response()->json([
            'lands' => $lands->map(fn($land) => $this->formatLand($land)),
            'meta'  => [
                'total'        => $lands->total(),
                'current_page' => $lands->currentPage(),
                'last_page'    => $lands->lastPage(),
            ],
        ]);
    }

    // ─── Détail d'un terrain (public) ───────────────────────────────
    public function show(int $id): JsonResponse
    {
        $land = Land::with([
            'operator:id,first_name,last_name',
            'documents'  => fn($q) => $q->where('is_public', true),
            'valuations' => fn($q) => $q->orderBy('valuation_date', 'desc')->limit(1),
        ])->findOrFail($id);

        return response()->json([
            'land' => $this->formatLand($land, detailed: true),
        ]);
    }

    // ─── Créer un terrain ────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'subtitle'           => 'nullable|string|max:255',
            'description'        => 'nullable|string',
            'city'               => 'required|string|max:100',
            'district'           => 'nullable|string|max:100',
            'location'           => 'nullable|string|max:255',
            'latitude'           => 'nullable|numeric|between:-90,90',
            'longitude'          => 'nullable|numeric|between:-180,180',
            'total_sqm'          => 'required|integer|min:1',
            'price_per_sqm'      => 'required|numeric|min:0',
            'rendement'          => 'nullable|numeric|min:0|max:100',
            'notary_name'        => 'nullable|string|max:255',
            'notary_cabinet'     => 'nullable|string|max:255',
            'notary_verified_at' => 'nullable|date',
            'title_deed'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'survey_plan'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'main_photo'         => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'extra_photos'       => 'nullable|array',
            'extra_photos.*'     => 'file|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $land = Land::create([
            'title'              => $validated['title'],
            'subtitle'           => $validated['subtitle']           ?? null,
            'description'        => $validated['description']        ?? null,
            'city'               => $validated['city'],
            'district'           => $validated['district']           ?? null,
            'location'           => $validated['location']           ?? null,
            'latitude'           => $validated['latitude']           ?? null,
            'longitude'          => $validated['longitude']          ?? null,
            'total_sqm'          => $validated['total_sqm'],
            'available_sqm'      => $validated['total_sqm'],
            'price_per_sqm'      => $validated['price_per_sqm'],
            'rendement'          => $validated['rendement']          ?? null,
            'notary_name'        => $validated['notary_name']        ?? null,
            'notary_cabinet'     => $validated['notary_cabinet']     ?? null,
            'notary_verified_at' => $validated['notary_verified_at'] ?? null,
            'operator_id'        => Auth::id(),
            'status'             => 'draft',
        ]);

        $basePath = "lands/{$land->id}";

        if ($request->hasFile('title_deed')) {
            $path = $request->file('title_deed')->store("{$basePath}/documents", 'public');
            $land->update(['title_deed_url' => Storage::url($path)]);
        }
        if ($request->hasFile('survey_plan')) {
            $path = $request->file('survey_plan')->store("{$basePath}/documents", 'public');
            $land->update(['survey_plan_url' => Storage::url($path)]);
        }
        if ($request->hasFile('main_photo')) {
            $path = $request->file('main_photo')->store("{$basePath}/photos", 'public');
            $land->update(['main_photo_url' => Storage::url($path)]);
        }
        if ($request->hasFile('extra_photos')) {
            $urls = [];
            foreach ($request->file('extra_photos') as $photo) {
                $path   = $photo->store("{$basePath}/photos", 'public');
                $urls[] = Storage::url($path);
            }
            $land->update(['extra_photos_urls' => json_encode($urls)]);
        }

        return response()->json([
            'message' => 'Terrain créé avec succès.',
            'land'    => $this->formatLand($land->fresh()),
        ], 201);
    }

    // ─── Modifier un terrain ─────────────────────────────────────────
    public function update(Request $request, int $id): JsonResponse
    {
        $land = Land::findOrFail($id);

        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->isAdmin() && $land->operator_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'title'              => 'sometimes|string|max:255',
            'subtitle'           => 'nullable|string|max:255',
            'description'        => 'nullable|string',
            'city'               => 'sometimes|string|max:100',
            'district'           => 'nullable|string|max:100',
            'location'           => 'nullable|string|max:255',
            'latitude'           => 'nullable|numeric|between:-90,90',
            'longitude'          => 'nullable|numeric|between:-180,180',
            'price_per_sqm'      => 'sometimes|numeric|min:0',
            'rendement'          => 'nullable|numeric|min:0|max:100',
            'notary_name'        => 'nullable|string|max:255',
            'notary_cabinet'     => 'nullable|string|max:255',
            'notary_verified_at' => 'nullable|date',
            'title_deed'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'survey_plan'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'main_photo'         => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $land->update(array_filter($validated, fn($v) => !is_null($v) && !($v instanceof \Illuminate\Http\UploadedFile)));

        $basePath = "lands/{$land->id}";
        if ($request->hasFile('title_deed')) {
            $path = $request->file('title_deed')->store("{$basePath}/documents", 'public');
            $land->update(['title_deed_url' => Storage::url($path)]);
        }
        if ($request->hasFile('survey_plan')) {
            $path = $request->file('survey_plan')->store("{$basePath}/documents", 'public');
            $land->update(['survey_plan_url' => Storage::url($path)]);
        }
        if ($request->hasFile('main_photo')) {
            $path = $request->file('main_photo')->store("{$basePath}/photos", 'public');
            $land->update(['main_photo_url' => Storage::url($path)]);
        }

        return response()->json([
            'message' => 'Terrain mis à jour.',
            'land'    => $this->formatLand($land->fresh()),
        ]);
    }

    // ─── Publier un terrain ──────────────────────────────────────────
    public function publish(int $id): JsonResponse
    {
        $land = Land::findOrFail($id);

        if ($land->status !== 'draft') {
            return response()->json(['message' => 'Seul un terrain en brouillon peut être publié.'], 400);
        }

        $land->update(['status' => 'published', 'published_at' => now()]);

        return response()->json([
            'message' => 'Terrain publié avec succès.',
            'land'    => $this->formatLand($land->fresh()),
        ]);
    }

    // ─── Archiver un terrain ─────────────────────────────────────────
    public function archive(int $id): JsonResponse
    {
        $land = Land::findOrFail($id);
        $land->update(['status' => 'archived']);
        return response()->json(['message' => 'Terrain archivé.']);
    }

    // ─── Liste admin ─────────────────────────────────────────────────
    // ✅ withCount pour investors_count
    public function adminIndex(Request $request): JsonResponse
    {
        $lands = Land::with('operator:id,first_name,last_name')
            ->withCount([
                'investments as investors_count' => fn($q) => $q->where('status', 'confirmed'),
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'lands' => $lands->map(fn($land) => $this->formatLand($land)),
            'meta'  => [
                'total'        => $lands->total(),
                'current_page' => $lands->currentPage(),
                'last_page'    => $lands->lastPage(),
            ],
        ]);
    }

    // ─── Format terrain ──────────────────────────────────────────────
    private function formatLand(Land $land, bool $detailed = false): array
    {
        $data = [
            'id'               => $land->id,
            'title'            => $land->title,
            'subtitle'         => $land->subtitle,
            'city'             => $land->city,
            'district'         => $land->district,
            'location'         => $land->location,
            'total_sqm'        => $land->total_sqm,
            'available_sqm'    => $land->available_sqm,
            'price_per_sqm'    => $land->price_per_sqm,
            'rendement'        => $land->rendement,
            'status'           => $land->status,
            'funding_progress' => $land->funding_progress,
            'notary_name'      => $land->notary_name,
            'notary_cabinet'   => $land->notary_cabinet,
            'notary_verified_at' => $land->notary_verified_at,
            'main_photo_url'   => $land->main_photo_url,
            'published_at'     => $land->published_at,
            'created_at'       => $land->created_at,
            // ✅ Nombre d'investisseurs (via withCount)
            'investors_count'  => (int) ($land->investors_count ?? 0),
            'operator'         => $land->operator ? [
                'id'   => $land->operator->id,
                'name' => $land->operator->full_name,
            ] : null,
        ];

        if ($detailed) {
            $data['description']       = $land->description;
            $data['latitude']          = $land->latitude;
            $data['longitude']         = $land->longitude;
            $data['title_deed_url']    = $land->title_deed_url;
            $data['survey_plan_url']   = $land->survey_plan_url;
            $data['extra_photos_urls'] = $land->extra_photos_urls
                ? json_decode($land->extra_photos_urls, true)
                : [];
            $data['documents']         = $land->documents ?? [];
            $data['last_valuation']    = $land->valuations?->first()?->estimated_value_per_sqm;
        }

        return $data;
    }
}
