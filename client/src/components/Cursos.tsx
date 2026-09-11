import { useState, useMemo } from 'react';
import { Search, Bell, Star, Clock, Users, CheckCircle, ChevronRight, Bookmark, Zap, Info, BookOpen, Shield, Globe, Brain } from 'lucide-react';

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
    badgeLabel: '✅ Subvencionado Fondos UE [Gratis]',
    title: 'Certificación Cloud Practitioner & DevOps Essentials',
    horas: '60h lectivas',
    nivel: 'Nivel Intermedio',
    modalidad: 'Online flexible',
    extras: ['Insignia Digital Blockchain'],
    rating: 4.9,
    ratingCount: 420,
    precio: '100% Gratuito',
    ctaLabel: 'Inscribirme',
    ctaVariant: 'primary',
  },
  {
    id: '2',
    badge: 'ocupados',
    badgeLabel: '👤 Para ocupados y desempleados',
    title: 'Inglés Profesional C1 para Entrevistas IT y Negocios',
    horas: '45h lectivas',
    nivel: 'B2-C1',
    modalidad: 'Clases en vivo',
    extras: ['Simulacros reales'],
    precio: 'Gratuito',
    inicio: 'Próximo lunes',
    ctaLabel: 'Ver Programa',
    ctaVariant: 'secondary',
  },
  {
    id: '3',
    badge: 'camara',
    badgeLabel: '🏛️ Avalado Cámara de Comercio',
    title: 'Especialista en Inteligencia Artificial Generativa aplicada a Negocio',
    horas: '80h formativas',
    nivel: 'Avanzado',
    modalidad: 'Online flexible',
    tags: ['Prompt Engineering & LLMs'],
    rating: 4.8,
    ratingCount: 310,
    precio: 'Consultar precio',
    ctaLabel: 'Consultar Plazas',
    ctaVariant: 'outline',
  },
  {
    id: '4',
    badge: 'internacional',
    badgeLabel: '🌍 Certificación Oficial Internacional',
    title: 'Scrum Master & Agile Leadership',
    horas: '30h intensivas',
    nivel: 'Todos los niveles',
    modalidad: 'Online + Examen',
    extras: ['Examen de Certificación incluido'],
    aprobados: '98%',
    precio: 'Desde 299€',
    ctaLabel: 'Ver Detalles',
    ctaVariant: 'outline',
  },
];

const MODALIDAD_PILLS = ['Todos', '100% Subvencionados', 'Gratuitos', 'Certificaciones', 'En Vivo'];

const AREAS = [
  { icon: Brain, label: 'Tecnología & IA', color: 'bg-blue-100 text-blue-600' },
  { icon: Shield, label: 'Ciberseguridad', color: 'bg-purple-100 text-purple-600' },
  { icon: Globe, label: 'Idiomas y Negocios', color: 'bg-green-100 text-green-600' },
  { icon: BookOpen, label: 'Gestión & Agile', color: 'bg-orange-100 text-orange-600' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function badgeStyle(b: CursoBadgeType) {
  const map: Record<CursoBadgeType, string> = {
    gratis: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    ocupados: 'bg-blue-50 text-blue-700 border border-blue-200',
    camara: 'bg-amber-50 text-amber-700 border border-amber-200',
    internacional: 'bg-violet-50 text-violet-700 border border-violet-200',
  };
  return map[b];
}

function ctaStyle(v: Curso['ctaVariant']) {
  const map: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
    outline: 'border border-blue-300 text-blue-600 hover:bg-blue-50',
  };
  return map[v];
}

// ── Card Component ─────────────────────────────────────────────────────────
function CursoCard({ c }: { c: Curso }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Badge */}
      <div className={`px-4 py-2 text-xs font-semibold ${badgeStyle(c.badge)}`}>
        {c.badgeLabel}
      </div>

      <div className="px-4 py-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1 pr-2">{c.title}</h3>
          <button className="text-gray-300 hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {c.horas}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            {c.nivel}
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-green-400" />
            {c.modalidad}
          </span>
        </div>

        {/* Tags */}
        {c.tags && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {c.tags.map(t => (
              <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{t}</span>
            ))}
          </div>
        )}

        {/* Extras */}
        {c.extras && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {c.extras.map(e => (
              <span key={e} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />{e}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        {c.rating && (
          <div className="flex items-center gap-1 mb-2 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-gray-800">{c.rating}</span>
            <span className="text-gray-400">({c.ratingCount} alumnos)</span>
          </div>
        )}

        {/* Inicio */}
        {c.inicio && (
          <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            Inicio: <span className="font-semibold text-gray-700">{c.inicio}</span>
          </div>
        )}

        {/* Aprobados */}
        {c.aprobados && (
          <div className="flex items-center gap-1 mb-2 text-xs text-emerald-600 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Tasa de aprobados {c.aprobados}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400">Coste total</p>
            <p className={`text-sm font-extrabold ${c.precio.includes('Gratuito') || c.precio.includes('100%') ? 'text-emerald-600' : 'text-gray-800'}`}>
              {c.precio}
            </p>
          </div>
          <button className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${ctaStyle(c.ctaVariant)}`}>
            {c.ctaLabel}
            {c.ctaVariant === 'primary' && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Cursos() {
  const [modalidadFilter, setModalidadFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return CURSOS.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || (c.tags ?? []).some(t => t.toLowerCase().includes(q));
      const matchModalidad =
        modalidadFilter === 'Todos' ||
        (modalidadFilter === '100% Subvencionados' && c.badge === 'gratis') ||
        (modalidadFilter === 'Gratuitos' && (c.badge === 'gratis' || c.badge === 'ocupados')) ||
        (modalidadFilter === 'Certificaciones' && (c.badge === 'internacional' || c.badge === 'camara')) ||
        (modalidadFilter === 'En Vivo' && c.modalidad.toLowerCase().includes('vivo'));
      return matchSearch && matchModalidad;
    });
  }, [searchQuery, modalidadFilter]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="px-4 pt-10 pb-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-gray-400 font-medium leading-none">GrowUp</p>
              <h1 className="text-sm font-bold text-gray-800 leading-tight">Formación</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 relative hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">OD</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Buscar cursos, certificaciones..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Modalidad pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {MODALIDAD_PILLS.map(p => (
              <button
                key={p}
                onClick={() => setModalidadFilter(p)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${modalidadFilter === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        <main className="px-4 py-4 space-y-4">
          {/* Hero Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-full mb-2 inline-block">
              ✅ Certificaciones Verificadas
            </span>
            <h2 className="text-base font-extrabold leading-snug mb-1">
              Impulsa tu empleabilidad con<br />certificaciones de alta demanda
            </h2>
            <p className="text-xs text-white/80 mb-3 leading-relaxed">
              Programas avalados por la UE y líderes del sector tecnológico para catapultar tu carrera laboral.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {['bg-pink-400', 'bg-yellow-400', 'bg-green-400'].map((c, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-blue-700`} />
                ))}
              </div>
              <span className="text-[10px] text-white/80 font-medium">+1.800 graduados con empleo esta mes</span>
            </div>
          </div>

          {/* Personalized path */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tu itinerario adaptado</span>
                <h3 className="text-sm font-bold text-gray-900">Senior Cloud & Dev Lead</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">85% Listo</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="text-[11px] text-gray-500 mb-3">Paso 3 de 4 en curso · Próxima meta: <span className="font-bold text-blue-600">Certificación DevOps</span></p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { label: 'Git & CI/CD', done: true, color: 'bg-green-100 text-green-700' },
                { label: 'Docker & K8s', done: true, color: 'bg-green-100 text-green-700' },
                { label: 'Cloud Dev', done: false, color: 'bg-blue-100 text-blue-700' },
                { label: 'Liderazgo Ágil', done: false, color: 'bg-gray-100 text-gray-500' },
              ].map(step => (
                <div key={step.label} className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold ${step.color}`}>
                  {step.done && <CheckCircle className="w-3 h-3" />}
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          {/* Áreas temáticas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-800">Áreas Temáticas</h2>
              <button className="text-xs text-blue-600 font-semibold">Ver todas</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {AREAS.map(area => (
                <button key={area.label} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${area.color}`}>
                    <area.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-600 text-center leading-tight">{area.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section header */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800">Cursos y Certificaciones Destacados</h2>
            <span className="text-xs text-gray-400 font-medium">{filtered.length} programas</span>
          </div>

          {/* Course cards */}
          {filtered.length > 0 ? (
            filtered.map(c => <CursoCard key={c.id} c={c} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-700 mb-1">Sin resultados</h3>
              <p className="text-sm text-gray-400">Prueba con otros términos o filtros</p>
            </div>
          )}

          {/* Help card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-800 mb-1">¿Dudas sobre cómo solicitar tu beca?</p>
                <p className="text-[11px] text-blue-700 leading-relaxed mb-2">
                  Nuestros asesores laborales revisan tus requisitos sin compromiso.
                </p>
                <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  Hablar con un asesor <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
