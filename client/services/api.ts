import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const getBaseUrl = () => {
  // Por defecto, local para iOS y Web
  let host = '127.0.0.1';

  if (Platform.OS === 'android') {
    // Dirección IP especial para acceder a localhost desde el emulador de Android
    host = '10.0.2.2';
  } else if (Constants.expoConfig?.hostUri) {
    // Si estamos en un dispositivo físico con Expo Go, detecta la IP del equipo host
    const uri = Constants.expoConfig.hostUri.split(':')[0];
    if (uri && !uri.startsWith('127.0.0.1') && !uri.startsWith('localhost')) {
      host = uri;
    }
  }

  return `http://${host}:8000/api`;
};

export const API_BASE_URL = getBaseUrl();

/**
 * Recupera el token guardado en SecureStore.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('auth_token');
  } catch (error) {
    console.error('Error al leer el token:', error);
    return null;
  }
}

/**
 * Guarda el token de forma segura.
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync('auth_token', token);
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
}

/**
 * Borra el token guardado.
 */
export async function removeAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('auth_token');
  } catch (error) {
    console.error('Error al borrar el token:', error);
  }
}

/**
 * Helper para realizar peticiones HTTP de forma simplificada.
 */
export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data: any = {};
  try {
    data = await response.json();
  } catch (e) {
    // Respuesta no es JSON o está vacía
  }

  if (!response.ok) {
    const errorMessage = data.message || `Error del servidor (${response.status})`;
    throw new Error(errorMessage);
  }

  return data;
}
