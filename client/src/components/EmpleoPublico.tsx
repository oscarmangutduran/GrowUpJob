import { useState, useMemo } from 'react';
import { Search, Bell, Filter, ChevronDown, Bookmark, ExternalLink, Bell as BellIcon, Info, AlertTriangle, CheckCircle, Clock, MapPin, Users, GraduationCap, Zap } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type ConvocatoriaStatus = 'urgente' | 'abierto' | 'listas' | 'proximamente';

interface Convocatoria {
  id: string;
  status: ConvocatoriaStatus;
  statusLabel: string;
  statusDays?: string;
  subgrupo: string;
  subgrupoColor: string;
  ambit?: string;
  title: string;
  organismo: string;
  plazas: number;
  requisito: string;
  regimen: string;
  sistema?: string;
  ctaLabel: string;
  ctaVariant: 'primary' | 'warning' | 'success' | 'ghost';
  extraInfo?: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const CONVOCATORIAS: Convocatoria[] = [
  {
    id: '1',
    status: 'urgente',
    statusLabel: '⚡ Gestión — ¡dias cierre 24 hs!',
    subgrupo: 'A2',
    subgrupoColor: 'text-blue-700 bg-blue-50',
    title: 'Técnico/a de Gestión de Sistemas e Informática',
    organismo: 'Administración General del Estado (AGE) · Ministerio para la Transformación Digital',
    plazas: 450,
    requisito: 'Grado / Diplomatura',
    regimen: 'Funcionario de Carrera · Oposición libre pura',
    ctaLabel: 'Ver bases en BOE',
    ctaVariant: 'primary',
  },
  {
    id: '2',
    status: 'abierto',
    statusLabel: 'Plazo abierto (34 días restantes)',
    subgrupo: 'C1',
    subgrupoColor: 'text-amber-700 bg-amber-50',
    title: 'Cuerpo Básico de la Seguridad Social',
    organismo: 'Instituto Nacional de la Seguridad Social (INSS)',
    plazas: 1200,
    requisito: 'Bachillerato o Técnico',
    regimen: 'Oposición libre nacional de libre mérito',
    ctaLabel: 'Consultar BOE Oficial',
    ctaVariant: 'warning',
    extraInfo: 'Acceso: Bachillerato o Técnico',
  },
  {
    id: '3',
    status: 'listas',
    statusLabel: 'Listas provisionales de admisión',
    subgrupo: 'A2',
    subgrupoColor: 'text-green-700 bg-green-50',
    ambit: 'Sanitario',
    title: 'Enfermero/a del Servicio de Salud Autonómico',
    organismo: 'Servicios Sanitarios Regionales · Bolsas de empleo y estabilización',
    plazas: 850,
    requisito: 'Diplomatura / Grado en Enfermería',
    regimen: 'Concurso-Oposición',
    sistema: '850 estatutarios',
    ctaLabel: 'Revisar Listas y Subsanar',
    ctaVariant: 'success',
  },
  {
    id: '4',
    status: 'proximamente',
    statusLabel: 'Próxima apertura (BOPV)',
    subgrupo: 'A2',
    subgrupoColor: 'text-gray-600 bg-gray-100',
    ambit: 'Local',
    title: 'Arquitecto/a o Técnico Municipal',
    organismo: 'Ayuntamiento de Valencia · Urbanismo y Obras',
    plazas: 12,
    requisito: 'Arquitectura / Ingeniería Técnica',
    regimen: 'Turno Libre',
    ctaLabel: 'Avisarme al abrir plazo',
    ctaVariant: 'ghost',
  },
];

const AMBITO_PILLS = ['Todos', 'Estado (AGE)', 'Comunidades', 'Local', 'Sanitario', 'Docente'];

// ── Status helpers ─────────────────────────────────────────────────────────
function statusBadge(s: ConvocatoriaStatus) {
  const map: Record<ConvocatoriaStatus, string> = {
    urgente: 'bg-red-100 text-red-700 border border-red-200',
    abierto: 'bg-amber-100 text-amber-700 border border-amber-200',
    listas: 'bg-green-100 text-green-700 border border-green-200',
    proximamente: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return map[s];
}

function ctaClass(v: Convocatoria['ctaVariant']) {
  const map: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    ghost: 'border border-blue-300 text-blue-600 hover:bg-blue-50',
  };
  return map[v];
}

// ── Card Component ─────────────────────────────────────────────────────────
function ConvocatoriaCard({ c }: { c: Convocatoria }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Status bar */}
      <div className={`flex items-center justify-between px-4 py-2 text-xs font-semibold ${statusBadge(c.status)}`}>
        <span>{c.statusLabel}</span>
        <div className="flex items-center gap-2">
          {c.ambit && <span className="font-bold">{c.ambit}</span>}
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.subgrupoColor}`}>
            Subgrupo {c.subgrupo}
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{c.title}</h3>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{c.organismo}</p>

        <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-gray-800">{c.plazas.toLocaleString()}</span> plazas{c.sistema ? ` · ${c.sistema}` : ' libres'}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            {c.requisito}
          </span>
        </div>

        <div className="text-[11px] text-gray-400 mb-3 flex items-start gap-1">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{c.regimen}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${ctaClass(c.ctaVariant)}`}>
            {c.ctaVariant === 'primary' && <ExternalLink className="w-3.5 h-3.5" />}
            {c.ctaVariant === 'ghost' && <BellIcon className="w-3.5 h-3.5" />}
            {c.ctaLabel}
          </button>
          <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 transition-colors flex-shrink-0">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function EmpleoPublico() {
  const [ambitoFilter, setAmbitoFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [faseFilter, setFaseFilter] = useState('Plaza Abierto');
  const [regimenFilter, setRegimenFilter] = useState('Funcionario/Laboral');

  const filtered = useMemo(() => {
    return CONVOCATORIAS.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.organismo.toLowerCase().includes(q);
      const matchAmbito =
        ambitoFilter === 'Todos' ||
        (ambitoFilter === 'Estado (AGE)' && c.organismo.includes('AGE')) ||
        (ambitoFilter === 'Sanitario' && c.ambit === 'Sanitario') ||
        (ambitoFilter === 'Local' && c.ambit === 'Local') ||
        (ambitoFilter === 'Comunidades' && c.organismo.toLowerCase().includes('autonóm'));
      return matchSearch && matchAmbito;
    });
  }, [searchQuery, ambitoFilter]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans pb-24">
      <div className="max-w-md mx-auto bg-[#F4F6FA] min-h-screen">
        {/* Header */}
        <header className="px-4 pt-10 pb-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-base font-bold text-gray-800">Público</h1>
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
              placeholder="Buscar por cuerpo, titulación o código..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Ámbito territorial pills */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ámbito territorial</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 mb-3">
            {AMBITO_PILLS.map(p => (
              <button
                key={p}
                onClick={() => setAmbitoFilter(p)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${ambitoFilter === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Fase / Régimen row */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700">
              <span className="text-gray-400 text-[10px] mr-1">Fase actual</span>
              <span>{faseFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
            </button>
            <button className="flex-1 flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700">
              <span className="text-gray-400 text-[10px] mr-1">Régimen</span>
              <span className="truncate">{regimenFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1 flex-shrink-0" />
            </button>
          </div>
        </header>

        <main className="px-4 py-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: filtered.reduce((a, c) => a + c.plazas, 0).toLocaleString(), label: 'Plazas activas' },
              { value: filtered.length.toString(), label: 'Convocatorias' },
              { value: '72h', label: 'Próximos cierres' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-lg font-extrabold text-gray-900">{s.value}</div>
                <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Section header */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800">Convocatorias Destacadas</h2>
            <button className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
              Ordenar por plaza <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            filtered.map(c => <ConvocatoriaCard key={c.id} c={c} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="font-bold text-gray-700 mb-1">Sin resultados</h3>
              <p className="text-sm text-gray-400">Prueba con otros filtros o términos de búsqueda</p>
            </div>
          )}

          {/* Radar BOE Banner */}
          <div className="bg-[#0F1D3A] rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold">Radar BOE en tiempo real</p>
                <p className="text-[10px] text-white/60">Notificaciones automáticas</p>
              </div>
            </div>
            <p className="text-[11px] text-white/70 mb-3 leading-relaxed">
              No pierdas una convocatoria por 24 horas de retraso. Recibe notificaciones push instantáneas cuando se publiquen en tu subgrupo o especialidad.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['TIC & Sistemas', 'Administración General', '+ Añadir'].map(tag => (
                <span key={tag} className="text-[10px] bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              Activar alertas instantáneas
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-800 mb-1">Dudas sobre inscripciones oficiales</p>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Para formalizar instancias en el Estado es necesario disponer del{' '}
                  <span className="font-bold">Certificado Digital</span> o{' '}
                  <span className="font-bold">Clave permanente</span> a través de la plataforma IPS (Inscripción en Pruebas Selectivas).
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
