<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user with email and password.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Authenticate user with email and password.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Credenciales inválidas',
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Authenticate or register via Google.
     */
    public function googleLogin(Request $request)
    {
        $request->validate([
            'access_token' => 'nullable|string',
            'id_token' => 'nullable|string',
        ]);

        $accessToken = $request->access_token;
        $idToken = $request->id_token;

        if (!$accessToken && !$idToken) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token de Google requerido (access_token o id_token)',
            ], 400);
        }

        $googleUser = null;

        // For local development and demo testing when Google Client IDs are not yet configured:
        if (config('app.env') === 'local' && $accessToken === 'mock_google_access_token_demo') {
            $googleUser = [
                'sub' => 'mock-google-id-123456',
                'email' => 'google-demo@growupjob.com',
                'name' => 'Usuario Google Demo',
            ];
        }

        // 1. Try accessing userinfo using access_token
        if ($accessToken && !$googleUser) {
            try {
                $response = Http::get('https://www.googleapis.com/oauth2/v3/userinfo', [
                    'access_token' => $accessToken,
                ]);

                if ($response->successful()) {
                    $googleUser = $response->json();
                }
            } catch (\Exception $e) {
                Log::error('Google Auth access_token verification failed: ' . $e->getMessage());
            }
        }

        // 2. If access_token failed or was not provided, try verifying id_token
        if (!$googleUser && $idToken) {
            try {
                $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
                    'id_token' => $idToken,
                ]);

                if ($response->successful()) {
                    $googleUser = $response->json();
                }
            } catch (\Exception $e) {
                Log::error('Google Auth id_token verification failed: ' . $e->getMessage());
            }
        }

        if (!$googleUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'No se pudo verificar el token con Google',
            ], 401);
        }

        // Google user profile fields mapping:
        // sub or id is the unique Google User ID
        $googleId = $googleUser['sub'] ?? $googleUser['id'] ?? null;
        $email = $googleUser['email'] ?? null;
        $name = $googleUser['name'] ?? $googleUser['given_name'] ?? 'Google User';

        if (!$googleId || !$email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos insuficientes del perfil de Google',
            ], 422);
        }

        // Find or create user
        $user = User::where('google_id', $googleId)->first();

        if (!$user) {
            // Check if user already exists with the email
            $user = User::where('email', $email)->first();

            if ($user) {
                // Link account
                $user->google_id = $googleId;
                $user->save();
            } else {
                // Create user
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'password' => null, // Password is null for social sign-ins
                ]);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Google Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Log out current user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sesión cerrada con éxito',
        ]);
    }

    /**
     * Retrieve authenticated user details.
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ]);
    }
}
