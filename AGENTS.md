# 🚀 GrowUpJob — Guía de Arquitectura e Instrucciones para Agentes

Este documento contiene la **especificación técnica completa, el modelo de datos, la configuración de infraestructura y las instrucciones paso a paso** para reconstruir y evolucionar la plataforma **GrowUpJob**, migrando el backend a **Supabase (PostgreSQL + Auth + Storage + RLS)** y el frontend a **React Native (Expo + TypeScript + NativeWind)**, manteniendo fidelidad con los diseños generados en [`/design`](./design).

---

## 📌 Tabla de Contenidos
1. [Visión del Producto y Módulos](#1-visión-del-producto-y-módulos)
2. [Arquitectura Tecnológica](#2-arquitectura-tecnológica)
3. [Base de Datos y Supabase (SQL DDL, RLS y Seeds)](#3-base-de-datos-y-supabase-sql-ddl-rls-y-seeds)
4. [Flujo de Autenticación (Email, Google y LinkedIn OAuth)](#4-flujo-de-autenticación-email-google-y-linkedin-oauth)
5. [Estructura del Proyecto React Native](#5-estructura-del-proyecto-react-native)
6. [Guía Paso a Paso para Generar el Proyecto](#6-guía-paso-a-paso-para-generar-el-proyecto)
7. [Especificación de Pantallas y Componentes](#7-especificación-de-pantallas-y-componentes)
8. [Configuración de Almacenamiento (Supabase Storage para CVs)](#8-configuración-de-almacenamiento-supabase-storage-para-cvs)
9. [Variables de Entorno y Despliegue](#9-variables-de-entorno-y-despliegue)

---

## 1. Visión del Producto y Módulos

**GrowUpJob** es una plataforma integral de empleo y desarrollo profesional que combina:
- **Ofertas de Empleo Tecnológico y Corporativo:** Salarios transparentes, filtros de modalidad (100% Remoto, Híbrido, Presencial) y candidaturas verificadas.
- **Empleo Público & Oposiciones:** Convocatorias oficiales de la Administración Pública (BOE/BOP), plazas, plazos de solicitud y requisitos.
- **Cursos & Especialización:** Formación profesional certificada, bootcamps y becas.
- **Directorio de Empresas con Acreditación Antighosting:** Métricas reales de trato a candidatos (tiempo de respuesta <24h, 0% ghosting, feedback técnico tras entrevista) y valoraciones de procesos de selección.
- **Insignias y Verificaciones Técnicas para Candidatos:** Sistema gamificado de evaluación de habilidades (React, TypeScript, Cloud Architecture, Inglés C1) que otorga multiplicadores de visibilidad (Top 5% de candidatos).
- **Perfil y CV Inteligente:** Indexado de CV para ATS (Applicant Tracking System), seguimiento en tiempo real de postulaciones (En revisión, Enviadas, Entrevistas) y portfolio.

---

## 2. Arquitectura Tecnológica

```
                      ┌──────────────────────────────────────┐
                      │      React Native (Expo SDK 52)      │
                      │  TypeScript + NativeWind / Tailwind  │
                      │    React Navigation / Expo Router    │
                      └──────────────────┬───────────────────┘
                                         │
                   Supabase Client SDK (@supabase/supabase-js)
                   + SecureStore Auth Session Persistence
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                ▼                                ▼
┌───────────────┐              ┌──────────────────┐             ┌──────────────────┐
│ Supabase Auth │              │ Supabase DB (PG) │             │ Supabase Storage │
│ Email/Password│              │  Row-Level-Sec   │             │   Bucket "cvs"   │
│ Google OAuth  │              │  (RLS Policies)  │             │   (PDF Privados) │
│ LinkedIn OIDC │              │  Realtime Sync   │             │ Bucket "avatars" │
└───────────────┘              └──────────────────┘             └──────────────────┘
```

- **Frontend:**
  - **Framework:** React Native con **Expo SDK 52+** (workflow administrado).
  - **Lenguaje:** TypeScript 5+.
  - **Estilos:** **NativeWind v4** (Tailwind CSS adaptado a React Native).
  - **Navegación:** `@react-navigation/native` con Bottom Tabs y Native Stack (o Expo Router v4).
  - **Iconos:** `lucide-react-native` y `react-native-svg`.
  - **Gestión de Sesión:** `expo-secure-store` para persistir JWTs en el Secure Enclave / Keystore del dispositivo.
  - **Navegador OAuth:** `expo-web-browser` y `expo-auth-session` para deep linking de Google y LinkedIn.
  - **Selector de Documentos:** `expo-document-picker` para subir currículums PDF.
- **Backend:**
  - **Servicio:** **Supabase** (BaaS con Postgres 15+).
  - **Autenticación:** Supabase GoTrue (Email, Google OAuth, LinkedIn OpenID Connect).
  - **Seguridad:** Políticas estrictas de Row Level Security (RLS).
  - **Storage:** Buckets dedicados (`cvs` privado con URLs firmadas y `avatars` público).

---

## 3. Base de Datos y Supabase (SQL DDL, RLS y Seeds)

Ejecuta el siguiente script SQL en el **SQL Editor** de tu proyecto Supabase:

```sql
-- =============================================================================
-- GROWUPJOB: SUPABASE DATABASE DDL & RLS POLICIES
-- =============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PROFILES (Extiende auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  headline TEXT DEFAULT 'Profesional en búsqueda de oportunidades',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT 'Madrid, España',
  anos_experiencia TEXT DEFAULT '3+ años',
  disponible_remoto BOOLEAN DEFAULT TRUE,
  preseleccionada_activa BOOLEAN DEFAULT TRUE,
  visibilidad_directa TEXT DEFAULT 'Alta (+34%)',
  match_global INTEGER DEFAULT 94,
  ofertas_hoy INTEGER DEFAULT 14,
  cv_title TEXT DEFAULT NULL,
  cv_path TEXT DEFAULT NULL,
  cv_size TEXT DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL,
  role TEXT DEFAULT 'candidato' CHECK (role IN ('candidato', 'empresa', 'admin')),
  tema TEXT DEFAULT 'light' CHECK (tema IN ('light', 'dark', 'system')),
  notificaciones BOOLEAN DEFAULT TRUE,
  visibilidad_reclutadores BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger para crear perfil automáticamente al registrar usuario en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. TABLA: JOB_LISTINGS (Ofertas de empleo del sector privado)
CREATE TABLE public.job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT NOT NULL,
  salary_min INTEGER DEFAULT 0,
  salary_max INTEGER DEFAULT 0,
  salary_color TEXT DEFAULT 'text-emerald-700 bg-emerald-50 border-emerald-200',
  modality TEXT NOT NULL CHECK (modality IN ('100% Remoto', 'Híbrido', 'Presencial')),
  jornada TEXT NOT NULL CHECK (jornada IN ('Completa', 'Parcial')),
  posted_at TEXT NOT NULL DEFAULT 'Hace poco',
  logo_color TEXT DEFAULT 'bg-blue-600',
  logo_initial TEXT DEFAULT 'G',
  tags TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  badge TEXT DEFAULT NULL,
  fast_apply BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA: PUBLIC_JOBS (Convocatorias de Empleo Público / BOE)
CREATE TABLE public.public_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  organismo TEXT NOT NULL,
  ambito TEXT NOT NULL DEFAULT 'Estatal',
  tipo TEXT NOT NULL DEFAULT 'Oposición Libre',
  plazas INTEGER NOT NULL DEFAULT 1,
  plazo TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Abierta', 'Publicada', 'Baremación', 'Cerrada')),
  publicado TEXT NOT NULL,
  badge TEXT DEFAULT NULL,
  link TEXT DEFAULT 'https://www.boe.es',
  descripcion TEXT DEFAULT '',
  requisitos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABLA: COURSES (Cursos y Formación Profesional)
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  entidad TEXT NOT NULL,
  duracion TEXT NOT NULL,
  modalidad TEXT NOT NULL CHECK (modalidad IN ('Online', 'Presencial', 'Híbrido')),
  precio TEXT NOT NULL,
  es_gratuito BOOLEAN DEFAULT FALSE,
  categoria TEXT NOT NULL,
  destacado BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  horas INTEGER DEFAULT 0,
  nivel TEXT DEFAULT 'Intermedio',
  fecha_inicio TEXT DEFAULT 'Inscripción abierta',
  link TEXT DEFAULT '#',
  rating NUMERIC(3,1) DEFAULT 4.8,
  resenas INTEGER DEFAULT 120,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA: COMPANIES (Directorio de Empresas con Acreditación de Selección)
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  sector TEXT NOT NULL,
  tamano TEXT NOT NULL,
  logo_color TEXT DEFAULT 'bg-blue-600',
  logo_initial TEXT DEFAULT 'E',
  descripcion TEXT NOT NULL,
  verificada BOOLEAN DEFAULT TRUE,
  tiempo_respuesta TEXT DEFAULT '< 24 horas',
  tasa_ghosting TEXT DEFAULT '0%',
  rating_entrevistas NUMERIC(3,1) DEFAULT 4.8,
  insignias_obtenidas TEXT[] DEFAULT '{}',
  beneficios TEXT[] DEFAULT '{}',
  vacantes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABLA: COMPANY_REVIEWS (Reseñas con Insignias acreditadas por Candidatos)
CREATE TABLE public.company_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  autor TEXT NOT NULL,
  cargo TEXT NOT NULL,
  texto TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  insignias_votadas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABLA: JOB_APPLICATIONS (Candidaturas del usuario)
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_listing_id UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  estado TEXT NOT NULL DEFAULT 'En revisión' CHECK (estado IN ('En revisión', 'Enviadas', 'Entrevistas', 'Descartadas')),
  notas TEXT DEFAULT '',
  fecha_postulacion TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. TABLAS DE DETALLES DEL PERFIL
CREATE TABLE public.user_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT DEFAULT NULL,
  "desc" TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  current BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE public.user_educations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  year TEXT DEFAULT '',
  "desc" TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0
);

CREATE TABLE public.user_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL
);

CREATE TABLE public.user_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL
);

-- 10. TABLA: CANDIDATE_BADGES (Insignias técnicas de candidatos)
CREATE TABLE public.candidate_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rank TEXT CHECK (rank IN ('Bronce', 'Plata', 'Oro', 'Platino', NULL)),
  status TEXT NOT NULL DEFAULT 'en_progreso' CHECK (status IN ('obtenida', 'en_progreso', 'bloqueada')),
  progress INTEGER DEFAULT 0,
  date_obtained TIMESTAMPTZ DEFAULT NULL
);

-- =============================================================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_badges ENABLE ROW LEVEL SECURITY;

-- Lectura pública para catálogos
CREATE POLICY "Lectura pública de ofertas" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Lectura pública de empleo público" ON public.public_jobs FOR SELECT USING (true);
CREATE POLICY "Lectura pública de cursos" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Lectura pública de empresas" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Lectura pública de reviews de empresas" ON public.company_reviews FOR SELECT USING (true);

-- Crear reviews solo autenticados
CREATE POLICY "Usuarios autenticados crean reseñas" ON public.company_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Perfiles: Ver perfiles públicos, pero editar solo el propio
CREATE POLICY "Lectura de perfiles para reclutadores o dueño" ON public.profiles
  FOR SELECT USING (visibilidad_reclutadores = true OR auth.uid() = id);

CREATE POLICY "Modificación de propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Candidaturas y perfil privado: Solo el dueño puede leer/escribir
CREATE POLICY "Dueño gestiona sus candidaturas" ON public.job_applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dueño gestiona sus experiencias" ON public.user_experiences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dueño gestiona su educacion" ON public.user_educations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dueño gestiona sus idiomas" ON public.user_languages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dueño gestiona sus links" ON public.user_links
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dueño gestiona sus insignias" ON public.candidate_badges
  FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- SEED DATA DE PRODUCCIÓN (Datos iniciales para demo y validación)
-- =============================================================================

INSERT INTO public.job_listings (title, company, location, salary, salary_min, salary_max, modality, jornada, posted_at, logo_color, logo_initial, tags, verified, badge, fast_apply)
VALUES
('Senior Full Stack Engineer', 'DevPulse Tech', '100% Remoto', '48K – 60K €', 48000, 60000, '100% Remoto', 'Completa', 'Hace 2 horas', 'bg-blue-600', 'D', ARRAY['React', 'Node.js', 'TypeScript', 'AWS'], TRUE, 'Verificada', TRUE),
('Product Designer UI/UX', 'FinNova Bank', 'Híbrido Madrid', '42K – 52K €', 42000, 52000, 'Híbrido', 'Completa', 'Hace 5 horas', 'bg-emerald-600', 'F', ARRAY['Figma', 'Design Systems', 'Mobile Apps'], FALSE, 'Destacada', FALSE),
('Data Analyst / BI Specialist', 'Logistics Hub', 'Presencial Valencia', '35K – 40K €', 35000, 40000, 'Presencial', 'Completa', 'Ayer', 'bg-indigo-600', 'L', ARRAY['Python', 'SQL', 'PowerBI'], FALSE, NULL, FALSE),
('Growth Marketing Lead', 'SaaS Scale', '100% Remoto', '40K – 50K €', 40000, 50000, '100% Remoto', 'Completa', 'Hace 1 día', 'bg-amber-600', 'S', ARRAY['B2B SaaS', 'Paid Media', 'HubSpot'], FALSE, NULL, FALSE);

INSERT INTO public.public_jobs (titulo, organismo, ambito, tipo, plazas, plazo, estado, publicado, badge, link, descripcion, requisitos)
VALUES
('Técnicos Superiores de Sistemas y Tecnologías (TIC A1)', 'Ministerio para la Transformación Digital', 'Estatal', 'Oposición Libre', 120, 'Hasta el 15 Octubre 2026', 'Abierta', 'BOE 01/09/2026', '120 Plazas', 'https://www.boe.es', 'Convocatoria para el cuerpo superior de sistemas del estado.', ARRAY['Grado o Máster Universitario', 'Nacionalidad española o UE']),
('Gestión de Sistemas e Informática (TIC A2)', 'Secretaría General de Administración Digital', 'Estatal', 'Oposición Libre', 250, 'Hasta el 28 Octubre 2026', 'Abierta', 'BOE 05/09/2026', '250 Plazas', 'https://www.boe.es', 'Puestos de análisis, gestión de bases de datos y desarrollo en AGE.', ARRAY['Grado o Diplomatura']),
('Técnico Especialista de Comunicaciones (C1)', 'Ministerio del Interior', 'Estatal', 'Concurso-Oposición', 80, 'Hasta el 5 Noviembre 2026', 'Publicada', 'BOE 12/09/2026', '80 Plazas', 'https://www.boe.es', 'Operación de redes de emergencia y radioenlaces.', ARRAY['Bachillerato o FP Superior']);

INSERT INTO public.companies (nombre, sector, tamano, logo_color, logo_initial, descripcion, verificada, tiempo_respuesta, tasa_ghosting, rating_entrevistas, insignias_obtenidas, beneficios, vacantes_count)
VALUES
('NexTech Solutions', 'Cloud Engineering & DevOps', '250–500 empleados', 'bg-blue-600', 'N', 'Autonomía de equipos, respuesta garantizada en menos de 24 horas y presupuesto anual individual para certificaciones.', TRUE, '< 24 horas', '0%', 4.8, ARRAY['respuesta_rapida', 'cero_ghosting', 'feedback_garantizado', 'entrevistas_top', 'horario_flexible'], ARRAY['100% Remoto', 'Presupuesto formación', 'Seguro médico'], 4),
('Iberia Green Energy', 'CleanTech & Renovables', '100–250 empleados', 'bg-emerald-600', 'I', 'Cultura orientada a sostenibilidad y conciliación real. 100% remoto con reuniones asíncronas y respeto absoluto al tiempo.', TRUE, '< 48 horas', '0%', 4.6, ARRAY['cero_ghosting', 'transparencia_salarial', 'remoto_real', 'impacto_sostenible'], ARRAY['Jornada 4 días', 'Retribución flexible'], 2);

INSERT INTO public.courses (titulo, entidad, duracion, modalidad, precio, es_gratuito, categoria, destacado, tags, horas, nivel, fecha_inicio, link, rating, resenas)
VALUES
('Especialización en Microservicios y Kubernetes Cloud Native', 'CloudTech Academy', '8 semanas', 'Online', 'Gratuito (Beca 100%)', TRUE, 'Cloud & DevOps', TRUE, ARRAY['Kubernetes', 'Docker', 'Go', 'AWS'], 60, 'Avanzado', '15 Octubre 2026', '#', 4.9, 310),
('Diseño de Sistemas Distribuidos y Alta Concurrencia', 'Software Craftsman Institute', '6 semanas', 'Online', '350€', FALSE, 'Arquitectura de Software', FALSE, ARRAY['Kafka', 'Redis', 'System Design'], 40, 'Intermedio-Avanzado', '1 Noviembre 2026', '#', 4.8, 142);
```

---

## 4. Flujo de Autenticación (Email, Google y LinkedIn OAuth)

El login soporta:
1. **Email y Contraseña** tradicionales (`signUp` / `signInWithPassword`).
2. **Google OAuth** mediante el flujo web seguro de Supabase.
3. **LinkedIn OAuth** a través de **LinkedIn OpenID Connect (`linkedin_oidc`)**.

### 4.1 Configuración de LinkedIn en Supabase
1. Ingresa en el **LinkedIn Developer Portal** (`https://www.linkedin.com/developers/apps`).
2. Crea una app con el nombre **GrowUpJob**.
3. En la pestaña **Products**, solicita acceso a:
   - **Sign In with LinkedIn using OpenID Connect**.
4. En **Auth**, copia:
   - `Client ID`
   - `Client Secret`
5. En **Authorized redirect URLs for your app**, añade la callback URL de tu proyecto Supabase:
   ```
   https://<tu-proyecto-id>.supabase.co/auth/v1/callback
   ```
6. En el Dashboard de **Supabase > Authentication > Providers > LinkedIn (OIDC)**:
   - Habilita el switch **Enable LinkedIn (OIDC)**.
   - Pega tu `Client ID` y `Client Secret`.
   - Guarda los cambios.

### 4.2 Código de Integración en React Native con Expo
Crea el archivo `services/supabase.ts` y configura `expo-auth-session` / `expo-web-browser`:

```typescript
// src/services/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 4.3 Hook de Autenticación Social (LinkedIn y Google)
```typescript
// src/hooks/useSocialAuth.ts
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../services/supabase';

WebBrowser.maybeCompleteAuthSession();

export function useSocialAuth() {
  const signInWithLinkedIn = async () => {
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
      if (!data?.url) throw new Error('No se generó la URL de OAuth');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

      if (result.type === 'success' && result.url) {
        const params = new URL(result.url).searchParams;
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }
    } catch (err: any) {
      console.error('Error en autenticación con LinkedIn:', err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
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
      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      }
    } catch (err: any) {
      console.error('Error en autenticación con Google:', err.message);
      throw err;
    }
  };

  return { signInWithLinkedIn, signInWithGoogle };
}
```

---

## 5. Estructura del Proyecto React Native

Crea la siguiente estructura modular en la aplicación móvil:

```
GrowUpJobMobile/
├── app.json                 # Configuración de Expo (scheme: 'growupjob', icon, splash)
├── package.json
├── tailwind.config.js       # Configuración de NativeWind
├── babel.config.js
├── tsconfig.json
├── src/
│   ├── assets/              # Logos, ilustraciones SVG, fuentes
│   ├── components/
│   │   ├── common/          # Button, Input, Modal, Badge, Header
│   │   ├── BrandLogo.tsx    # Logo gráfico e isotipo de GrowUpJob
│   │   ├── JobCard.tsx      # Tarjeta interactiva de oferta con tags y botón de postulación
│   │   ├── PublicJobCard.tsx# Convocatoria de oposiciones con badges de plazas
│   │   ├── CourseCard.tsx   # Cursos con modalidad, horas y rating
│   │   ├── CompanyCard.tsx  # Empresas con insignias de transparencia y reviews
│   │   ├── BadgeItem.tsx    # Insignias técnicas y barra de progreso
│   │   └── FilterModal.tsx  # Modal deslizable para filtros avanzados en móvil
│   ├── navigation/
│   │   ├── AppNavigator.tsx # Root Navigator (Auth Stack vs Main Tab Navigator)
│   │   ├── TabNavigator.tsx # Bottom Tabs (Empleo, Público, Cursos, Empresas, Perfil)
│   │   └── types.ts         # Tipado de rutas y parámetros
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx        # Email + Google + LinkedIn OAuth
│   │   │   └── RegisterScreen.tsx     # Registro con selección de rol
│   │   ├── main/
│   │   │   ├── EmpleoScreen.tsx       # Feed de ofertas, buscador y filtros rápidos
│   │   │   ├── EmpleoPublicoScreen.tsx# Oposiciones del BOE y plazos
│   │   │   ├── CursosScreen.tsx       # Catálogo formativo y becas
│   │   │   ├── EmpresasScreen.tsx     # Empresas antighosting y valoraciones
│   │   │   ├── PerfilScreen.tsx       # Perfil ATS, CV upload y candidaturas activas
│   │   │   └── InsigniasScreen.tsx    # Misiones y validaciones técnicas
│   ├── services/
│   │   ├── supabase.ts      # Cliente Supabase singleton
│   │   ├── jobs.ts          # Queries de ofertas de empleo
│   │   ├── publicJobs.ts    # Queries de convocatorias
│   │   ├── courses.ts       # Queries de cursos
│   │   ├── companies.ts     # Directorio y reseñas de empresas
│   │   └── profile.ts       # Perfil, subida de CV a Storage y candidaturas
│   ├── types/
│   │   └── database.types.ts# Tipos generados automáticamente de Supabase
│   └── utils/
│       └── formatters.ts    # Formateo de fechas, salarios y divisas
```

---

## 6. Guía Paso a Paso para Generar el Proyecto

### Paso 1: Inicializar el Proyecto Expo
En una terminal en la raíz o directorio deseado:
```bash
npx -y create-expo-app@latest GrowUpJobMobile --template blank-typescript
cd GrowUpJobMobile
```

### Paso 2: Instalar Dependencias del Core
```bash
npx expo install @supabase/supabase-js expo-secure-store expo-web-browser expo-auth-session expo-crypto react-native-url-polyfill
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context
npx expo install lucide-react-native react-native-svg expo-document-picker
```

### Paso 3: Configurar NativeWind v4 (Tailwind CSS)
```bash
npm install nativewind tailwindcss react-native-reanimated
npx tailwindcss init
```

Edita `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

Edita `babel.config.js`:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### Paso 4: Configurar `app.json` (Esquema de Deep Linking)
Añade la propiedad `scheme` para que LinkedIn y Google puedan redirigir de vuelta a la app:
```json
{
  "expo": {
    "name": "GrowUpJob",
    "slug": "growupjob",
    "scheme": "growupjob",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./src/assets/icon.png",
    "userInterfaceStyle": "automatic",
    "plugins": [
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ]
    ]
  }
}
```

---

## 7. Especificación de Pantallas y Componentes

Basado en las capturas de [`/design`](./design):

### 7.1 `LoginScreen.tsx`
- **Cabecera de Marca:** Logotipo de tres barras redondeadas en degradado azul y texto `GrowUp Job PRO`.
- **Botón de LinkedIn:** Estilo corporativo azul (`#0A66C2`), icono oficial de LinkedIn y texto *"Continuar con LinkedIn"*.
- **Botón de Google:** Estilo minimalista con borde gris claro e isotipo de Google a 4 colores.
- **Formulario:** Campos de *Email* y *Contraseña* con alternador de visualización de contraseña (icono de ojo).
- **Acceso Directo:** Enlace a registro *"¿Aún no tienes cuenta? Crear cuenta gratuita"*.

### 7.2 `RegisterScreen.tsx`
- **Selector de Rol:** Botones tipo pill para alternar entre *Candidato* y *Empresa/Reclutador*.
- **Registro Rápido con LinkedIn:** Permite sincronizar experiencia y titulación en 1 clic.
- **Validación de contraseña:** Requisitos mínimos de seguridad y confirmación de política de privacidad.

### 7.3 `EmpleoScreen.tsx`
- **Hero de Afinidad:** Banner oscuro destacado con indicador de afinidad (*98% Afinidad*) y acceso directo a *Insignias*.
- **Barra de Búsqueda:** Input con icono de lupa y botón para abrir el modal de filtros.
- **Chips de Filtro Rápido:** `Todo`, `100% Remoto`, `Híbrido`, `Presencial`, `Verificadas`.
- **Tarjeta de Empleo (`JobCard`):**
  - Avatar con inicial y color corporativo.
  - Título del puesto y nombre de la empresa con badge azul `Verificada`.
  - Chip verde con rango salarial (ej. `48K – 60K €`), modalidad y jornada.
  - Tags de tecnologías (`React`, `Node.js`, `TypeScript`, `AWS`).
  - Botón de acción principal: `Inscripción Directa ↗` o `Ver Candidatura ↗`.

### 7.4 `EmpleoPublicoScreen.tsx`
- **Header Informativo:** Resumen de convocatorias oficiales activas en España (BOE/BOP).
- **Chips de Ámbito:** `Todos`, `Estatal`, `Autonómico`, `Local`.
- **Tarjeta de Convocatoria:**
  - Badge destacado con número de plazas (ej. `120 Plazas`).
  - Nombre del cuerpo/oposición y organismo convocante.
  - Indicador de estado (`Abierta` en verde esmeralda, `Publicada` en azul).
  - Fecha límite del plazo de instancias y enlace al BOE.

### 7.5 `CursosScreen.tsx`
- **Filtro por Modalidad:** `Todos`, `Online`, `Híbrido`, `Presencial`, `Gratuitos (Becas)`.
- **Tarjeta Formativa:** Entidad emisora, duración en semanas/horas, nivel y botón de inscripción.

### 7.6 `EmpresasScreen.tsx`
- **Métricas de Transparencia de Selección:**
  - Contador de *Empresas Top* y *0% Ghosting Auditado*.
  - Tiempo de respuesta medio (`< 24h` / `< 48h`).
- **Directorio de Empresas:**
  - Badges obtenidos: `Respuesta Rápida (<24h)`, `0% Ghosting Garantizado`, `Feedback Constructivo`, `Entrevistas Top`.
  - Botón `Ver insignias & opiniones` que despliega el modal para que los candidatos voten y dejen feedback de sus entrevistas.

### 7.7 `PerfilScreen.tsx`
- **Cabecera del Candidato:** Avatar, nombre (`Elena Morales García`), rol profesional (`Full Stack Engineer & Cloud Architect`) y badges de estado (`En búsqueda activa`, `Visibilidad: Alta (+34%)`).
- **Gestor de CV:** Indicador de indexado ATS, nombre del archivo PDF, fecha de subida y botones para `Actualizar` (mediante `expo-document-picker`) y `Previsualizar`.
- **Pipeline de Candidaturas:** Tabs horizontales: `En revisión`, `Enviadas`, `Entrevistas`, con tarjetas detalladas de estado.
- **Secciones de Trayectoria:** Experiencia laboral, Formación académica, Idiomas y Enlaces de portfolio (GitHub, LinkedIn).

### 7.8 `InsigniasScreen.tsx`
- **Panel de Nivel:** `Nivel 4: Candidato Destacado` con barra de progreso de XP (ej. 850 / 1.000 XP) y multiplicador de visibilidad (`3.2x Mayor Visibilidad`).
- **Misiones para Aumentar Visibilidad:** Pruebas técnicas prácticas (`React & TypeScript`, `Competencia Oral de Inglés C1`).
- **Catálogo de Certificaciones Validadas:** Insignias de Oro, Platino y Plata con sello verificable.

---

## 8. Configuración de Almacenamiento (Supabase Storage para CVs)

### 8.1 Crear el Bucket en Supabase
En el panel de Supabase (**Storage > New Bucket**):
- Nombre del Bucket: `cvs`
- Tipo: **Private** (no público, solo accesible por el usuario propietario o reclutadores autorizados).

### 8.2 Políticas de Storage (SQL)
```sql
-- Permitir a usuarios autenticados subir su propio CV
CREATE POLICY "Usuarios suben su propio CV" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cvs' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Permitir a usuarios leer y descargar su propio CV
CREATE POLICY "Usuarios descargan su propio CV" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cvs' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Permitir a usuarios actualizar o reemplazar su CV
CREATE POLICY "Usuarios actualizan su CV" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cvs' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );
```

### 8.3 Implementación de Subida en React Native
```typescript
// src/services/cvStorage.ts
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from './supabase';

export async function uploadUserCV(userId: string) {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const fileExt = asset.name.split('.').pop();
  const filePath = `${userId}/cv_${Date.now()}.${fileExt}`;

  const response = await fetch(asset.uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(filePath, blob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw error;

  // Actualizar perfil con los metadatos del CV
  const fileSizeMb = (asset.size ? (asset.size / (1024 * 1024)).toFixed(1) : '1.0') + ' MB';
  await supabase
    .from('profiles')
    .update({
      cv_title: asset.name,
      cv_path: filePath,
      cv_size: fileSizeMb,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return { filePath, name: asset.name, size: fileSizeMb };
}
```

---

## 9. Variables de Entorno y Despliegue

### 9.1 Archivo `.env` en la aplicación móvil
Crea un archivo `.env` en la raíz de `GrowUpJobMobile`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica-aqui
```

### 9.2 Generación de Builds Nativas con EAS (Expo Application Services)
Para compilar los binarios `.apk` / `.aab` (Android) e `.ipa` (iOS):
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

---

## ✅ Resumen de Decisiones de Arquitectura
1. **Supabase sustituye completamente a Laravel:** Se eliminó la dependencia de un servidor PHP/XAMPP local. Toda la persistencia, autenticación social y almacenamiento de archivos se gestiona en la nube con PostgreSQL y Supabase Auth.
2. **React Native como frontend universal:** La interfaz se ejecuta de forma nativa en iOS y Android, con soporte opcional para Web mediante Expo Web.
3. **LinkedIn OAuth de primera clase:** Configurado vía OpenID Connect para maximizar la tasa de conversión en el registro de perfiles profesionales.
4. **Fidelidad de Diseño:** Todas las vistas deben coincidir con la iconografía, paleta de colores y componentes visualizados en [`design/index.html`](./design/index.html).
