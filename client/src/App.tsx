/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Bell, ChevronRight, TrendingUp, X, Check } from 'lucide-react';
import JobCard from './components/JobCard';
import Navigation from './components/Navigation';
import { Logo } from './components/Logo';
import { mockJobs } from './data/mockJobs';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import EmpleoPublico from './components/EmpleoPublico';
import Cursos from './components/Cursos';

const filterPills = ['Todo', '100% Remoto', 'Híbrido', 'Presencial', 'Verificadas'];

const SALARY_OPTIONS = ['Cualquier salario', '> 30.000€', '> 40.000€', '> 50.000€', '> 60.000€'];
const MODALITY_OPTIONS = ['Cualquiera', '100% Remoto', 'Híbrido', 'Presencial'];
const JORNADA_OPTIONS = ['Cualquiera', 'Completa', 'Parcial'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('Empleo');
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
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

  // Render Público tab
  if (activeTab === 'Público') {
    return (
      <>
        <EmpleoPublico />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  // Render Cursos tab
  if (activeTab === 'Cursos') {
    return (
      <>
        <Cursos />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  // Placeholder for other tabs
  if (!['Empleo', 'Público', 'Cursos'].includes(activeTab)) {
    return (
      <>
        <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center pb-24 text-center px-6">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">{activeTab}</h2>
          <p className="text-sm text-gray-400">Esta sección está en desarrollo. ¡Pronto disponible!</p>
        </div>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto bg-[#F4F6FA] min-h-screen relative"
      >
        {/* Header */}
        <header className="px-4 pt-10 pb-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Logo className="w-7 h-7" />
              <div>
                <div className="text-xs text-gray-400 font-medium leading-none">GrowUp</div>
                <div className="text-sm font-bold text-gray-800 leading-tight">Empleo</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 relative bg-gray-50 hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                OD
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Puesto, tecnología o empresa..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-9 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilters(true)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors shrink-0 ${activeAdvancedCount > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              {activeAdvancedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeAdvancedCount}
                </span>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {filterPills.map(pill => (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === pill
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {pill === '100% Remoto' && '📡 '}{pill}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-4">
          {/* Stats bar */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-gray-500">
              <span className="text-green-600 font-bold">
                ● {filteredJobs.length} oferta{filteredJobs.length !== 1 ? 's' : ''}
              </span>{' '}
              {searchQuery || activeFilter !== 'Todo' || activeAdvancedCount > 0
                ? 'encontradas'
                : 'activas para tu perfil'}
            </div>
            <button className="text-xs text-gray-500 font-semibold flex items-center gap-1">
              Relevancia <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Profile Boost Banner - hide when searching */}
          {!searchQuery && activeFilter === 'Todo' && activeAdvancedCount === 0 && (
            <div className="mb-4 bg-gradient-to-r from-violet-500 to-purple-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-md shadow-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-xs font-bold uppercase tracking-wide">IMPULSO DE PERFIL</span>
                    <span className="bg-green-400 text-green-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">+98% Afinidad</span>
                  </div>
                  <p className="text-white/90 text-xs leading-snug">
                    Tus insignias en <span className="font-bold">Arquitectura Cloud</span> y <span className="font-bold">UI Systems</span> te posicionan en el <span className="font-bold">Top 5% de candidatos.</span>
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/70 flex-shrink-0" />
            </div>
          )}

          {/* Job Cards */}
          <div className="flex flex-col gap-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-700 mb-1">Sin resultados</h3>
                <p className="text-sm text-gray-400">Prueba con otros términos o ajusta los filtros</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveFilter('Todo'); resetFilters(); }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
        </main>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl z-50 p-6 pb-10 shadow-2xl"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900">Filtros avanzados</h2>
                <button onClick={resetFilters} className="text-blue-600 text-sm font-semibold">
                  Restablecer
                </button>
              </div>

              {/* Salary */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Salario mínimo</h3>
                <div className="flex flex-wrap gap-2">
                  {SALARY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterSalary(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        filterSalary === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modality */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Modalidad</h3>
                <div className="flex flex-wrap gap-2">
                  {MODALITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterModality(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        filterModality === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jornada */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Jornada</h3>
                <div className="flex flex-wrap gap-2">
                  {JORNADA_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterJornada(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        filterJornada === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified toggle */}
              <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-gray-700">Solo empresas verificadas</p>
                  <p className="text-xs text-gray-400">Muestra únicamente ofertas con ✓</p>
                </div>
                <button
                  onClick={() => setFilterVerified(!filterVerified)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${filterVerified ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${filterVerified ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Aplicar filtros {activeAdvancedCount > 0 && `(${activeAdvancedCount})`}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
