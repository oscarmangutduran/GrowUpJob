<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\CompanyReview;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies with their reviews and worker-awarded insignias.
     */
    public function index(Request $request)
    {
        $query = Company::with(['reviews' => function ($q) {
            $q->orderBy('created_at', 'desc');
        }]);

        // 1. Text Search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sector', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // 2. Sector / Filter tag
        if ($sector = $request->query('sector')) {
            if ($sector !== 'Todas') {
                $query->where(function ($q) use ($sector) {
                    $q->where('filter_tag', $sector)
                      ->orWhere('sector', 'like', "%{$sector}%");
                });
            }
        }

        $companies = $query->orderBy('rating', 'desc')->get();

        $formatted = $companies->map(function ($comp) {
            return [
                'id' => (string) $comp->id,
                'name' => $comp->name,
                'sector' => $comp->sector,
                'size' => $comp->size,
                'rating' => (float) $comp->rating,
                'ratingCount' => (int) $comp->rating_count,
                'vacantes' => (int) $comp->vacantes,
                'descripcion' => $comp->descripcion,
                'logoColor' => $comp->logo_color,
                'logoIcon' => $comp->logo_icon,
                'filterTag' => $comp->filter_tag,
                'topCultura' => $comp->top_cultura_rank ? [
                    'rank' => (int) $comp->top_cultura_rank,
                    'quote' => $comp->top_cultura_quote,
                ] : null,
                'insigniasObtenidas' => $comp->insignias_obtenidas ?? [],
                'metricasCandidaturas' => [
                    'tiempoRespuesta' => in_array('respuesta_rapida', $comp->insignias_obtenidas ?? []) ? '< 24 horas' : '< 48 horas',
                    'tasaRespuesta' => '98%',
                    'ghostingRate' => '0%',
                    'satisfaccionEntrevistas' => round($comp->rating, 1) . ' / 5.0',
                ],
                'reseñas' => $comp->reviews->map(function ($rev) {
                    return [
                        'id' => (string) $rev->id,
                        'autor' => $rev->autor,
                        'cargo' => $rev->cargo,
                        'texto' => $rev->texto,
                        'rating' => (int) $rev->rating,
                        'fecha' => $rev->fecha ?? ($rev->created_at ? $rev->created_at->diffForHumans() : 'Reciente'),
                        'insigniasVotadas' => $rev->insignias_votadas ?? [],
                    ];
                }),
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $formatted->count(),
            'empresas' => $formatted,
        ]);
    }

    /**
     * Display the specified company with its full details and reviews.
     */
    public function show($id)
    {
        $company = Company::with('reviews')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'empresa' => $company,
        ]);
    }

    /**
     * Submit a worker review with rating and badge votes.
     * The company rating and earned badges are automatically recalculated.
     */
    public function storeReview(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $request->validate([
            'autor' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'texto' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'insignias_votadas' => 'nullable|array',
            'insignias_votadas.*' => 'string|in:respuesta_rapida,feedback_garantizado,cero_ghosting,transparencia_salarial,entrevistas_top,proceso_agil,ambiente,flexible,liderazgo,salario,remoto,diversidad,formacion,sostenible,conciliacion,equity',
        ]);

        $review = CompanyReview::create([
            'company_id' => $company->id,
            'user_id' => $request->user() ? $request->user()->id : null,
            'autor' => $request->autor,
            'cargo' => $request->cargo,
            'texto' => $request->texto,
            'rating' => $request->rating,
            'fecha' => 'Hoy',
            'insignias_votadas' => $request->insignias_votadas ?? [],
        ]);

        // Recalculate company rating and badges awarded by worker votes!
        $company->recalculateRatingAndInsignias();

        return response()->json([
            'status' => 'success',
            'message' => 'Reseña e insignias votadas registradas correctamente.',
            'reseña' => $review,
            'empresa' => $company->fresh(['reviews']),
        ], 201);
    }
}
