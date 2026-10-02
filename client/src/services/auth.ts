import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithLinkedIn() {
  try {
    const redirectUri = makeRedirectUri({ scheme: 'growupjob' });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No se generó la URL de OAuth para LinkedIn');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const params = url.searchParams;
      const accessToken = params.get('access_token') || url.hash.match(/access_token=([^&]+)/)?.[1];
      const refreshToken = params.get('refresh_token') || url.hash.match(/refresh_token=([^&]+)/)?.[1];

      if (accessToken && refreshToken) {
        return await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }
    return null;
  } catch (error: any) {
    console.error('Error en autenticación con LinkedIn:', error.message);
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const redirectUri = makeRedirectUri({ scheme: 'growupjob' });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No se generó la URL de OAuth para Google');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const params = url.searchParams;
      const accessToken = params.get('access_token') || url.hash.match(/access_token=([^&]+)/)?.[1];
      const refreshToken = params.get('refresh_token') || url.hash.match(/refresh_token=([^&]+)/)?.[1];

      if (accessToken && refreshToken) {
        return await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }
    return null;
  } catch (error: any) {
    console.error('Error en autenticación con Google:', error.message);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name: string, role: 'candidato' | 'empresa') {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}
