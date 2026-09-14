import { useState, useMemo } from 'react';
import { Search, ExternalLink, Bell as BellIcon, Info, Users, GraduationCap, Zap, Bookmark, Landmark, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

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
    statusLabel: 'Cierre de plazo inminente (24h)',
    subgrupo: 'A2',
    subgrupoColor: 'text-blue-700 bg-blue-50 border-blue-200/60',
    title: 'Técnico/a de Gestión de Sistemas e Informática (TIC)',
    organismo: 'Administración General del Estado (AGE) · Ministerio para la Transformación Digital',
    plazas: 450,
    requisito: 'Grado / Diplomatura / Ingeniería Técnica',
    regimen: 'Funcionario de Carrera · Oposición libre',
    ctaLabel: 'Ver bases en BOE',
    ctaVariant: 'primary',
  },
  {
    id: '2',
    status: 'abierto',
    statusLabel: 'Plazo abierto (34 días restantes)',
    subgrupo: 'C1',
    subgrupoColor: 'text-amber-800 bg-amber-50 border-amber-200/60',
    title: 'Cuerpo Administrativo de la Seguridad Social',
    organismo: 'Instituto Nacional de la Seguridad Social (INSS) · Ministerio de Inclusión',
    plazas: 1200,
    requisito: 'Bachillerato o Técnico Superior',
    regimen: 'Oposición libre nacional',
    ctaLabel: 'Consultar convocatoria oficial',
    ctaVariant: 'warning',
    extraInfo: 'Acceso: Bachillerato o Técnico',
  },
  {
    id: '3',
    status: 'listas',
    statusLabel: 'Listas provisionales de admitidos',
    subgrupo: 'A2',
    subgrupoColor: 'text-emerald-800 bg-emerald-50 border-emerald-200/60',
    ambit: 'Sanitario',
    title: 'Enfermero/a del Servicio Autonómico de Salud',
    organismo: 'Servicios Sanitarios Regionales · Conselleria de Sanitat',
    plazas: 850,
    requisito: 'Grado en Enfermería',
    regimen: 'Concurso-Oposición · Estatuarios fijos',
    sistema: '850 plazas',
    ctaLabel: 'Consultar listas y alegaciones',
    ctaVariant: 'success',
  },
  {
    id: '4',
    status: 'proximamente',
    statusLabel: 'Oferta de empleo público aprobada (OEP)',
    subgrupo: 'A1',
    subgrupoColor: 'text-purple-800 bg-purple-50 border-purple-200/60',
    ambit: 'Local',
    title: 'Arquitecto/a Municipal & Urbanismo',
    organismo: 'Ayuntamiento de Valencia · Concejalía de Desarrollo Urbano',
    plazas: 12,
    requisito: 'Grado o Máster en Arquitectura',
    regimen: 'Turno libre · Funcionario de carrera',
    ctaLabel: 'Activar aviso de publicación',
    ctaVariant: 'ghost',
  },
];

const AMBITO_PILLS = ['Todos', 'Estado (AGE)', 'Comunidades', 'Local', 'Sanitario', 'Docente'];

function statusBadge(s: ConvocatoriaStatus) {
  const map: Record<ConvocatoriaStatus, string> = {
    urgente: 'bg-rose-50 text-rose-700 border-rose-200/80',
    abierto: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    listas: 'bg-blue-50 text-blue-700 border-blue-200/80',
    proximamente: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return map[s];
}

interface ConvocatoriaCardProps {
  key?: any;
  c: Convocatoria;
}

function ConvocatoriaCard({ c }: ConvocatoriaCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Status top bar */}
        <div className={`flex items-center justify-between px-4 py-2 border-b text-xs font-semibold ${statusBadge(c.status)}`}>
          <span className="flex items-center gap-1.5">
            {c.status === 'urgente' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
            {c.status === 'abierto' && <Clock className="w-3.5 h-3.5 text-emerald-600" />}
            {c.status === 'listas' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
            <span>{c.statusLabel}</span>
          </span>
          <div className="flex items-center gap-2">
            {c.ambit && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {c.ambit}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${c.subgrupoColor}`}>
              Grupo {c.subgrupo}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5">
          <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 hover:text-blue-600 transition-colors cursor-pointer">
            {c.title}
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
            {c.organismo}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">{c.plazas.toLocaleString()} Plazas</span>
                <span className="text-[10px] text-slate-500">{c.sistema ?? 'Turno Libre'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block truncate">{c.requisito}</span>
                <span className="text-[10px] text-slate-500">Titulación mínima</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 mb-2 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span>Régimen: {c.regimen}</span>
          </div>
        </div>
      </div>

      {/* Actions bottom */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <a
          href="https://boe.es"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-xs font-bold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
        >
          <span>{c.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => setSaved(!saved)}
          aria-label="Guardar convocatoria"
          className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
            saved
              ? 'border-blue-300 text-blue-600 bg-blue-50'
              : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function EmpleoPublico() {
  const [ambitoFilter, setAmbitoFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return CONVOCATORIAS.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.organismo.toLowerCase().includes(q);
      const matchAmbito =
        ambitoFilter === 'Todos' ||
        (ambitoFilter === 'Estado (AGE)' && c.organismo.includes('AGE')) ||
        (ambitoFilter === 'Sanitario' && c.ambit === 'Sanitario') ||
        (ambitoFilter === 'Local' && c.ambit === 'Local') ||
        (ambitoFilter === 'Comunidades' && c.organismo.toLowerCase().includes('regional'));
      return matchSearch && matchAmbito;
    });
  }, [searchQuery, ambitoFilter]);

  const totalPlazas = useMemo(() => {
    return filtered.reduce((acc, curr) => acc + curr.plazas, 0);
  }, [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
              Boletín Oficial del Estado & CCAA
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Oficial de Oposiciones & Empleo Público
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Convocatorias verificadas de la Administración General del Estado, CCAA y Entidades Locales.
          </p>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-slate-900">{totalPlazas.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Plazas en plazo</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-blue-600">{filtered.length}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Convocatorias</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 mb-6 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Buscar por titulación, cuerpo, código BOE o localidad..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
        </div>

        {/* Ámbito pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Ámbito:</span>
          {AMBITO_PILLS.map(p => (
            <button
              key={p}
              onClick={() => setAmbitoFilter(p)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                ambitoFilter === p
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.length > 0 ? (
          filtered.map(c => <ConvocatoriaCard key={c.id} c={c} />)
        ) : (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Sin convocatorias coincidentes</h3>
            <p className="text-xs text-slate-500">Prueba a seleccionar otro ámbito o a limpiar la búsqueda.</p>
          </div>
        )}
      </div>

      {/* Radar BOE Notification Panel */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-blue-500/20 text-blue-400">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Radar BOE & Boletines Autonómicos
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Alertas automáticas al momento de apertura de instancias
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monitorizamos diariamente el BOE, el DOGC, el BOCM, el BOJA y más de 50 boletines provinciales. Te notificamos en cuanto se abre el plazo oficial de 20 días hábiles para tu especialidad.
          </p>
        </div>

        <button
          onClick={() => alert('Radar BOE activado para tu perfil profesional.')}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <BellIcon className="w-4 h-4" />
          <span>Activar alertas oficiales</span>
        </button>
      </div>
    </div>
  );
}

