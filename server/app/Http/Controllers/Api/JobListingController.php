<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\JobListing;

class JobListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = JobListing::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $listings = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'listings' => $listings,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar que el usuario autenticado sea una empresa
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
            'type' => 'required|string|max:255',
        ]);

        $listing = JobListing::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'company_name' => $request->company_name,
            'description' => $request->description,
            'location' => $request->location,
            'salary' => $request->salary,
            'type' => $request->type,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Oferta de empleo publicada correctamente.',
            'listing' => $listing,
        ], 201);
    }
}
