import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, removeAuthToken } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  google_id: string | null;
  role: string;
  last_name: string | null;
  headline: string | null;
  phone: string | null;
  location: string | null;
  birthday: string | null;
  avatar: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: {
    name: string;
    last_name: string | null;
    headline: string | null;
    phone: string | null;
    location: string | null;
    birthday: string | null;
    avatar: string | null;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario inicial si existe un token guardado
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        // Obtenemos los datos del perfil utilizando apiRequest (el cual adjunta automáticamente el token guardado)
        const response = await apiRequest('/user');
        if (response.status === 'success' && response.user) {
          setUser(response.user);
          // Necesitamos leer el token actual guardado
          const { getAuthToken } = require('../services/api');
          const storedToken = await getAuthToken();
          setToken(storedToken);
        }
      } catch (error) {
        // Si el token expiró o es inválido, limpiamos todo
        await removeAuthToken();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 'success' && response.token) {
        await setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          password_confirmation: password,
        }),
      });

      if (response.status === 'success' && response.token) {
        await setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulación en entorno local usando el mock_google_access_token_demo
      const response = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          access_token: 'mock_google_access_token_demo',
        }),
      });

      if (response.status === 'success' && response.token) {
        await setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Error en Google Login');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Intentamos avisar al backend para revocar el token
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {
        // Si falla por problemas de red, continuamos con el borrado local
      });
    } finally {
      await removeAuthToken();
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: {
    name: string;
    last_name: string | null;
    headline: string | null;
    phone: string | null;
    location: string | null;
    birthday: string | null;
    avatar: string | null;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.status === 'success' && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
