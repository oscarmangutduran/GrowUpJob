<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobListingController;
use App\Http\Controllers\Api\PublicJobController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\UserProfileController;

// ── Public routes ─────────────────────────────────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'googleLogin']);

// 1. Empleo (Job listings)
Route::get('/job-listings', [JobListingController::class, 'index']);

// 2. Empleo Público (Public sector jobs / convocatorias)
Route::get('/public-jobs', [PublicJobController::class, 'index']);

// 3. Cursos (Courses & Certifications)
Route::get('/courses', [CourseController::class, 'index']);

// 4. Empresas & Reseñas con Insignias
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{id}', [CompanyController::class, 'show']);
Route::post('/companies/{id}/reviews', [CompanyController::class, 'storeReview']);

// 5. Perfil público o demo
Route::get('/profile/demo', [UserProfileController::class, 'show']);

// ── Protected routes ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // Creation routes
    Route::post('/job-listings', [JobListingController::class, 'store']);
    Route::post('/public-jobs', [PublicJobController::class, 'store']);
    Route::post('/courses', [CourseController::class, 'store']);

    // Perfil del usuario autenticado
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::put('/profile/settings', [UserProfileController::class, 'updateSettings']);
    Route::post('/profile/experiences', [UserProfileController::class, 'storeExperience']);
});
