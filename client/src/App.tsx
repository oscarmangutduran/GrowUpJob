import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowRight, X, Check, Sparkles, Filter, RotateCcw, Loader2 } from 'lucide-react';
import JobCard from './components/JobCard';
import Navigation from './components/Navigation';
import Navbar from './components/Navbar';
import { mockJobs } from './data/mockJobs';
import { getJobListings } from './services/api';
import { Job } from './types';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import EmpleoPublico from './components/EmpleoPublico';
import Cursos from './components/Cursos';
import Empresas from './components/Empresas';
import Perfil from './components/Perfil';
import Insignias from './components/Insignias';

const filterPills = ['Todo', '100% Remoto', 'Híbrido', 'Presencial', 'Verificadas'];

const SALARY_OPTIONS = ['Cualquier salario', '> 30.000€', '> 40.000€', '> 50.000€', '> 60.000€'];
const MODALITY_OPTIONS = ['Cualquiera', '100% Remoto', 'Híbrido', 'Presencial'];
const JORNADA_OPTIONS = ['Cualquiera', 'Completa', 'Parcial'];

export default function App() {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialScreen = queryParams?.get('screen');

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (initialScreen === 'login' || initialScreen === 'register') return false;
    if (initialScreen) return true;
    return !!localStorage.getItem('auth_token');
  });

  const [authView, setAuthView] = useState<'login' | 'register'>(() => {
    return initialScreen === 'register' ? 'register' : 'login';
  });

  const [activeTab, setActiveTab] = useState(() => {
    if (initialScreen === 'publico') return 'Público';
    if (initialScreen === 'cursos') return 'Cursos';
    if (initialScreen === 'empresas') return 'Empresas';
    if (initialScreen === 'perfil') return 'Perfil';
    if (initialScreen === 'insignias') return 'Insignias';
    return 'Empleo';
  });
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getJobListings()
      .then(res => {
        if (isMounted && res.listings && res.listings.length > 0) {
          setJobs(res.listings);
        }
      })
      .catch(err => {
        console.warn('Backend API /job-listings fallback:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingJobs(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Advanced filter state
  const [filterSalary, setFilterSalary] = useState('Cualquier salario');
  const [filterModality, setFilterModality] = useState('Cualquiera');
  const [filterJornada, setFilterJornada] = useState('Cualquiera');
  const [filterVerified, setFilterVerified] = useState(false);

  const activeAdvancedCount = [
    filterSalary !== 'Cualquier salario',
    filterModality !== 'Cualquiera',
    filterJornada !== 'Cualquiera',
    filterVerified,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilterSalary('Cualquier salario');
    setFilterModality('Cualquiera');
    setFilterJornada('Cualquiera');
    setFilterVerified(false);
    setActiveFilter('Todo');
    setSearchQuery('');
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some(t => t.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q);

      const matchesPill =
        activeFilter === 'Todo' ||
        (activeFilter === '100% Remoto' && job.modality === '100% Remoto') ||
        (activeFilter === 'Híbrido' && job.modality === 'Híbrido') ||
        (activeFilter === 'Presencial' && job.modality === 'Presencial') ||
        (activeFilter === 'Verificadas' && job.verified);

      const matchesModality =
        filterModality === 'Cualquiera' || job.modality === filterModality;

      const matchesJornada =
        filterJornada === 'Cualquiera' || job.jornada === filterJornada;

      const matchesVerified = !filterVerified || job.verified;

      const matchesSalary = (() => {
        if (filterSalary === 'Cualquier salario') return true;
        const minMap: Record<string, number> = {
          '> 30.000€': 30000,
          '> 40.000€': 40000,
          '> 50.000€': 50000,
          '> 60.000€': 60000,
        };
        const min = minMap[filterSalary] ?? 0;
        const match = job.salary.match(/(\d+)K/);
        const jobMin = match ? parseInt(match[1]) * 1000 : 0;
        return jobMin >= min;
      })();

      return matchesSearch && matchesPill && matchesModality && matchesJornada && matchesVerified && matchesSalary;
    });
  }, [searchQuery, activeFilter, filterSalary, filterModality, filterJornada, filterVerified]);

  if (!isLoggedIn) {
    if (authView === 'login') {
      return (
        <LoginScreen
          onLoginSuccess={() => setIsLoggedIn(true)}
          onNavigateToRegister={() => setAuthView('register')}
        />
      );
    } else {
      return (
        <RegisterScreen
          onRegisterSuccess={() => setIsLoggedIn(true)}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  // Handle other tab views with unified Navbar & Navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Público':
        return <EmpleoPublico />;
      case 'Cursos':
        return <Cursos />;
      case 'Empresas':
        return <Empresas />;
      case 'Insignias':
        return <Insignias />;
      case 'Perfil':
        return (
          <Perfil
            onLogout={() => {
              localStorage.removeItem('auth_token');
              setIsLoggedIn(false);
              setActiveTab('Empleo');
            }}
          />
        );
      default:
        return null;
    }
  };

  if (activeTab !== 'Empleo') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-10">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <main>{renderTabContent()}</main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Mobile Search & Filter Trigger Bar */}
        <div className="lg:hidden mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Puesto, tecnología o empresa..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-9 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold transition-colors shrink-0 ${
                activeAdvancedCount > 0
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              {activeAdvancedCount > 0 && (
                <span className="bg-white text-blue-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeAdvancedCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {filterPills.map(pill => (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === pill
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Persistent Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-5">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filtros de búsqueda</h2>
                </div>
                {(activeAdvancedCount > 0 || activeFilter !== 'Todo' || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              {/* Search Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Puesto, tecnología, empresa..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modality options */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Modalidad de trabajo
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MODALITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterModality(opt)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                        filterModality === opt
                          ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Minimum options */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Rango Salarial mínimo
                </label>
                <div className="space-y-1.5">
                  {SALARY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterSalary(opt)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        filterSalary === opt
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {filterSalary === opt && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jornada options */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Tipo de Jornada
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {JORNADA_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterJornada(opt)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        filterJornada === opt
                          ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Empresas Verificadas</span>
                    <span className="text-[11px] text-slate-500">Solo ofertas con validación oficial</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterVerified(!filterVerified)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      filterVerified ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all ${
                        filterVerified ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Column: Main Content Stream */}
          <main className="lg:col-span-8 space-y-4">
            {/* Career Insight Banner (Redesigned without AI cliché gradient) */}
            {!searchQuery && activeFilter === 'Todo' && activeAdvancedCount === 0 && (
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        ANÁLISIS DE MERCADO & PERFIL
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> 98% Afinidad
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Tu perfil técnico destaca en el Top 5% de candidatos activos
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tus insignias validadas en <strong className="text-white font-semibold">Arquitectura Cloud</strong> y <strong className="text-white font-semibold">Microservicios</strong> han recibido 14 nuevas consultas directas de reclutadores esta semana.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Insignias')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>Ver mis insignias</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stats Header Bar */}
            <div className="flex justify-between items-center py-2 px-1">
              <div className="text-xs text-slate-500 font-medium">
                Mostrando <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> oferta{filteredJobs.length !== 1 ? 's' : ''} {searchQuery || activeFilter !== 'Todo' || activeAdvancedCount > 0 ? 'filtradas' : 'disponibles para tu perfil'}
              </div>
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span>Orden: Más relevantes</span>
              </div>
            </div>

            {/* Job Cards Feed / Grid */}
            <div className="grid grid-cols-1 gap-3.5">
              {isLoadingJobs ? (
                <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Cargando ofertas desde la base de datos...</p>
                  <p className="text-xs text-slate-400 mt-1">Conectando con el servidor MySQL...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">No se encontraron resultados</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                    No hay ofertas que coincidan con los filtros seleccionados. Intenta ampliar los términos de búsqueda o restablecer los filtros.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Restablecer todos los filtros
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation Dock */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 max-h-[85vh] overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Filtros de búsqueda</h3>
                <button onClick={resetFilters} className="text-xs font-semibold text-blue-600">
                  Restablecer
                </button>
              </div>

              {/* Salary in Drawer */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Salario mínimo</h4>
                <div className="flex flex-wrap gap-2">
                  {SALARY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterSalary(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        filterSalary === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modality in Drawer */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Modalidad</h4>
                <div className="flex flex-wrap gap-2">
                  {MODALITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterModality(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        filterModality === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jornada in Drawer */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Jornada</h4>
                <div className="flex flex-wrap gap-2">
                  {JORNADA_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterJornada(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        filterJornada === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Toggle in Drawer */}
              <div className="flex items-center justify-between mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <p className="text-xs font-bold text-slate-800">Solo empresas verificadas</p>
                  <p className="text-[11px] text-slate-500">Muestra exclusivamente empleadores verificados</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterVerified(!filterVerified)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${filterVerified ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${filterVerified ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar filtros {activeAdvancedCount > 0 && `(${activeAdvancedCount})`}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

