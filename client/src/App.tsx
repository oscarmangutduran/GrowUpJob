/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Bell } from 'lucide-react';
import JobCard from './components/JobCard';
import Navigation from './components/Navigation';
import { BrandText, Logo } from './components/Logo';
import { mockJobs } from './data/mockJobs';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#1F9B5E] selection:text-white pb-20">
      
      {!isLoggedIn && (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      )}

      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto sm:max-w-xl md:max-w-3xl bg-[#F8FAFC] min-h-screen relative shadow-sm"
        >
        {/* Header */}
        <header className="px-5 pt-10 pb-4 bg-white sticky top-0 z-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <BrandText className="text-2xl" />
            </div>
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 relative bg-gray-50 hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#1F9B5E] rounded-full border-2 border-white"></span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar ofertas, empresas..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#334195] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>
            <button className="w-12 h-12 bg-[#334195] rounded-xl flex items-center justify-center text-white hover:bg-[#283375] transition-colors shadow-sm shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-5 py-6">
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recomendado para ti</h2>
              <button className="text-[#1F9B5E] text-sm font-semibold hover:underline">Ver todo</button>
            </div>

            <div className="flex flex-col gap-4">
              {mockJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Búsquedas recientes</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Desarrollador React', 'Diseñador UI', 'Remoto', 'Node.js'].map(term => (
                <span key={term} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm cursor-pointer hover:border-[#334195] hover:text-[#334195] transition-colors">
                  {term}
                </span>
              ))}
            </div>
          </section>
        </main>
        
        <Navigation />
        </motion.div>
      )}
    </div>
  );
}
