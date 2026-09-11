import { useState, useMemo } from 'react';
import { Search, Bell, Star, Users, ChevronRight, Bookmark, Award, Building2, Leaf, Cpu, HeartPulse, Banknote, Filter } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Empresa {
  id: string;
  name: string;
  sector: string;
  size: string;
  rating: number;
  ratingCount: number;
  vacantes: number;
  descripcion: string;
  perks: string[];
  perkIcons: string[];
  logoColor: string;
  logoIcon: 'tech' | 'green' | 'fintech' | 'pharma';
  filterTag: string;
  topCultura?: { rank: number; quote: string };
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const EMPRESAS: Empresa[] = [
  {
    id: '1',
    name: 'NexTech Solutions',
    sector: 'Tecnología & Cloud',
    size: '250–500 emp.',
    rating: 4.8,
    ratingCount: 312,
    vacantes: 14,
    descripcion: 'Autonomía real, sin microgestión y presupuesto ilimitado en formación y herramientas.',
    perks: ['Flexibilidad horaria', 'Bono formación', 'Diversidad certificada'],
    perkIcons: ['🕐', '📚', '🏳️‍🌈'],
    logoColor: 'bg-blue-100 text-blue-700',
    logoIcon: 'tech',
    filterTag: 'Tecnología',
    topCultura: { rank: 1, quote: 'Autonomía real, sin microgestión y presupuesto ilimitado en...' },
  },
  {
    id: '2',
    name: 'Iberia Green Energy',
    sector: 'Renewables & Tech',
    size: '50–250 emp.',
    rating: 4.6,
    ratingCount: 189,
    vacantes: 8,
    descripcion: 'Cultura orientada a sostenibilidad y conciliación. 100% remoto con reuniones asíncronas.',
    perks: ['Conciliación familiar', 'Trabajo 100% remoto'],
    perkIcons: ['👨‍👩‍👧', '🌐'],
    logoColor: 'bg-green-100 text-green-700',
    logoIcon: 'green',
    filterTag: 'Tecnología',
    topCultura: { rank: 2, quote: 'Jornada intensiva todo el año y propósito real en cada proyecto...' },
  },
  {
    id: '3',
    name: 'BancNova Digital',
    sector: 'Fintech Líder',
    size: '+1000 emp.',
    rating: 4.5,
    ratingCount: 543,
    vacantes: 22,
    descripcion: 'Salarios certificados en el Top 10% del mercado con equity y plan de pensiones.',
    perks: ['Plan de pensiones match 6%', 'Equity & Stock Options'],
    perkIcons: ['💼', '📈'],
    logoColor: 'bg-violet-100 text-violet-700',
    logoIcon: 'fintech',
    filterTag: 'Fintech',
  },
  {
    id: '4',
    name: 'BioHealth Pharma',
    sector: 'Biomédico & R&D',
    size: '50–250 emp.',
    rating: 4.4,
    ratingCount: 97,
    vacantes: 5,
    descripcion: 'Investigación clínica puntera e instalaciones de última generación en España.',
    perks: ['Seguro médico premium familiar', 'Comedor subvencionado'],
    perkIcons: ['🏥', '🍽️'],
    logoColor: 'bg-red-100 text-red-700',
    logoIcon: 'pharma',
    filterTag: 'Salud',
  },
];

const SECTOR_PILLS = ['Todas', 'Tecnología', 'Fintech', '100% Remoto', 'Salud', 'Energía'];

// ── Logo icon helper ───────────────────────────────────────────────────────
function CompanyLogo({ type, colorClass }: { type: Empresa['logoIcon']; colorClass: string }) {
  const icons: Record<Empresa['logoIcon'], React.ElementType> = {
    tech: Cpu,
    green: Leaf,
    fintech: Banknote,
    pharma: HeartPulse,
  };
  const Icon = icons[type];
  return (
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  );
}

// ── Star rating ────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

// ── Company Card ───────────────────────────────────────────────────────────
function EmpresaCard({ e }: { e: Empresa }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <CompanyLogo type={e.logoIcon} colorClass={e.logoColor} />
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{e.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{e.sector} · {e.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
              {e.vacantes} vacantes
            </span>
            <button className="text-gray-300 hover:text-blue-500 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <Stars rating={e.rating} />
          <span className="text-sm font-bold text-gray-800">{e.rating}</span>
          <span className="text-xs text-gray-400">({e.ratingCount} v.)</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{e.descripcion}</p>

        {/* Perks */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {e.perks.map((perk, i) => (
            <span key={perk} className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
              {e.perkIcons[i]} {perk}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 rounded-xl transition-colors border border-blue-100">
          Ver perfil y {e.vacantes} vacantes
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Empresas() {
  const [sectorFilter, setSectorFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const topCultura = EMPRESAS.filter(e => e.topCultura).sort((a, b) => (a.topCultura!.rank) - (b.topCultura!.rank));

  const filtered = useMemo(() => {
    return EMPRESAS.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q);
      const matchSector =
        sectorFilter === 'Todas' ||
        e.filterTag === sectorFilter ||
        (sectorFilter === '100% Remoto' && e.perks.some(p => p.toLowerCase().includes('remoto')));
      return matchSearch && matchSector;
    });
  }, [searchQuery, sectorFilter]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="px-4 pt-10 pb-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-sm font-bold text-gray-800">Empresas</h1>
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
              placeholder="Buscar empresa por nombre, sector o..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-9 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sector pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {SECTOR_PILLS.map(p => (
              <button
                key={p}
                onClick={() => setSectorFilter(p)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${sectorFilter === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        <main className="px-4 py-4 space-y-4">
          {/* Top Cultura Laboral */}
          {!searchQuery && sectorFilter === 'Todas' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-800">Top Cultura Laboral 2024</h2>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Según candidatos</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {topCultura.map(e => (
                  <div key={e.id} className="flex-shrink-0 w-44 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <CompanyLogo type={e.logoIcon} colorClass={e.logoColor} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{e.name.split(' ')[0]} {e.name.split(' ')[1]?.slice(0,3)}.</p>
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-1.5 rounded-full flex-shrink-0">#{e.topCultura!.rank}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-semibold text-gray-600">{e.rating} ({e.ratingCount} v.)</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">"{e.topCultura!.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended companies */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800">Empresas Recomendadas</h2>
            <span className="text-xs text-gray-400">Mostrando {filtered.length} destacadas</span>
          </div>

          {filtered.length > 0 ? (
            filtered.map(e => <EmpresaCard key={e.id} e={e} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="font-bold text-gray-700 mb-1">Sin resultados</h3>
              <p className="text-sm text-gray-400">Prueba con otros términos o sectores</p>
              <button
                onClick={() => { setSearchQuery(''); setSectorFilter('Todas'); }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl"
              >
                Ver todas
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
