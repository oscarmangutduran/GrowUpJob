<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserExperience;
use App\Models\UserEducation;
use App\Models\UserLanguage;
use App\Models\UserLink;
use App\Models\JobApplication;

class UserProfileController extends Controller
{
    /**
     * Get full profile of the authenticated user.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        // If no user authenticated, return the demo candidate profile (Elena Morales) or first user
        if (!$user) {
            $user = User::where('email', 'elena.morales@growupjob.com')->first() ?? User::first();
        }

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        $user->load([
            'experiences' => fn($q) => $q->orderBy('current', 'desc')->orderBy('created_at', 'desc'),
            'educations' => fn($q) => $q->orderBy('created_at', 'desc'),
            'languages',
            'links',
            'applications' => fn($q) => $q->orderBy('created_at', 'desc'),
        ]);

        return response()->json([
            'status' => 'success',
            'perfil' => [
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'headline' => $user->headline ?? 'Full Stack Engineer & Cloud Architect',
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $user->location ?? 'Madrid, España',
                'disponible_remoto' => (bool) $user->disponible_remoto,
                'preseleccionada_activa' => (bool) $user->preseleccionada_activa,
                'visibilidad_directa' => $user->visibilidad_directa ?? '+34%',
                'anos_experiencia' => $user->anos_experiencia ?? '8+',
                'match_global' => $user->match_global ?? 94,
                'ofertas_hoy' => $user->ofertas_hoy ?? 14,
                'avatar' => $user->avatar,
                'cv' => [
                    'title' => $user->cv_title ?? 'CV_Elena_Morales_2025.pdf',
                    'size' => $user->cv_size ?? '1.1 MB · PDF',
                    'path' => $user->cv_path,
                ],
                'configuracion' => [
                    'tema' => $user->tema ?? 'Hipnótico oscuro',
                    'notificaciones' => (bool) $user->notificaciones,
                    'visibilidad_reclutadores' => (bool) $user->visibilidad_reclutadores,
                ],
                'candidaturas' => $user->applications->groupBy('status'),
                'experiencias' => $user->experiences,
                'educacion' => $user->educations,
                'idiomas' => $user->languages,
                'enlaces' => $user->links,
            ],
        ]);
    }

    /**
     * Update user profile settings (theme, notifications, recruiter visibility).
     */
    public function updateSettings(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'tema' => 'nullable|string',
            'notificaciones' => 'nullable|boolean',
            'visibilidad_reclutadores' => 'nullable|boolean',
        ]);

        $user->update($request->only(['tema', 'notificaciones', 'visibilidad_reclutadores']));

        return response()->json([
            'status' => 'success',
            'message' => 'Preferencias actualizadas correctamente',
            'configuracion' => [
                'tema' => $user->tema,
                'notificaciones' => (bool) $user->notificaciones,
                'visibilidad_reclutadores' => (bool) $user->visibilidad_reclutadores,
            ],
        ]);
    }

    /**
     * Store new experience for user.
     */
    public function storeExperience(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'period' => 'nullable|string',
            'tags' => 'nullable|array',
            'current' => 'nullable|boolean',
        ]);

        $exp = $request->user()->experiences()->create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Experiencia añadida correctamente',
            'experiencia' => $exp,
        ], 201);
    }
}
