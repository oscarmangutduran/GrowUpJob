import { useState, useEffect, type ReactNode } from 'react';
import {
  Edit, Upload, Eye, MapPin, FileText, ChevronRight,
  Briefcase, GraduationCap, Globe, Github, Linkedin, Award, Plus,
  Video, CheckCircle2, Zap, Settings, Download, LogOut, Check, Loader2, Star
} from 'lucide-react';
import { getUserProfile, updateUserProfileSettings } from '../services/api';

interface PerfilProps {
  onLogout?: () => void;
}

interface PerfilData {
  id?: number | string;
  name: string;
  last_name?: string;
  headline: string;
  email?: string;
  phone?: string;
  location: string;
  disponible_remoto?: boolean;
  preseleccionada_activa?: boolean;
  visibilidad_directa?: string;
  anos_experiencia?: string;
  match_global?: number;
  ofertas_hoy?: number;
  cv?: { title: string; size: string; path?: string | null };
  configuracion?: { tema?: string; notificaciones?: boolean; visibilidad_reclutadores?: boolean };
  candidaturas?: Record<string, any[]>;
  experiencias?: Array<{
    id?: number | string;
    title: string;
    company: string;
    period?: string | null;
    desc: string;
    tags: string[];
    current?: boolean;
  }>;
  educacion?: Array<{
    id?: number | string;
    title: string;
    institution: string;
    badge?: string | null;
    badge_color?: string | null;
    icon_type?: string | null;
  }>;
  idiomas?: Array<{
    id?: number | string;
    flag: string;
    language: string;
    level: string;
    color?: string;
  }>;
  enlaces?: Array<{
    id?: number | string;
    type: string;
    url: string;
    label: string;
    color?: string;
  }>;
}

const DEFAULT_PERFIL: PerfilData = {
  name: 'Elena',
  last_name: 'Morales García',
  headline: 'Full Stack Engineer & Cloud Architect',
  location: 'Madrid, España · Remoto global',
  anos_experiencia: '8+',
  match_global: 94,
  ofertas_hoy: 14,
  cv: {
    title: 'CV_Elena_Morales_2026.pdf',
    size: '1.2 MB · Actualizado hace 3 días',
  },
  configuracion: {
    notificaciones: true,
    visibilidad_reclutadores: true,
  },
  candidaturas: {
    'En revisión': [
      {
        id: '1',
        title: 'Lead Full Stack Engineer',
        company: 'Frontend Inc. · Híbrido',
        badge: 'Entrevista',
        badge_color: 'bg-blue-50 text-blue-700 border-blue-200/60',
        detail: 'Jueves 16:00 – 17:15 CET (Google Meet con CTO)',
        cta: 'Ver sala de entrevista',
        cta_color: 'text-blue-700 bg-blue-50 border border-blue-200/80 hover:bg-blue-100',
      },
      {
        id: '2',
        title: 'Senior React Developer',
        company: 'DevPulsar Tech · Remoto internacional',
        badge: 'Finalista',
        badge_color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        detail: 'Resultado de prueba técnica: 89/100 (Top 3)',
        cta: 'Ver feedback técnico',
        cta_color: 'text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100',
      },
    ],
    'Enviadas': [
      {
        id: '3',
        title: 'Platform Architect',
        company: 'NX Cloud Systems · Madrid',
        badge: 'Recibida',
        badge_color: 'bg-slate-100 text-slate-700 border-slate-200',
        detail: 'Revisión curricular superada. Esperando asignación de fecha.',
        cta: 'Consultar estado',
        cta_color: 'text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200',
      },
    ],
    'Entrevistas': [
      {
        id: '4',
        title: 'Lead Full Stack Engineer',
        company: 'Frontend Inc.',
        badge: 'Próxima',
        badge_color: 'bg-blue-50 text-blue-700 border-blue-200/60',
        detail: 'Jueves 16:00 CET',
        cta: 'Unirse al Meet',
        cta_color: 'text-white bg-blue-600 hover:bg-blue-700',
      },
    ],
  },
  experiencias: [
    {
      id: '1',
      title: 'Staff Cloud & Infrastructure Engineer',
      company: 'DICE Systems & Telecom',
      period: '2022 – Actualidad · 3 años',
      desc: 'Liderazgo técnico del equipo de arquitectura en la nube. Migración a microservicios distribuidos en AWS con reducción del 42% en latencia y 99.99% de SLA.',
      tags: ['AWS', 'Kubernetes', 'Terraform', 'Golang'],
      current: true,
    },
    {
      id: '2',
      title: 'Senior Full Stack Developer',
      company: 'Fintech Solutions Madrid',
      period: '2019 – 2022 · 3 años',
      desc: 'Desarrollo de pasarela de pagos compatible con la directiva PSD2 bancaria europea. Arquitectura de frontend escalable en React, TypeScript y Node.js.',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      current: false,
    },
  ],
  educacion: [
    {
      id: '1',
      title: 'AWS Certified Solutions Architect – Professional',
      institution: 'Amazon Web Services · Certificación Oficial Vigente 2024–2027',
      badge: 'Verificado',
      badge_color: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      id: '2',
      title: 'Grado en Ingeniería del Software',
      institution: 'Universidad Politécnica de Madrid (UPM) · 2014 – 2018',
    },
  ],
  idiomas: [
    { id: '1', flag: '🇪🇸', language: 'Español', level: 'Nativo / Competencia profesional bilingüe' },
    { id: '2', flag: '🇬🇧', language: 'Inglés', level: 'Nivel C1 Acreditado (Cambridge Advanced)' },
  ],
  enlaces: [
    { id: '1', type: 'github', url: 'https://github.com/elenamorales-dev', label: 'github.com/elenamorales-dev' },
    { id: '2', type: 'linkedin', url: 'https://linkedin.com/in/elena-morales', label: 'linkedin.com/in/elena-morales' },
    { id: '3', type: 'web', url: 'https://elenamorales.dev', label: 'elenamorales.engineering' },
  ],
};

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3.5 pb-2 border-b border-slate-100">
      <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
      {action ?? (
        <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── Candidatura tabs ───────────────────────────────────────────────────────
function MiCandidatura({ candidaturas }: { candidaturas?: Record<string, any[]> }) {
  const tabs = Object.keys(candidaturas || {});
  const [tab, setTab] = useState<string>(tabs[0] || 'En revisión');
  const items = candidaturas ? (candidaturas[tab] || []) : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Mis Candidaturas Activas</h2>
            <p className="text-xs text-slate-500">Seguimiento en tiempo real conectado a base de datos</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-md">
            {items.length} activas
          </span>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all cursor-pointer ${
                  tab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t} ({(candidaturas?.[t] || []).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {items.map((item: any) => (
            <div key={item.id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badge_color || item.badgeColor || 'bg-blue-50 text-blue-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{item.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 my-2.5">
                <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{item.detail}</span>
              </div>
              <button className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${item.cta_color || item.ctaColor || 'bg-slate-900 text-white'}`}>
                {item.cta || 'Ver detalles'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-400">
          No hay candidaturas en esta fase actualmente.
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Perfil({ onLogout }: PerfilProps) {
  const [perfil, setPerfil] = useState<PerfilData>(DEFAULT_PERFIL);
  const [isLoading, setIsLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState(true);
  const [visibilidad, setVisibilidad] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getUserProfile()
      .then(res => {
        if (isMounted && res.perfil) {
          setPerfil(res.perfil);
          if (res.perfil.configuracion) {
            setNotificaciones(res.perfil.configuracion.notificaciones ?? true);
            setVisibilidad(res.perfil.configuracion.visibilidad_reclutadores ?? true);
          }
        }
      })
      .catch(err => {
        console.warn('Backend API /profile fallback:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleToggleNotificaciones = async () => {
    const nextVal = !notificaciones;
    setNotificaciones(nextVal);
    try {
      await updateUserProfileSettings({ notificaciones: nextVal, visibilidad_reclutadores: visibilidad });
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  const handleToggleVisibilidad = async () => {
    const nextVal = !visibilidad;
    setVisibilidad(nextVal);
    try {
      await updateUserProfileSettings({ notificaciones, visibilidad_reclutadores: nextVal });
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  const fullName = `${perfil.name} ${perfil.last_name || ''}`.trim();
  const initials = perfil.name.charAt(0) + (perfil.last_name ? perfil.last_name.charAt(0) : '');

  const getLinkIcon = (type: string) => {
    if (type === 'github') return <Github className="w-4 h-4" />;
    if (type === 'linkedin') return <Linkedin className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Summary, CV & Social Links */}
        <div className="lg:col-span-4 space-y-5">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold shrink-0 ring-4 ring-slate-100">
                {initials || 'EM'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-slate-900 leading-snug">{fullName}</h1>
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{perfil.headline}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{perfil.location}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                En búsqueda activa
              </span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-600" />
                Visibilidad: {perfil.visibilidad_directa || 'Alta (+34%)'}
              </span>
            </div>

            {/* Stats Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                <div className="text-sm font-bold text-slate-900">{perfil.anos_experiencia || '8+'} años</div>
                <div className="text-[10px] text-slate-500 font-medium">Experiencia</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                <div className="text-sm font-bold text-slate-900">{perfil.match_global || 94}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Match medio</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                <div className="text-sm font-bold text-slate-900">{perfil.ofertas_hoy || 14}</div>
                <div className="text-[10px] text-slate-500 font-medium">Consultas hoy</div>
              </div>
            </div>
          </div>

          {/* Curriculum Vitae Widget */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Curriculum Vitae" action={
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/60">
                Indexado ATS
              </span>
            } />
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/70 rounded-lg p-3 mb-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-200/60 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{perfil.cv?.title || 'CV_Elena_Morales.pdf'}</p>
                <p className="text-[10px] text-slate-400">{perfil.cv?.size || '1.1 MB · PDF Oficial'}</p>
              </div>
              <button title="Descargar" className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualizar</span>
              </button>
            </div>
          </div>

          {/* Links & Portfolio */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Redes & Portfolio" />
            <div className="space-y-1.5">
              {(perfil.enlaces || []).map(l => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-xs font-medium border border-transparent hover:border-slate-200"
                >
                  <span className="text-slate-500">{getLinkIcon(l.type)}</span>
                  <span className="flex-1 truncate">{l.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Idiomas Acreditados" />
            <div className="space-y-2">
              {(perfil.idiomas || []).map(l => (
                <div key={l.language} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-base">
                    {l.flag}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{l.language}</p>
                    <p className="text-[11px] text-slate-500">{l.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión en este dispositivo</span>
          </button>
        </div>

        {/* Right Column: Applications, Experience, Education & Settings */}
        <div className="lg:col-span-8 space-y-5">
          {/* Applications Pipeline from BDD */}
          <MiCandidatura candidaturas={perfil.candidaturas} />

          {/* Work Experience */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Experiencia Laboral" />
            <div className="space-y-5">
              {(perfil.experiencias || []).map((exp, i) => (
                <div key={exp.id || i} className={i > 0 ? 'pt-5 border-t border-slate-100' : ''}>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                      <p className="text-xs font-semibold text-slate-600">{exp.company}</p>
                      {exp.period && <p className="text-[11px] text-slate-400 mt-0.5">{exp.period}</p>}
                    </div>
                    {exp.current && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-md shrink-0">
                        Puesto Actual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.desc}</p>
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.tags.map(tag => (
                        <span key={tag} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Educación & Certificaciones Oficiales" />
            <div className="space-y-4">
              {(perfil.educacion || []).map((edu, i) => (
                <div key={edu.id || i} className="flex items-start gap-3.5 p-3 rounded-lg bg-slate-50/70 border border-slate-200/60">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{edu.title}</p>
                      {edu.badge && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded">
                          {edu.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account & Notification Preferences */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Preferencias de Privacidad & Alertas" action={<Settings className="w-4 h-4 text-slate-400" />} />
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-xs font-bold text-slate-800">Alertas de nuevas ofertas y convocatorias</p>
                  <p className="text-[11px] text-slate-500">Recibe notificaciones inmediatas por correo cuando surjan vacantes compatibles</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleNotificaciones}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${notificaciones ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notificaciones ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-xs font-bold text-slate-800">Visibilidad ante empresas y reclutadores</p>
                  <p className="text-[11px] text-slate-500">Permite que empresas verificadas encuentren tu perfil para ofertas directas</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleVisibilidad}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${visibilidad ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${visibilidad ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
