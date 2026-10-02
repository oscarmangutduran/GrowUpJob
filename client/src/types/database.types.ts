export interface Profile {
  id: string;
  email: string;
  name: string;
  last_name?: string;
  headline?: string;
  phone?: string;
  location?: string;
  anos_experiencia?: string;
  disponible_remoto?: boolean;
  preseleccionada_activa?: boolean;
  visibilidad_directa?: string;
  match_global?: number;
  ofertas_hoy?: number;
  cv_title?: string | null;
  cv_path?: string | null;
  cv_size?: string | null;
  avatar_url?: string | null;
  role: 'candidato' | 'empresa' | 'admin';
  tema?: 'light' | 'dark' | 'system';
  notificaciones?: boolean;
  visibilidad_reclutadores?: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salary_min?: number;
  salary_max?: number;
  salary_color?: string;
  modality: '100% Remoto' | 'Híbrido' | 'Presencial';
  jornada: 'Completa' | 'Parcial';
  posted_at: string;
  logo_color: string;
  logo_initial: string;
  tags: string[];
  verified?: boolean;
  badge?: string | null;
  fast_apply?: boolean;
}

export interface PublicJob {
  id: string;
  titulo: string;
  organismo: string;
  ambito: string;
  tipo: string;
  plazas: number;
  plazo: string;
  estado: 'Abierta' | 'Publicada' | 'Baremación' | 'Cerrada';
  publicado: string;
  badge?: string | null;
  link: string;
  descripcion?: string;
  requisitos?: string[];
}

export interface Course {
  id: string;
  titulo: string;
  entidad: string;
  duracion: string;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  precio: string;
  es_gratuito?: boolean;
  categoria: string;
  destacado?: boolean;
  tags: string[];
  horas: number;
  nivel: string;
  fecha_inicio: string;
  link: string;
  rating?: number;
  resenas?: number;
}

export interface Company {
  id: string;
  nombre: string;
  sector: string;
  tamano: string;
  logo_color: string;
  logo_initial: string;
  descripcion: string;
  verificada?: boolean;
  tiempo_respuesta: string;
  tasa_ghosting: string;
  rating_entrevistas: number;
  insignias_obtenidas: string[];
  beneficios: string[];
  vacantes_count: number;
}

export interface CompanyReview {
  id: string;
  company_id: string;
  user_id?: string;
  autor: string;
  cargo: string;
  texto: string;
  rating: number;
  insignias_votadas: string[];
  created_at?: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_listing_id: string;
  estado: 'En revisión' | 'Enviadas' | 'Entrevistas' | 'Descartadas';
  notas?: string;
  fecha_postulacion: string;
  job_listing?: JobListing;
}

export interface CandidateBadge {
  id: string;
  badge_id: string;
  name: string;
  rank?: 'Bronce' | 'Plata' | 'Oro' | 'Platino' | null;
  status: 'obtenida' | 'en_progreso' | 'bloqueada';
  progress?: number;
  date_obtained?: string | null;
}
