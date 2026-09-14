import React, { useState, useMemo } from 'react';
import {
  Search, Star, ChevronRight, Bookmark, Award, Leaf, Cpu, HeartPulse,
  Banknote, ThumbsUp, MessageSquare, X, Clock, Trophy, Globe,
  Users, BookOpen, Heart, TrendingUp, CheckCircle2, ArrowUpRight, Building2
} from 'lucide-react';

// ── Insignia types ─────────────────────────────────────────────────────────
interface Insignia {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  description: string;
  minRating: number;
}

const ALL_INSIGNIAS: Insignia[] = [
  { id: 'ambiente', icon: Heart, label: 'Excelente Clima', color: 'bg-amber-50 text-amber-800 border-amber-200/70', description: 'Valorado por su excelente ambiente de trabajo y compañerismo', minRating: 4.5 },
  { id: 'flexible', icon: Clock, label: 'Horario Flexible', color: 'bg-blue-50 text-blue-700 border-blue-200/70', description: 'Política de flexibilidad real y conciliación horaria', minRating: 4.3 },
  { id: 'liderazgo', icon: Trophy, label: 'Liderazgo Empático', color: 'bg-purple-50 text-purple-700 border-purple-200/70', description: 'Managers reconocidos por feedback constructivo y mentoría', minRating: 4.6 },
  { id: 'salario', icon: Banknote, label: 'Salario Competitivo', color: 'bg-emerald-50 text-emerald-800 border-emerald-200/70', description: 'Retribución en el percentil superior del sector', minRating: 4.2 },
  { id: 'remoto', icon: Globe, label: '100% Remoto Real', color: 'bg-sky-50 text-sky-700 border-sky-200/70', description: 'Empresa comprometida con el teletrabajo sin presencialismo', minRating: 4.0 },
  { id: 'diversidad', icon: Users, label: 'Diversidad & Inclusión', color: 'bg-rose-50 text-rose-700 border-rose-200/70', description: 'Políticas activas de igualdad y diversidad de perfiles', minRating: 4.4 },
  { id: 'formacion', icon: BookOpen, label: 'Presupuesto Formación', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/70', description: 'Inversión anual individual en cursos, libros y certificaciones', minRating: 4.3 },
  { id: 'sostenible', icon: Leaf, label: 'Impacto Sostenible', color: 'bg-emerald-50 text-emerald-800 border-emerald-200/70', description: 'Compromiso medioambiental y reducción verificada de huella', minRating: 4.1 },
  { id: 'conciliacion', icon: HeartPulse, label: 'Conciliación Familiar', color: 'bg-pink-50 text-pink-700 border-pink-200/70', description: 'Permisos parentales ampliados y desconexión digital estricta', minRating: 4.2 },
  { id: 'equity', icon: TrendingUp, label: 'Equity / Stock Options', color: 'bg-amber-50 text-amber-800 border-amber-200/70', description: 'Participación real en el crecimiento accionarial', minRating: 4.0 },
];

// ── Types ──────────────────────────────────────────────────────────────────
interface Reseña {
  id: string;
  autor: string;
  cargo: string;
  texto: string;
  rating: number;
  fecha: string;
  insigniasVotadas: string[];
}

interface Empresa {
  id: string;
  name: string;
  sector: string;
  size: string;
  rating: number;
  ratingCount: number;
  vacantes: number;
  descripcion: string;
  logoColor: string;
  logoIcon: 'tech' | 'green' | 'fintech' | 'pharma';
  filterTag: string;
  topCultura?: { rank: number; quote: string };
  insigniasObtenidas: string[];
  reseñas: Reseña[];
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const EMPRESAS: Empresa[] = [
  {
    id: '1',
    name: 'NexTech Solutions',
    sector: 'Cloud Engineering & DevOps',
    size: '250–500 empleados',
    rating: 4.8,
    ratingCount: 312,
    vacantes: 14,
    descripcion: 'Autonomía de equipos, sin burocracia jerárquica y presupuesto anual individual para certificaciones y congresos.',
    logoColor: 'bg-blue-600 text-white',
    logoIcon: 'tech',
    filterTag: 'Tecnología',
    topCultura: { rank: 1, quote: 'Autonomía técnica y libertad de arquitectura en producción...' },
    insigniasObtenidas: ['ambiente', 'flexible', 'liderazgo', 'formacion', 'diversidad'],
    reseñas: [
      { id: 'r1', autor: 'Miguel R.', cargo: 'Senior DevOps', texto: 'El mejor entorno donde he trabajado. Autonomía real, buen sueldo y cultura sin micromanagement.', rating: 5, fecha: 'Hace 2 días', insigniasVotadas: ['ambiente', 'liderazgo', 'formacion'] },
      { id: 'r2', autor: 'Sara L.', cargo: 'Cloud Architect', texto: 'Presupuesto real para cursos y certificaciones oficiales sin trabas burocráticas.', rating: 5, fecha: 'Hace 1 semana', insigniasVotadas: ['flexible', 'formacion', 'diversidad'] },
    ],
  },
  {
    id: '2',
    name: 'Iberia Green Energy',
    sector: 'CleanTech & Renovables',
    size: '100–250 empleados',
    rating: 4.6,
    ratingCount: 189,
    vacantes: 8,
    descripcion: 'Cultura orientada a sostenibilidad y conciliación real. 100% remoto con reuniones asíncronas por defecto.',
    logoColor: 'bg-emerald-600 text-white',
    logoIcon: 'green',
    filterTag: 'Tecnología',
    topCultura: { rank: 2, quote: 'Jornada intensiva los viernes y propósito tangible en cada proyecto...' },
    insigniasObtenidas: ['sostenible', 'remoto', 'conciliacion', 'flexible'],
    reseñas: [
      { id: 'r3', autor: 'Ana P.', cargo: 'Data Engineer', texto: 'Compañía con propósito de impacto real. Se cuida el bienestar del equipo y los horarios.', rating: 5, fecha: 'Hace 3 días', insigniasVotadas: ['sostenible', 'conciliacion'] },
      { id: 'r4', autor: 'Carlos M.', cargo: 'Backend Dev', texto: 'Remoto 100% verificado, sin sorpresas ni presencialismo encubierto.', rating: 4, fecha: 'Hace 2 semanas', insigniasVotadas: ['remoto', 'flexible'] },
    ],
  },
  {
    id: '3',
    name: 'BancNova Digital',
    sector: 'Fintech & Pagos Digitales',
    size: '+1.000 empleados',
    rating: 4.5,
    ratingCount: 543,
    vacantes: 22,
    descripcion: 'Salarios certificados en el Top 10% del mercado bancario europeo con plan de equity y seguro médico privado.',
    logoColor: 'bg-slate-900 text-white',
    logoIcon: 'fintech',
    filterTag: 'Fintech',
    insigniasObtenidas: ['salario', 'equity', 'liderazgo'],
    reseñas: [
      { id: 'r5', autor: 'Javier T.', cargo: 'Lead Architect', texto: 'El paquete de compensación es muy sólido y el plan de stock options es transparente.', rating: 5, fecha: 'Hace 5 días', insigniasVotadas: ['salario', 'equity'] },
    ],
  },
  {
    id: '4',
    name: 'BioHealth Pharma Lab',
    sector: 'Biotecnología & Salud',
    size: '50–250 empleados',
    rating: 4.4,
    ratingCount: 97,
    vacantes: 5,
    descripcion: 'I+D biomédico con laboratorios de última generación e investigación de fármacos pioneros.',
    logoColor: 'bg-indigo-600 text-white',
    logoIcon: 'pharma',
    filterTag: 'Salud',
    insigniasObtenidas: ['conciliacion', 'ambiente'],
    reseñas: [
      { id: 'r6', autor: 'Dra. Laura G.', cargo: 'Investigadora Principal', texto: 'Instalaciones científicas de primer nivel en Madrid y equipo multidisciplinar de gran talento.', rating: 4, fecha: 'Hace 1 mes', insigniasVotadas: ['ambiente', 'conciliacion'] },
    ],
  },
];

const SECTOR_PILLS = ['Todas', 'Tecnología', 'Fintech', '100% Remoto', 'Salud', 'Energía'];

function CompanyLogo({ type, colorClass }: { type: Empresa['logoIcon']; colorClass: string }) {
  const icons = { tech: Cpu, green: Leaf, fintech: Banknote, pharma: HeartPulse };
  const Icon = icons[type];
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  );
}

interface EmpresaCardProps {
  key?: any;
  e: Empresa;
  onShowReseñas: () => void;
}

function EmpresaCard({ e, onShowReseñas }: EmpresaCardProps) {
  const [saved, setSaved] = useState(false);
  const insignias = ALL_INSIGNIAS.filter(ins => e.insigniasObtenidas.includes(ins.id));

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3.5">
            <CompanyLogo type={e.logoIcon} colorClass={e.logoColor} />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">{e.name}</h3>
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">{e.sector} · {e.size}</p>
            </div>
          </div>

          <button
            onClick={() => setSaved(!saved)}
            aria-label="Guardar empresa"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              saved
                ? 'border-blue-300 text-blue-600 bg-blue-50'
                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Rating and Reviews Counter */}
        <div className="flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-200/60">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{e.rating}</span>
          </div>
          <span className="text-slate-500">
            {e.ratingCount} valoraciones de empleados
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-bold text-blue-700">
            {e.vacantes} vacantes abiertas
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {e.descripcion}
        </p>

        {/* Insignias Obtenidas */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {insignias.map(ins => {
            const Icon = ins.icon;
            return (
              <span
                key={ins.id}
                title={ins.description}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${ins.color}`}
              >
                <Icon className="w-3 h-3" />
                <span>{ins.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={onShowReseñas}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ver {e.reseñas.length} reseñas verificadas</span>
        </button>

        <button
          onClick={onShowReseñas}
          className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
        >
          <span>Ver perfil</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Modal de Reseñas ───────────────────────────────────────────────────────
function ReseñaModal({ empresa, onClose }: { empresa: Empresa; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CompanyLogo type={empresa.logoIcon} colorClass={empresa.logoColor} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{empresa.name}</h2>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-800">{empresa.rating}</span>
                <span>({empresa.ratingCount} valoraciones verificadas)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Opiniones de empleados en plantilla
          </h3>
          {empresa.reseñas.map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{r.autor}</span>
                  <span className="text-[11px] text-slate-500">{r.cargo} · {r.fecha}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{r.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{r.texto}"
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Empresas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Todas');
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const filtered = useMemo(() => {
    return EMPRESAS.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q);
      const matchSector =
        sectorFilter === 'Todas' ||
        (sectorFilter === 'Tecnología' && e.filterTag === 'Tecnología') ||
        (sectorFilter === 'Fintech' && e.filterTag === 'Fintech') ||
        (sectorFilter === 'Salud' && e.filterTag === 'Salud') ||
        (sectorFilter === '100% Remoto' && e.insigniasObtenidas.includes('remoto'));
      return matchSearch && matchSector;
    });
  }, [searchQuery, sectorFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
              Cultura & Transparencia Laboral
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Directorio de Empresas con Cultura Verificada
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conoce de primera mano salarios, flexibilidad, liderazgo y opiniones de empleados reales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-slate-900">{EMPRESAS.length}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Empresas TOP</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-blue-600">4.6</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Rating medio</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 mb-6 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Buscar empresa por nombre, sector o tecnología..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
          />
        </div>

        {/* Sectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Sector:</span>
          {SECTOR_PILLS.map(p => (
            <button
              key={p}
              onClick={() => setSectorFilter(p)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sectorFilter === p
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {filtered.length > 0 ? (
          filtered.map(e => (
            <EmpresaCard key={e.id} e={e} onShowReseñas={() => setSelectedEmpresa(e)} />
          ))
        ) : (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Sin empresas coincidentes</h3>
            <p className="text-xs text-slate-500">Prueba con otro sector o borra el texto de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEmpresa && (
        <ReseñaModal empresa={selectedEmpresa} onClose={() => setSelectedEmpresa(null)} />
      )}
    </div>
  );
}
