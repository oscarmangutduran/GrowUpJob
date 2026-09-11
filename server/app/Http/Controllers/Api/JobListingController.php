<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobListing;

class JobListingController extends Controller
{
    /**
     * Display a listing of job opportunities with all frontend filters.
     */
    public function index(Request $request)
    {
        $query = JobListing::query();

        // 1. Text Search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhereJsonContains('tags', $search);
            });
        }

        // 2. Modality filter ('100% Remoto', 'Híbrido', 'Presencial')
        if ($modality = $request->query('modality')) {
            if ($modality !== 'Todo' && $modality !== 'Cualquiera') {
                $query->where('modality', $modality);
            }
        }

        // 3. Jornada filter ('Completa', 'Parcial')
        if ($jornada = $request->query('jornada')) {
            if ($jornada !== 'Cualquiera') {
                $query->where('jornada', $jornada);
            }
        }

        // 4. Verified filter
        if ($request->has('verified') && filter_var($request->query('verified'), FILTER_VALIDATE_BOOLEAN)) {
            $query->where('verified', true);
        }

        // 5. Min salary filter
        if ($minSalary = $request->query('min_salary')) {
            // E.g. '30000', '40000' or '> 30.000€'
            preg_match('/(\d+)/', str_replace('.', '', (string) $minSalary), $matches);
            if (!empty($matches[1])) {
                $val = (int) $matches[1];
                // Regex or custom check for stored salary text e.g. '48K - 60K €'
                $query->where(function ($q) use ($val) {
                    $q->whereNotNull('salary');
                });
            }
        }

        $listings = $query->orderBy('created_at', 'desc')->get();

        // Format listings to conform to frontend Job interface if desired
        $formatted = $listings->map(function ($job) {
            return [
                'id' => (string) $job->id,
                'title' => $job->title,
                'company' => $job->company_name,
                'location' => $job->location,
                'salary' => $job->salary ?? 'A convenir',
                'salaryColor' => $job->salary_color,
                'modality' => $job->modality,
                'jornada' => $job->jornada,
                'postedAt' => $job->created_at ? $job->created_at->diffForHumans() : 'Reciente',
                'logoColor' => $job->logo_color ?? 'bg-indigo-100 text-indigo-700',
                'logoInitial' => $job->logo_initial ?? strtoupper(substr($job->company_name, 0, 1)),
                'tags' => $job->tags ?? [],
                'verified' => (bool) $job->verified,
                'badge' => $job->badge,
                'fastApply' => (bool) $job->fast_apply,
                'description' => $job->description,
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $formatted->count(),
            'listings' => $formatted,
        ]);
    }

    /**
     * Store a newly created job listing in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'empresa') {
            return response()->json([
                'status' => 'error',
                'message' => 'Solo los usuarios con rol de empresa pueden publicar ofertas de empleo.'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'modality' => 'nullable|string|in:100% Remoto,Híbrido,Presencial',
            'jornada' => 'nullable|string|in:Completa,Parcial',
            'tags' => 'nullable|array',
            'verified' => 'nullable|boolean',
            'fast_apply' => 'nullable|boolean',
        ]);

        $listing = JobListing::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'company_name' => $request->company_name,
            'description' => $request->description,
            'location' => $request->location,
            'salary' => $request->salary,
            'type' => $request->type ?? 'Jornada Completa',
            'modality' => $request->modality ?? 'Presencial',
            'jornada' => $request->jornada ?? 'Completa',
            'tags' => $request->tags ?? [],
            'verified' => $request->verified ?? false,
            'badge' => $request->badge,
            'fast_apply' => $request->fast_apply ?? false,
            'logo_color' => $request->logo_color ?? 'bg-blue-100 text-blue-700',
            'logo_initial' => strtoupper(substr($request->company_name, 0, 1)),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Oferta de empleo publicada correctamente.',
            'listing' => $listing,
        ], 201);
    }
}
