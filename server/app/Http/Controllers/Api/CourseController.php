<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    /**
     * Display a listing of courses and certifications.
     */
    public function index(Request $request)
    {
        $query = Course::query();

        // 1. Text search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('badge_label', 'like', "%{$search}%")
                  ->orWhere('nivel', 'like', "%{$search}%")
                  ->orWhere('modalidad', 'like', "%{$search}%")
                  ->orWhere('area', 'like', "%{$search}%")
                  ->orWhereJsonContains('tags', $search);
            });
        }

        // 2. Modality / Category Pill filter
        if ($filter = $request->query('filter')) {
            if ($filter === '100% Subvencionados') {
                $query->where('badge', 'gratis');
            } elseif ($filter === 'Gratuitos') {
                $query->where(function ($q) {
                    $q->where('precio', 'like', '%Gratuit%')
                      ->orWhere('badge', 'gratis')
                      ->orWhere('badge', 'ocupados');
                });
            } elseif ($filter === 'Certificaciones') {
                $query->where('badge', 'internacional')
                      ->orWhere('badge', 'camara');
            } elseif ($filter === 'En Vivo') {
                $query->where('modalidad', 'like', '%vivo%');
            }
        }

        // 3. Area filter
        if ($area = $request->query('area')) {
            if ($area !== 'Todos') {
                $query->where('area', $area);
            }
        }

        $courses = $query->orderBy('rating', 'desc')->get();

        $formatted = $courses->map(function ($c) {
            return [
                'id' => (string) $c->id,
                'badge' => $c->badge,
                'badgeLabel' => $c->badge_label,
                'title' => $c->title,
                'horas' => $c->horas,
                'nivel' => $c->nivel,
                'modalidad' => $c->modalidad,
                'area' => $c->area,
                'extras' => $c->extras ?? [],
                'rating' => $c->rating ? (float) $c->rating : null,
                'ratingCount' => (int) $c->rating_count,
                'precio' => $c->precio,
                'precioLabel' => $c->precio_label,
                'inicio' => $c->inicio,
                'aprobados' => $c->aprobados,
                'ctaLabel' => $c->cta_label,
                'ctaVariant' => $c->cta_variant,
                'tags' => $c->tags ?? [],
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $formatted->count(),
            'cursos' => $formatted,
        ]);
    }

    /**
     * Store a new course in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'badge' => 'required|string|in:gratis,ocupados,camara,internacional',
            'badge_label' => 'required|string|max:255',
            'horas' => 'required|string|max:100',
            'nivel' => 'required|string|max:100',
            'modalidad' => 'required|string|max:100',
            'precio' => 'required|string|max:100',
        ]);

        $course = Course::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Curso creado exitosamente',
            'curso' => $course,
        ], 201);
    }
}
