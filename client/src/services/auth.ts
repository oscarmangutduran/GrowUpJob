import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Completa cualquier sesión de autenticación pendiente si se regresa desde el navegador
WebBrowser.maybeCompleteAuthSession();

/**
 * Autenticación real con LinkedIn usando OpenID Connect (OIDC)
 * Cumple con la especificación de Supabase Auth v2 y Expo SDK
 */
export async function signInWithLinkedIn() {
  try {
    if (Platform.OS === 'web') {
      // En Web: Redirección estándar completa hacia el proveedor OAuth de LinkedIn
      const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: redirectUri,
          scopes: 'openid profile email',
        },
      });

      if (error) throw error;
      return data;
    }

    // En Entornos Nativos (iOS y Android): Deep Linking con esquema 'growupjob://'
    const redirectUri = makeRedirectUri({
      scheme: 'growupjob',
      path: 'auth-callback',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: redirectUri,
        scopes: 'openid profile email',
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No se generó la URL de autorización de LinkedIn');

    // Abre el navegador del sistema de forma segura (ASWebAuthenticationSession en iOS / CustomTabs en Android)
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);

      // 1. Flujo PKCE: Intercambio de código de autorización por sesión
      const code = url.searchParams.get('code');
      if (code) {
        const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) throw sessionError;
        return sessionData.session;
      }

      // 2. Flujo Implícito: Extracción de tokens en hash (#) o query (?)
      const hash = url.hash.startsWith('#') ? url.hash.substring(1) : url.hash;
      const hashParams = new URLSearchParams(hash);
      const accessToken = url.searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token') || hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) throw sessionError;
        return sessionData.session;
      }
    }

    return null;
  } catch (error: any) {
    console.error('Error en autenticación con LinkedIn:', error.message);
    throw error;
  }
}

/**
 * Autenticación real con Google OAuth
 */
export async function signInWithGoogle() {
  try {
    if (Platform.OS === 'web') {
      const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      return data;
    }

    const redirectUri = makeRedirectUri({
      scheme: 'growupjob',
      path: 'auth-callback',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No se generó la URL de autorización de Google');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      if (code) {
        const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) throw sessionError;
        return sessionData.session;
      }

      const hash = url.hash.startsWith('#') ? url.hash.substring(1) : url.hash;
      const hashParams = new URLSearchParams(hash);
      const accessToken = url.searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token') || hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) throw sessionError;
        return sessionData.session;
      }
    }

    return null;
  } catch (error: any) {
    console.error('Error en autenticación con Google:', error.message);
    throw error;
  }
}

/**
 * Autenticación mediante Email y Contraseña en Supabase
 */
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Registro de nuevo usuario en Supabase con metadata de perfil
 */
export async function signUpWithEmail(email: string, password: string, name: string, role: 'candidato' | 'empresa') {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });
}

/**
 * Cierre de sesión en Supabase
 */
export async function signOut() {
  return await supabase.auth.signOut();
}
