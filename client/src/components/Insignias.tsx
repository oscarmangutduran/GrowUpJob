import { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Cloud, 
  Zap, 
  Brain, 
  Clock, 
  ChevronRight, 
  Play, 
  TrendingUp, 
  Users, 
  Star, 
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type InsigniaStatus = 'obtenida' | 'en_progreso' | 'bloqueada';
type InsigniaRank = 'Oro' | 'Platino' | 'Plata' | 'Bronce' | null;

interface Insignia {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  status: InsigniaStatus;
  rank: InsigniaRank;
  progress?: number;
  progressLabel?: string;
  lockReason?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  rankColor: string;
  dateObtained?: string;
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
  type: 'code' | 'audio' | 'quiz';
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MISIONES: Mision[] = [
  {
    id: '1',
    visibilityBoost: '+15% VISIBILIDAD',
    tag: 'Arquitectura de Código',
    tagColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    title: 'Evaluación Práctica React & TypeScript',
    description: 'Valida tus conocimientos sobre Hooks avanzados, patrones de diseño de componentes y tipado estricto.',
    duration: '15 minutos',
    ctaLabel: 'Iniciar Test',
    ctaColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    type: 'code',
  },
  {
    id: '2',
    visibilityBoost: '+20% VISIBILIDAD',
    tag: 'Idioma Profesional',
    tagColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    title: 'Competencia Oral de Inglés C1',
    description: 'Entrevista interactiva de 3 preguntas situacionales de negocio con transcripción y análisis de fluidez.',
    duration: '8 minutos',
    ctaLabel: 'Comenzar Audio',
    ctaColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    type: 'audio',
  },
  {
    id: '3',
    visibilityBoost: '+25% VISIBILIDAD',
    tag: 'Cloud & DevOps',
    tagColor: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    title: 'Fundamentos de Seguridad en AWS & Docker',
    description: '10 casos reales de hardening de contenedores, gestión de secrets y políticas IAM de mínimo privilegio.',
    duration: '12 minutos',
    ctaLabel: 'Ver Requisitos',
    ctaColor: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
    type: 'quiz',
  },
];

const INSIGNIAS: Insignia[] = [
  {
    id: '1',
    name: 'Perfil Verificado 100%',
    subtitle: 'Identidad y Titulación',
    description: 'Datos académicos y experiencia laboral validados con documentos oficiales.',
    status: 'obtenida',
    rank: 'Oro',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    iconColor: 'text-emerald-600',
    rankColor: 'text-amber-700 bg-amber-50 border-amber-200',
    dateObtained: 'Obtenida en Ago 2026',
  },
  {
    id: '2',
    name: 'Especialista Cloud & CI/CD',
    subtitle: 'AWS, Azure & Docker',
    description: 'Prueba práctica de despliegue reproducible y pipelines automatizados superada.',
    status: 'obtenida',
    rank: 'Platino',
    icon: Cloud,
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    iconColor: 'text-sky-600',
    rankColor: 'text-sky-700 bg-sky-50 border-sky-200',
    dateObtained: 'Obtenida en Jul 2026',
  },
  {
    id: '3',
    name: 'Respuesta Ultrarrápida',
    subtitle: 'Tiempo medio < 2h',
    description: 'Candidato con tasa de respuesta superior al 95% ante solicitudes de empresas.',
    status: 'obtenida',
    rank: 'Plata',
    icon: Zap,
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    iconColor: 'text-amber-600',
    rankColor: 'text-slate-600 bg-slate-100 border-slate-200',
    dateObtained: 'Activa este mes',
  },
  {
    id: '4',
    name: 'Ciberseguridad y OWASP',
    subtitle: 'Módulo 3 de 4 en curso',
    description: 'Evaluación técnica de prevención de inyecciones, CSRF y control de acceso.',
    status: 'en_progreso',
    rank: null,
    progress: 75,
    progressLabel: '75% Completado',
    icon: ShieldCheck,
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
    iconColor: 'text-purple-600',
    rankColor: '',
  },
  {
    id: '5',
    name: 'Liderazgo Técnico (Top 5%)',
    subtitle: 'Requiere Nivel 5 de reputación',
    description: 'Acreditación de gestión de equipos, mentoring y estimación de proyectos de gran escala.',
    status: 'bloqueada',
    rank: null,
    lockReason: 'Alcanza el Nivel 5 de Reputación',
    icon: Users,
    iconBg: 'bg-slate-50 text-slate-400 border-slate-200',
    iconColor: 'text-slate-400',
    rankColor: '',
  },
  {
    id: '6',
    name: 'Ingeniería con LLMs & AI',
    subtitle: 'Test práctico desbloqueable',
    description: 'Dominio de embeddings, arquitecturas RAG y fine-tuning de modelos generativos.',
    status: 'bloqueada',
    rank: null,
    lockReason: 'Requiere aprobar React & TypeScript',
    icon: Brain,
    iconBg: 'bg-slate-50 text-slate-400 border-slate-200',
    iconColor: 'text-slate-400',
    rankColor: '',
  },
];

// ── Subcomponents ──────────────────────────────────────────────────────────
interface InsigniaCardProps {
  key?: any;
  ins: Insignia;
}

function InsigniaCard({ ins }: InsigniaCardProps) {
  const isLocked = ins.status === 'bloqueada';
  const isProgress = ins.status === 'en_progreso';
  const IconComponent = ins.icon;

  return (
    <div
      className={`bg-white rounded-xl border transition-all p-5 flex flex-col justify-between ${
        isLocked 
          ? 'border-slate-200/80 bg-slate-50/50 opacity-75' 
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${ins.iconBg}`}>
            {isLocked ? (
              <Lock className="w-5 h-5 text-slate-400" />
            ) : (
              <IconComponent className="w-6 h-6" />
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            {ins.rank && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ins.rankColor}`}>
                Rango {ins.rank}
              </span>
            )}
            {isProgress && (
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {ins.progressLabel}
              </span>
            )}
            {isLocked && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                Bloqueada
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-slate-900 text-base mb-1">{ins.name}</h3>
        <p className="text-xs font-medium text-blue-600 mb-2">{ins.subtitle}</p>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">{ins.description}</p>
      </div>

      <div>
        {isProgress && ins.progress && (
          <div className="mb-3">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Progreso de evaluación</span>
              <span className="font-semibold text-slate-700">{ins.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                style={{ width: `${ins.progress}%` }}
              />
            </div>
          </div>
        )}

        {isLocked && ins.lockReason && (
          <div className="bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 mb-2 flex items-center gap-1.5 text-[11px] text-slate-600">
            <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{ins.lockReason}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {ins.status === 'obtenida' ? (ins.dateObtained || 'Verificada') : isProgress ? 'En evaluación' : 'Requisito pendiente'}
          </span>
          <button 
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            Detalles <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MisionCardProps {
  key?: any;
  m: Mision;
}

function MisionCard({ m }: MisionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5 max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">
            {m.visibilityBoost}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${m.tagColor}`}>
            {m.tag}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{m.title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Duración estimada: {m.duration}</span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <button className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors ${m.ctaColor}`}>
          <span>{m.ctaLabel}</span>
          {m.type === 'audio' ? <Play className="w-3 h-3 fill-current" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Insignias() {
  const [filter, setFilter] = useState<'todas' | 'obtenida' | 'en_progreso' | 'bloqueada'>('todas');

  const obtenidasCount = INSIGNIAS.filter(i => i.status === 'obtenida').length;
  const enProgresoCount = INSIGNIAS.filter(i => i.status === 'en_progreso').length;
  const bloqueadasCount = INSIGNIAS.filter(i => i.status === 'bloqueada').length;

  const filteredInsignias = filter === 'todas' 
    ? INSIGNIAS 
    : INSIGNIAS.filter(i => i.status === filter);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Acreditación y Reputación Profesional</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Insignias y Verificaciones Técnicas
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Demuestra tus habilidades técnicas y blandas con evaluaciones prácticas objetivas. Los perfiles con insignias validadas reciben prioridad por parte de las empresas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-right shadow-sm">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Credenciales Validadas</p>
              <p className="text-lg font-bold text-slate-900">{obtenidasCount} <span className="text-xs font-medium text-slate-400">/ {INSIGNIAS.length}</span></p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Hero Progress Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Nivel de Confianza
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Nivel 4 de 5</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Nivel 4: Candidato Destacado
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Faltan solo <strong className="text-white font-semibold">150 XP</strong> para desbloquear el <strong className="text-blue-400 font-semibold">Nivel 5: Experto Elite</strong> y la insignia de Liderazgo Técnico.
                  </p>
                  
                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>850 / 1.000 XP acumulados</span>
                      <span className="font-semibold text-white">85%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 sm:p-5 flex-shrink-0 flex sm:flex-col items-center justify-between sm:justify-center text-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white leading-none">3.2x</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Mayor Visibilidad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Misiones de Validación Técnica */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Misiones para Aumentar Visibilidad</h2>
                  <p className="text-xs text-slate-500">Supera pruebas cortas y directas para acreditar habilidades en tu CV</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {MISIONES.length} activas hoy
                </span>
              </div>

              <div className="space-y-3">
                {MISIONES.map(m => (
                  <MisionCard key={m.id} m={m} />
                ))}
              </div>
            </div>

            {/* Colección de Insignias */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Catálogo de Insignias y Certificaciones</h2>
                  <p className="text-xs text-slate-500">Credenciales verificadas que se muestran en tus postulaciones</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-lg text-xs">
                  <button
                    onClick={() => setFilter('todas')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filter === 'todas' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas ({INSIGNIAS.length})
                  </button>
                  <button
                    onClick={() => setFilter('obtenida')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filter === 'obtenida' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Obtenidas ({obtenidasCount})
                  </button>
                  <button
                    onClick={() => setFilter('en_progreso')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filter === 'en_progreso' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    En curso ({enProgresoCount})
                  </button>
                  <button
                    onClick={() => setFilter('bloqueada')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filter === 'bloqueada' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Por desbloquear ({bloqueadasCount})
                  </button>
                </div>
              </div>

              {/* Grid of Insignias */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredInsignias.map(ins => (
                  <InsigniaCard key={ins.id} ins={ins} />
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Ventaja de Selección */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Beneficios de Validación</h3>
                  <p className="text-xs text-slate-500">¿Por qué completar insignias?</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Acceso a entrevistas prioritarias:</strong> Las empresas filtran candidatos con competencias demostradas.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Sello de verificación en el CV:</strong> Exporta tu currículum con enlaces criptográficos a tus tests.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Garantía de banda salarial:</strong> Perfiles verificados obtienen ofertas un 18% superiores en promedio.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-1 flex items-center justify-center gap-1">
                  Leer cómo auditamos las pruebas <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Escala de Reputación */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Escala de Niveles GrowUpJob</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">Nivel 1 & 2: Iniciado</span>
                    <p className="text-[11px] text-slate-500">Perfil básico completado</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">0 - 400 XP</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">Nivel 3: Profesional</span>
                    <p className="text-[11px] text-slate-500">1 test técnico aprobado</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">401 - 700 XP</span>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-900">Nivel 4: Destacado (Tú)</span>
                    <p className="text-[11px] text-blue-700">3 tests y CV verificado</p>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700">850 XP</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">Nivel 5: Experto Elite</span>
                    <p className="text-[11px] text-slate-500">Recomendaciones y liderazgo</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">1.000+ XP</span>
                </div>
              </div>
            </div>

            {/* Comunidad de Acreditados */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    MR
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    LP
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    SG
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">+1.420 profesionales</h4>
                  <p className="text-[11px] text-slate-500">Acreditados y contratados este mes</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Empresas tecnológicas líderes auditan estas insignias para acelerar sus fases de cribado técnico.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
