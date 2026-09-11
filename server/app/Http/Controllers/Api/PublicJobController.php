<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PublicJob;

class PublicJobController extends Controller
{
    /**
     * Display a listing of public job calls (convocatorias).
     */
    public function index(Request $request)
    {
        $query = PublicJob::query();

        // 1. Text search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('organismo', 'like', "%{$search}%")
                  ->orWhere('requisito', 'like', "%{$search}%")
                  ->orWhere('regimen', 'like', "%{$search}%");
            });
        }

        // 2. Ambit filter ('Estado (AGE)', 'Comunidades', 'Local', 'Sanitario', 'Docente')
        if ($ambit = $request->query('ambit')) {
            if ($ambit !== 'Todos') {
                $query->where('ambit', $ambit);
            }
        }

        // 3. Subgroup filter ('A1', 'A2', 'C1', 'C2')
        if ($subgrupo = $request->query('subgrupo')) {
            if ($subgrupo !== 'Todos') {
                $query->where('subgrupo', $subgrupo);
            }
        }

        // 4. Status filter ('urgente', 'abierto', 'listas', 'proximamente')
        if ($status = $request->query('status')) {
            if ($status !== 'Todos') {
                $query->where('status', $status);
            }
        }

        $jobs = $query->orderBy('created_at', 'desc')->get();

        $formatted = $jobs->map(function ($job) {
            return [
                'id' => (string) $job->id,
                'status' => $job->status,
                'statusLabel' => $job->status_label,
                'statusDays' => $job->status_days,
                'subgrupo' => $job->subgrupo,
                'subgrupoColor' => $job->subgrupo_color,
                'ambit' => $job->ambit,
                'title' => $job->title,
                'organismo' => $job->organismo,
                'plazas' => (int) $job->plazas,
                'requisito' => $job->requisito,
                'regimen' => $job->regimen,
                'sistema' => $job->sistema,
                'ctaLabel' => $job->cta_label,
                'ctaVariant' => $job->cta_variant,
                'extraInfo' => $job->extra_info,
                'boeUrl' => $job->boe_url,
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $formatted->count(),
            'convocatorias' => $formatted,
        ]);
    }

    /**
     * Store a new public job posting.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'organismo' => 'required|string|max:255',
            'status' => 'required|string|in:urgente,abierto,listas,proximamente',
            'status_label' => 'required|string|max:255',
            'subgrupo' => 'required|string|max:10',
            'plazas' => 'required|integer|min:1',
            'requisito' => 'required|string|max:255',
            'regimen' => 'required|string|max:255',
        ]);

        $job = PublicJob::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Convocatoria pública creada exitosamente',
            'convocatoria' => $job,
        ], 201);
    }
}
