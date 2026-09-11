const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Helper to perform API requests with JSON headers and token
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ── Empleo ────────────────────────────────────────────────────────────────────
export async function getJobListings(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest<{ status: string; count: number; listings: any[] }>(`/job-listings?${query}`);
}

// ── Empleo Público ────────────────────────────────────────────────────────────
export async function getPublicJobs(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest<{ status: string; count: number; convocatorias: any[] }>(`/public-jobs?${query}`);
}

// ── Cursos ───────────────────────────────────────────────────────────────────
export async function getCourses(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest<{ status: string; count: number; cursos: any[] }>(`/courses?${query}`);
}

// ── Empresas & Reseñas con Insignias ──────────────────────────────────────────
export async function getCompanies(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest<{ status: string; count: number; empresas: any[] }>(`/companies?${query}`);
}

export async function submitCompanyReview(companyId: string, review: {
  autor: string;
  cargo: string;
  texto: string;
  rating: number;
  insignias_votadas: string[];
}) {
  return apiRequest<{ status: string; message: string; reseña: any; empresa: any }>(`/companies/${companyId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
  });
}

// ── Perfil de Usuario ────────────────────────────────────────────────────────
export async function getUserProfile() {
  const token = localStorage.getItem('auth_token');
  const endpoint = token ? '/profile' : '/profile/demo';
  return apiRequest<{ status: string; perfil: any }>(endpoint);
}

export async function updateUserProfileSettings(settings: {
  tema?: string;
  notificaciones?: boolean;
  visibilidad_reclutadores?: boolean;
}) {
  return apiRequest<{ status: string; configuracion: any }>('/profile/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}
