import { useState } from 'react';
import { Bell, Star, ChevronRight, Lock, CheckCircle, Zap, Clock, Play, TrendingUp, Users, Shield } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type InsigniaStatus = 'obtenida' | 'en_progreso' | 'bloqueada';
type InsigniaRank = 'Oro' | 'Platino' | 'Plata' | 'Bronce' | null;

interface Insignia {
  id: string;
  name: string;
  subtitle: string;
  status: InsigniaStatus;
  rank: InsigniaRank;
  progress?: number;
  progressLabel?: string;
  lockReason?: string;
  icon: string;
  iconBg: string;
  rankColor: string;
}

interface Mision {
  id: string;
  visibilityBoost: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  duration: string;
  ctaLabel: string;
  ctaColor: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MISIONES: Mision[] = [
  {
    id: '1',
    visibilityBoost: '+15% VISIBILIDAD',
    tag: 'Insignia Código Limpio',
    tagColor: 'bg-violet-100 text-violet-700',
    title: 'Test React & TypeScript',
    description: 'Valida tus competencias de arquitectura y patrones de diseño avanzados.',
    duration: '15 minutos',
    ctaLabel: 'Iniciar Test',
    ctaColor: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    id: '2',
    visibilityBoost: '+20% VISIBILIDAD',
    tag: 'Global Ready',
    tagColor: 'bg-green-100 text-green-700',
    title: 'Nivel de Inglés C1: Prueba Oral',
    description: 'Simulación interactiva de 3 preguntas de entrevista en inglés con IA.',
    duration: '8 minutos con IA',
    ctaLabel: 'Comenzar',
    ctaColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
];

const INSIGNIAS: Insignia[] = [
  {
    id: '1',
    name: 'CV Verificado',
    subtitle: '100% Completado',
    status: 'obtenida',
    rank: 'Oro',
    icon: '✓',
    iconBg: 'bg-amber-50 border-2 border-amber-300',
    rankColor: 'text-amber-600 bg-amber-50',
  },
  {
    id: '2',
    name: 'Cloud Validado',
    subtitle: 'AWS & Azure Pro',
    status: 'obtenida',
    rank: 'Platino',
    icon: '☁',
    iconBg: 'bg-sky-50 border-2 border-sky-300',
    rankColor: 'text-sky-600 bg-sky-50',
  },
  {
    id: '3',
    name: 'Candidato Activo',
    subtitle: '< 2h Respuesta',
    status: 'obtenida',
    rank: 'Plata',
    icon: '⚡',
    iconBg: 'bg-gray-100 border-2 border-gray-300',
    rankColor: 'text-gray-500 bg-gray-100',
  },
  {
    id: '4',
    name: 'Ciberseguridad',
    subtitle: 'Módulo 3 en curso',
    status: 'en_progreso',
    rank: null,
    progress: 70,
    progressLabel: '70% Hecho',
    icon: '🛡',
    iconBg: 'bg-purple-50 border-2 border-purple-200',
    rankColor: 'text-purple-600 bg-purple-50',
  },
  {
    id: '5',
    name: 'Top 5% Liderazgo',
    subtitle: 'Requiere Nivel 5',
    status: 'bloqueada',
    rank: null,
    lockReason: 'Requiere Nivel 5',
    icon: '👥',
    iconBg: 'bg-gray-50 border-2 border-gray-200',
    rankColor: 'text-gray-400 bg-gray-50',
  },
  {
    id: '6',
    name: 'Especialista IA',
    subtitle: 'Test desbloqueable',
    status: 'bloqueada',
    rank: null,
    lockReason: 'Test desbloqueable',
    icon: '🤖',
    iconBg: 'bg-gray-50 border-2 border-gray-200',
    rankColor: 'text-gray-400 bg-gray-50',
  },
];

// ── Insignia Card ──────────────────────────────────────────────────────────
function InsigniaCard({ ins }: { ins: Insignia }) {
  const isLocked = ins.status === 'bloqueada';
  const isProgress = ins.status === 'en_progreso';

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center transition-all ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}>
      {/* Icon circle */}
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 ${ins.iconBg}`}>
        {isLocked ? (
          <Lock className="w-6 h-6 text-gray-400" />
        ) : (
          <span>{ins.icon}</span>
        )}
        {/* Progress ring for in-progress */}
        {isProgress && ins.progress && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="4"
              strokeDasharray={`${(ins.progress / 100) * 175.9} 175.9`}
              strokeLinecap="round"
            />
          </svg>
        )}
        {/* Obtenida checkmark */}
        {ins.status === 'obtenida' && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5 text-white fill-green-500" />
          </span>
        )}
      </div>

      {/* Rank badge */}
      {ins.rank && (
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full mb-1 ${ins.rankColor}`}>{ins.rank}</span>
      )}
      {isProgress && ins.progressLabel && (
        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-1">{ins.progressLabel}</span>
      )}
      {isLocked && (
        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mb-1">Bloqueada</span>
      )}

      <p className="text-xs font-bold text-gray-800 leading-tight">{ins.name}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{ins.subtitle}</p>
    </div>
  );
}

// ── Mision Card ────────────────────────────────────────────────────────────
function MisionCard({ m }: { m: Mision }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{m.visibilityBoost}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.tagColor}`}>{m.tag}</span>
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1">{m.title}</h3>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{m.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          {m.duration}
        </div>
        <button className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${m.ctaColor}`}>
          {m.ctaLabel}
          {m.id === '1' ? <ChevronRight className="w-3.5 h-3.5" /> : <Play className="w-3 h-3 fill-current" />}
        </button>
      </div>
    </div>
  );
}

// ── Circular XP progress ───────────────────────────────────────────────────
function XPCircle({ pct }: { pct: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-extrabold text-white leading-none">{pct}%</span>
        <span className="text-[8px] text-white/70 font-medium">META</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Insignias() {
  const obtenidas = INSIGNIAS.filter(i => i.status === 'obtenida').length;

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="px-4 pt-10 pb-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-bold text-gray-800">Insignias</h1>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">OD</div>
            </div>
          </div>
        </header>

        <main className="px-4 py-4 space-y-4">
          {/* Hero XP Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0F1D3A] via-[#1a2d5a] to-[#1e3a8a] p-5 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-8 -translate-x-6" />

            <div className="flex items-start justify-between mb-3 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> Gamificación Profesional
                  </span>
                  <span className="text-[10px] font-bold text-white/60">Nivel 4 / 5</span>
                </div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-0.5">Estado Actual</p>
                <h2 className="text-xl font-extrabold leading-tight">Nivel 4: Candidato<br />Destacado</h2>
              </div>
              <XPCircle pct={85} />
            </div>

            <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 mb-3 relative z-10">
              <p className="text-[11px] text-white/80">Solo <span className="font-extrabold text-white">150 XP</span> para <span className="font-bold">Nivel 5: Experto Elite</span></p>
            </div>

            <div className="flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 rounded-xl px-3 py-2 relative z-10">
              <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-[11px] text-white/90 leading-snug">
                Tu perfil es <span className="font-extrabold text-green-400">3.2x más visible</span> para reclutadores activos.
              </p>
            </div>
          </div>

          {/* Ventaja Competitiva */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Ventaja Competitiva</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Las empresas filtran directamente por perfiles con insignias verificadas para entrevistas exprés y ofertas prioritarias.
              </p>
            </div>
          </div>

          {/* Misiones */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-800">Misiones para Desbloquear Visibilidad</h2>
              <span className="text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                {MISIONES.length} activas
              </span>
            </div>
            <div className="space-y-3">
              {MISIONES.map(m => <MisionCard key={m.id} m={m} />)}
            </div>
          </div>

          {/* Colección de Insignias */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-800">Colección de Insignias</h2>
              <span className="text-xs text-gray-400 font-medium">{obtenidas} / {INSIGNIAS.length} Obtenidas</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {INSIGNIAS.map(ins => <InsigniaCard key={ins.id} ins={ins} />)}
            </div>
          </div>

          {/* Comunidad Elite */}
          <button className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
            <div className="flex -space-x-1.5 flex-shrink-0">
              {['bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-amber-400'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900">Comunidad Elite</p>
              <p className="text-[10px] text-gray-500 truncate">+1.4k contratados este mes con insig...</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>
        </main>
      </div>
    </div>
  );
}
