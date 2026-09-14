import { useState, useMemo, useEffect } from 'react';
import { Search, Star, Clock, CheckCircle2, ChevronRight, Bookmark, ArrowUpRight, BookOpen, Shield, Globe, Brain, Sparkles, Award, Loader2 } from 'lucide-react';
import { getCourses } from '../services/api';

// ── Types ──────────────────────────────────────────────────────────────────
type CursoBadgeType = 'gratis' | 'ocupados' | 'camara' | 'internacional';

interface Curso {
  id: string;
  badge: CursoBadgeType;
  badgeLabel: string;
  title: string;
  horas: string;
  nivel: string;
  modalidad: string;
  extras?: string[];
  rating?: number;
  ratingCount?: number;
  precio: string;
  precioLabel?: string;
  inicio?: string;
  aprobados?: string;
  ctaLabel: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
  tags?: string[];
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const CURSOS: Curso[] = [
  {
    id: '1',
    badge: 'gratis',
    badgeLabel: '100% Subvencionado por Fondos UE',
    title: 'Certificación Cloud Architect & Kubernetes Essentials',
    horas: '60h lectivas',
    nivel: 'Intermedio',
    modalidad: 'Online flexible',
    extras: ['Insignia Digital Verificada'],
    rating: 4.9,
    ratingCount: 420,
    precio: '100% Gratuito',
    ctaLabel: 'Inscribirme gratis',
    ctaVariant: 'primary',
  },
  {
    id: '2',
    badge: 'ocupados',
    badgeLabel: 'Programa Sectorial para Profesionales IT',
    title: 'Inglés Profesional C1 para Negocios y Entrevistas Globales',
    horas: '45h lectivas',
    nivel: 'Nivel B2-C1',
    modalidad: 'Clases en directo',
    extras: ['Simulacros reales de entrevista'],
    precio: 'Gratuito',
    inicio: 'Próximo lunes',
    ctaLabel: 'Ver temario',
    ctaVariant: 'secondary',
  },
  {
    id: '3',
    badge: 'camara',
    badgeLabel: 'Diploma Oficial Cámara de Comercio',
    title: 'Inteligencia Artificial Generativa & LLMs aplicados a Empresa',
    horas: '80h lectivas',
    nivel: 'Avanzado',
    modalidad: 'Online flexible',
    tags: ['Prompt Engineering', 'Automatización'],
    rating: 4.8,
    ratingCount: 310,
    precio: 'Consultar beca',
    ctaLabel: 'Solicitar información',
    ctaVariant: 'outline',
  },
  {
    id: '4',
    badge: 'internacional',
    badgeLabel: 'Acreditación Oficial Internacional Scrum.org',
    title: 'Professional Scrum Master (PSM I) & Liderazgo Ágil',
    horas: '30h intensivas',
    nivel: 'Todos los niveles',
    modalidad: 'Online + Examen',
    extras: ['Tasa de examen oficial incluida'],
    aprobados: '98%',
    precio: '299€ (Beca -50% disponible)',
    ctaLabel: 'Ver certificación',
    ctaVariant: 'outline',
  },
];

const MODALIDAD_PILLS = ['Todos', '100% Subvencionados', 'Gratuitos', 'Certificaciones Oficiales', 'En Directo'];

const AREAS = [
  { icon: Brain, label: 'Tecnología & IA', count: '18 programas' },
  { icon: Shield, label: 'Ciberseguridad', count: '9 programas' },
  { icon: Globe, label: 'Idiomas Profesionales', count: '12 programas' },
  { icon: BookOpen, label: 'Gestión & Agile', count: '15 programas' },
];

function badgeStyle(b: CursoBadgeType) {
  const map: Record<CursoBadgeType, string> = {
    gratis: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    ocupados: 'bg-blue-50 text-blue-800 border-blue-200/80',
    camara: 'bg-amber-50 text-amber-800 border-amber-200/80',
    internacional: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
  };
  return map[b];
}

interface CursoCardProps {
  key?: any;
  c: Curso;
}

function CursoCard({ c }: CursoCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden">
      <div>
        <div className={`px-4 py-2 border-b text-xs font-semibold flex items-center gap-1.5 ${badgeStyle(c.badge)}`}>
          <Award className="w-3.5 h-3.5" />
          <span>{c.badgeLabel}</span>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-blue-600 transition-colors cursor-pointer">
              {c.title}
            </h3>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                saved
                  ? 'border-blue-300 text-blue-600 bg-blue-50'
                  : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {c.horas}
            </span>
            <span>·</span>
            <span>{c.nivel}</span>
            <span>·</span>
            <span>{c.modalidad}</span>
          </div>

          {c.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.tags.map(t => (
                <span key={t} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200/60">
                  {t}
                </span>
              ))}
            </div>
          )}

          {c.extras && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.extras.map(e => (
                <span key={e} className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  {e}
                </span>
              ))}
            </div>
          )}

          {c.rating && (
            <div className="flex items-center gap-2 mb-2 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-200/60">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{c.rating}</span>
              </div>
              <span className="text-slate-400">({c.ratingCount} alumnos titulados)</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Matrícula</p>
          <p className="text-sm font-bold text-slate-900">{c.precio}</p>
        </div>
        <button
          onClick={() => alert(`Solicitando información para ${c.title}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <span>{c.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Cursos() {
  const [modalidadFilter, setModalidadFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cursos, setCursos] = useState<Curso[]>(CURSOS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCourses()
      .then(res => {
        if (isMounted && res.cursos && res.cursos.length > 0) {
          setCursos(res.cursos);
        }
      })
      .catch(err => {
        console.warn('Backend API /courses fallback:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return cursos.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || (c.tags ?? []).some(t => t.toLowerCase().includes(q));
      const matchModalidad =
        modalidadFilter === 'Todos' ||
        (modalidadFilter === '100% Subvencionados' && c.badge === 'gratis') ||
        (modalidadFilter === 'Gratuitos' && (c.badge === 'gratis' || c.badge === 'ocupados')) ||
        (modalidadFilter === 'Certificaciones Oficiales' && (c.badge === 'internacional' || c.badge === 'camara')) ||
        (modalidadFilter === 'En Directo' && c.modalidad.toLowerCase().includes('directo'));
      return matchSearch && matchModalidad;
    });
  }, [cursos, searchQuery, modalidadFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
              Formación Subvencionada & Certificaciones
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Catálogo de Cursos Oficiales y Especialización
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cursos 100% gratuitos para personas empleadas y desempleadas financiados por fondos europeos y estatales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-slate-900">+50</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Programas Activos</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-emerald-600">100%</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Subvencionado</div>
          </div>
        </div>
      </div>

      {/* Áreas Temáticas Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {AREAS.map(area => {
          const Icon = area.icon;
          return (
            <div
              key={area.label}
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 truncate">{area.label}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{area.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 mb-6 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Buscar cursos por tecnología, temática o titulación..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
          />
        </div>

        {/* Modalidad Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Modalidad:</span>
          {MODALIDAD_PILLS.map(p => (
            <button
              key={p}
              onClick={() => setModalidadFilter(p)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                modalidadFilter === p
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {filtered.length > 0 ? (
          filtered.map(c => <CursoCard key={c.id} c={c} />)
        ) : (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Sin programas formativos</h3>
            <p className="text-xs text-slate-500">Prueba con otro filtro de modalidad o limpia la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

