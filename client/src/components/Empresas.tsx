import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Star, ChevronRight, Bookmark, Award, Leaf, Cpu, HeartPulse,
  Banknote, MessageSquare, X, Clock, Trophy, Globe,
  Users, BookOpen, Heart, TrendingUp, CheckCircle2, ArrowUpRight, Building2,
  Plus, Loader2, Send, Zap, ShieldCheck, HelpCircle, Check, Sparkles, Filter
} from 'lucide-react';
import { getCompanies, submitCompanyReview } from '../services/api';

// ── Insignia Types & Definitions ───────────────────────────────────────────
export interface Insignia {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  category: 'candidatura' | 'valoracion';
  categoryLabel: string;
  color: string;
  description: string;
}

export const ALL_INSIGNIAS: Insignia[] = [
  // 1. Insignias por Respuesta a Candidaturas
  {
    id: 'respuesta_rapida',
    icon: Zap,
    label: 'Respuesta Rápida (<24h)',
    category: 'candidatura',
    categoryLabel: 'Respuesta a Candidaturas',
    color: 'bg-amber-50 text-amber-800 border-amber-300/80',
    description: 'Responde o da feedback a las candidaturas en menos de 24 horas laborables.',
  },
  {
    id: 'cero_ghosting',
    icon: ShieldCheck,
    label: '0% Ghosting Garantizado',
    category: 'candidatura',
    categoryLabel: 'Respuesta a Candidaturas',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
    description: '100% de los postulantes reciben notificación formal sobre el estado de su proceso.',
  },
  {
    id: 'feedback_garantizado',
    icon: MessageSquare,
    label: 'Feedback Constructivo',
    category: 'candidatura',
    categoryLabel: 'Respuesta a Candidaturas',
    color: 'bg-blue-50 text-blue-700 border-blue-300/80',
    description: 'Ofrece retroalimentación técnica y personalizada tras cada entrevista.',
  },
  {
    id: 'proceso_agil',
    icon: Clock,
    label: 'Proceso Ágil (<14 días)',
    category: 'candidatura',
    categoryLabel: 'Respuesta a Candidaturas',
    color: 'bg-purple-50 text-purple-700 border-purple-300/80',
    description: 'Proceso de selección completo resuelto en un máximo de dos semanas.',
  },

  // 2. Insignias por Valoración de Candidatos (Entrevistas y Oferta)
  {
    id: 'entrevistas_top',
    icon: Star,
    label: 'Entrevistas Top (4.8★)',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-amber-50 text-amber-900 border-amber-300/90',
    description: 'Puntuación sobresaliente otorgada por los candidatos que realizaron entrevistas.',
  },
  {
    id: 'transparencia_salarial',
    icon: Banknote,
    label: 'Transparencia Salarial',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
    description: 'Rango salarial y condiciones explicados con total claridad desde el primer contacto.',
  },
  {
    id: 'remoto',
    icon: Globe,
    label: '100% Remoto Real',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-sky-50 text-sky-700 border-sky-300/80',
    description: 'Teletrabajo verificado por los candidatos sin presencialismo encubierto.',
  },
  {
    id: 'salario',
    icon: TrendingUp,
    label: 'Salario Competitivo',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-violet-50 text-violet-700 border-violet-300/80',
    description: 'Retribución en el percentil superior del sector certificada por candidatos contratados.',
  },
  {
    id: 'flexible',
    icon: HeartPulse,
    label: 'Horario Flexible',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-300/80',
    description: 'Flexibilidad horaria real y conciliación respetada durante el proceso y empleo.',
  },
  {
    id: 'liderazgo',
    icon: Trophy,
    label: 'Liderazgo Empático',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-pink-50 text-pink-700 border-pink-300/80',
    description: 'Entrevistadores técnicos reconocidos por su empatía, escucha activa y rigor.',
  },
  {
    id: 'ambiente',
    icon: Heart,
    label: 'Excelente Clima',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-rose-50 text-rose-700 border-rose-300/80',
    description: 'Cultura de equipo cordial y colaborativa destacada por los postulantes.',
  },
  {
    id: 'sostenible',
    icon: Leaf,
    label: 'Impacto Sostenible',
    category: 'valoracion',
    categoryLabel: 'Valoración de Candidatos',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
    description: 'Compromiso medioambiental y reducción verificada de huella ecológica.',
  },
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
  topCultura?: { rank: number; quote: string } | null;
  insigniasObtenidas: string[];
  metricasCandidaturas?: {
    tiempoRespuesta?: string;
    tasaRespuesta?: string;
    ghostingRate?: string;
    satisfaccionEntrevistas?: string;
  };
  reseñas: Reseña[];
}

// ── Mock Initial Data ──────────────────────────────────────────────────────
const EMPRESAS: Empresa[] = [
  {
    id: '1',
    name: 'NexTech Solutions',
    sector: 'Cloud Engineering & DevOps',
    size: '250–500 empleados',
    rating: 4.8,
    ratingCount: 312,
    vacantes: 14,
    descripcion: 'Autonomía de equipos, respuesta garantizada en menos de 24 horas y presupuesto anual individual para certificaciones.',
    logoColor: 'bg-blue-600 text-white',
    logoIcon: 'tech',
    filterTag: 'Tecnología',
    topCultura: { rank: 1, quote: 'Respuesta récord en candidaturas y proceso de entrevista técnica impecable...' },
    insigniasObtenidas: ['respuesta_rapida', 'cero_ghosting', 'feedback_garantizado', 'entrevistas_top', 'ambiente', 'flexible'],
    metricasCandidaturas: {
      tiempoRespuesta: '< 24 horas',
      tasaRespuesta: '99%',
      ghostingRate: '0%',
      satisfaccionEntrevistas: '4.8 / 5.0',
    },
    reseñas: [
      { id: 'r1', autor: 'Miguel R.', cargo: 'Senior DevOps (Candidato contratado)', texto: 'Me respondieron a la candidatura en 12 horas con feedback claro. La entrevista técnica fue rigurosa pero muy respetuosa.', rating: 5, fecha: 'Hace 2 días', insigniasVotadas: ['respuesta_rapida', 'cero_ghosting', 'feedback_garantizado'] },
      { id: 'r2', autor: 'Sara L.', cargo: 'Cloud Architect', texto: 'Proceso de selección transparente. Te explican el rango salarial exacto desde la primera llamada.', rating: 5, fecha: 'Hace 1 semana', insigniasVotadas: ['flexible', 'entrevistas_top', 'feedback_garantizado'] },
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
    descripcion: 'Cultura orientada a sostenibilidad y conciliación real. 100% remoto con reuniones asíncronas y respeto absoluto al tiempo de los postulantes.',
    logoColor: 'bg-emerald-600 text-white',
    logoIcon: 'green',
    filterTag: 'Tecnología',
    topCultura: { rank: 2, quote: 'Jornada intensiva y comunicación constante durante todo el proceso de selección...' },
    insigniasObtenidas: ['cero_ghosting', 'transparencia_salarial', 'remoto', 'conciliacion', 'sostenible'],
    metricasCandidaturas: {
      tiempoRespuesta: '< 48 horas',
      tasaRespuesta: '98%',
      ghostingRate: '0%',
      satisfaccionEntrevistas: '4.6 / 5.0',
    },
    reseñas: [
      { id: 'r3', autor: 'Ana P.', cargo: 'Data Engineer (Entrevistada)', texto: 'Empresa con propósito real. Te explican el rango salarial desde el minuto 1 y te mantienen al tanto del proceso en cada fase.', rating: 5, fecha: 'Hace 3 días', insigniasVotadas: ['cero_ghosting', 'transparencia_salarial', 'sostenible'] },
      { id: 'r4', autor: 'Carlos M.', cargo: 'Backend Dev', texto: 'Remoto 100% verificado, sin sorpresas ni presencialismo encubierto tras firmar la oferta.', rating: 4, fecha: 'Hace 2 semanas', insigniasVotadas: ['remoto', 'conciliacion'] },
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
    descripcion: 'Salarios certificados en el Top 10% del mercado bancario europeo con plan de equity y resolución ágil de procesos de contratación.',
    logoColor: 'bg-slate-900 text-white',
    logoIcon: 'fintech',
    filterTag: 'Fintech',
    insigniasObtenidas: ['respuesta_rapida', 'transparencia_salarial', 'salario', 'equity', 'liderazgo'],
    metricasCandidaturas: {
      tiempoRespuesta: '< 24 horas',
      tasaRespuesta: '97%',
      ghostingRate: '0%',
      satisfaccionEntrevistas: '4.5 / 5.0',
    },
    reseñas: [
      { id: 'r5', autor: 'Javier T.', cargo: 'Product Manager (Candidato)', texto: 'Los salarios son los mejores del sector. Proceso de selección rápido y profesional sin pruebas interminables.', rating: 5, fecha: 'Hace 5 días', insigniasVotadas: ['respuesta_rapida', 'transparencia_salarial', 'salario'] },
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
    descripcion: 'I+D biomédico con laboratorios de última generación y proceso de selección ágil completado en menos de 14 días.',
    logoColor: 'bg-indigo-600 text-white',
    logoIcon: 'pharma',
    filterTag: 'Salud',
    insigniasObtenidas: ['feedback_garantizado', 'proceso_agil', 'conciliacion', 'ambiente'],
    metricasCandidaturas: {
      tiempoRespuesta: '< 48 horas',
      tasaRespuesta: '95%',
      ghostingRate: '0%',
      satisfaccionEntrevistas: '4.4 / 5.0',
    },
    reseñas: [
      { id: 'r6', autor: 'Dra. Laura G.', cargo: 'Investigadora Principal', texto: 'Instalaciones científicas de primer nivel. Recibí feedback detallado tras la prueba técnica antes de la entrevista final.', rating: 4, fecha: 'Hace 1 mes', insigniasVotadas: ['feedback_garantizado', 'proceso_agil'] },
    ],
  },
];

const FILTER_BADGES = [
  { id: 'todas', label: 'Todas las empresas' },
  { id: 'respuesta_rapida', label: '⚡ Respuesta <24h' },
  { id: 'cero_ghosting', label: '🛡️ 0% Ghosting' },
  { id: 'feedback_garantizado', label: '💬 Feedback Garantizado' },
  { id: 'entrevistas_top', label: '⭐ Entrevistas Top' },
  { id: 'transparencia_salarial', label: '💰 Transparencia Salarial' },
  { id: 'remoto', label: '🌍 100% Remoto' },
];

function CompanyLogo({ type, colorClass }: { type: Empresa['logoIcon']; colorClass: string }) {
  const icons = { tech: Cpu, green: Leaf, fintech: Banknote, pharma: HeartPulse };
  const Icon = icons[type] || Cpu;
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

  const responseBadges = insignias.filter(i => i.category === 'candidatura');
  const candidateBadges = insignias.filter(i => i.category === 'valoracion');

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Top Header */}
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

        {/* Candidacy Audit Metrics Bar */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 mb-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-800 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{e.metricasCandidaturas?.tiempoRespuesta || '< 24h'}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Respuesta media</span>
          </div>
          <div className="border-x border-slate-200/60 px-1">
            <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{e.metricasCandidaturas?.ghostingRate || '0%'}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Tasa ghosting</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-800 font-bold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{e.rating}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">En entrevistas</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {e.descripcion}
        </p>

        {/* Candidacy Response Badges */}
        {responseBadges.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Trato a Candidaturas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {responseBadges.map(ins => {
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
        )}

        {/* Candidate-Voted Culture Badges */}
        {candidateBadges.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Valoración de Candidatos
            </span>
            <div className="flex flex-wrap gap-1.5">
              {candidateBadges.map(ins => {
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
        )}

      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={onShowReseñas}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>{e.reseñas.length} valoraciones de candidatos</span>
        </button>

        <button
          onClick={onShowReseñas}
          className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
        >
          <span>Ver insignias & opiniones</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Modal de Reseñas e Insignias de Candidato ──────────────────────────────
interface ReseñaModalProps {
  empresa: Empresa;
  onClose: () => void;
  onAddReview: (empresaId: string, review: { autor: string; cargo: string; texto: string; rating: number; insignias_votadas: string[] }) => Promise<void>;
}

function ReseñaModal({ empresa, onClose, onAddReview }: ReseñaModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [autor, setAutor] = useState('');
  const [cargo, setCargo] = useState('');
  const [texto, setTexto] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['respuesta_rapida', 'cero_ghosting']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleBadgeSelection = (id: string) => {
    setSelectedBadges(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor || !texto) return;
    try {
      setIsSubmitting(true);
      await onAddReview(empresa.id, {
        autor,
        cargo: cargo || 'Candidato verificado',
        texto,
        rating,
        insignias_votadas: selectedBadges,
      });
      setShowForm(false);
      setAutor('');
      setCargo('');
      setTexto('');
    } catch (err) {
      console.error('Error enviando reseña:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const earnedInsignias = ALL_INSIGNIAS.filter(ins => empresa.insigniasObtenidas.includes(ins.id));

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CompanyLogo type={empresa.logoIcon} colorClass={empresa.logoColor} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{empresa.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {empresa.rating}
                </span>
                <span>· {empresa.ratingCount} valoraciones de procesos de selección</span>
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

        {/* Insignias Obtenidas por Candidaturas */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Insignias acreditadas por candidatos ({earnedInsignias.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {earnedInsignias.map(ins => {
              const Icon = ins.icon;
              return (
                <div key={ins.id} className={`p-2 rounded-lg border flex items-start gap-2 ${ins.color}`}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">{ins.label}</span>
                    <span className="text-[10px] leading-tight opacity-90 block">{ins.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Existing candidate reviews */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Opiniones de entrevistas & candidaturas
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showForm ? 'Cancelar' : 'Valorar como candidato'}</span>
            </button>
          </div>

          {/* New Review Form with Badge Voting */}
          {showForm && (
            <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Evaluar proceso de selección y otorgar insignias</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tu nombre o alias"
                  value={autor}
                  onChange={e => setAutor(e.target.value)}
                  required
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Cargo postulado (ej. Frontend Dev)"
                  value={cargo}
                  onChange={e => setCargo(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <textarea
                placeholder="¿Cómo fue la experiencia? ¿Respondieron a tiempo? ¿Hubo feedback y respeto en las entrevistas?"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                required
                rows={2}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />

              {/* Vote for badges */}
              <div>
                <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                  Vota las insignias que merece esta empresa por su proceso:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_INSIGNIAS.map(ins => {
                    const isSelected = selectedBadges.includes(ins.id);
                    return (
                      <button
                        type="button"
                        key={ins.id}
                        onClick={() => toggleBadgeSelection(ins.id)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                        <span>{ins.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-600">Puntuación:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Enviar valoración e insignias</span>
                </button>
              </div>
            </form>
          )}

          {/* Review items */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto">
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

                {/* Badges voted by this candidate */}
                {r.insigniasVotadas && r.insigniasVotadas.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {r.insigniasVotadas.map(bId => {
                      const badge = ALL_INSIGNIAS.find(ins => ins.id === bId);
                      if (!badge) return null;
                      return (
                        <span key={bId} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          ✓ {badge.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
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
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState('todas');
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCompanies()
      .then(res => {
        if (isMounted && res.empresas && res.empresas.length > 0) {
          setEmpresas(res.empresas);
        }
      })
      .catch(err => {
        console.warn('Backend API /companies fallback:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleAddReview = async (empresaId: string, reviewData: { autor: string; cargo: string; texto: string; rating: number; insignias_votadas: string[] }) => {
    try {
      const res = await submitCompanyReview(empresaId, reviewData);
      if (res.reseña) {
        setEmpresas(prev => prev.map(emp => {
          if (emp.id === empresaId) {
            const updatedReviews = [res.reseña, ...emp.reseñas];
            const updatedBadges = Array.from(new Set([...emp.insigniasObtenidas, ...(reviewData.insignias_votadas || [])]));
            return {
              ...emp,
              reseñas: updatedReviews,
              insigniasObtenidas: updatedBadges,
              ratingCount: emp.ratingCount + 1,
            };
          }
          return emp;
        }));

        if (selectedEmpresa && selectedEmpresa.id === empresaId) {
          setSelectedEmpresa(prev => prev ? {
            ...prev,
            reseñas: [res.reseña, ...prev.reseñas],
            insigniasObtenidas: Array.from(new Set([...prev.insigniasObtenidas, ...(reviewData.insignias_votadas || [])])),
            ratingCount: prev.ratingCount + 1,
          } : null);
        }
      }
    } catch (err) {
      console.error('Error submitting review to backend:', err);
    }
  };

  const filtered = useMemo(() => {
    return empresas.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q) || e.descripcion.toLowerCase().includes(q);
      const matchBadge =
        selectedBadgeFilter === 'todas' ||
        e.insigniasObtenidas.includes(selectedBadgeFilter);
      return matchSearch && matchBadge;
    });
  }, [empresas, searchQuery, selectedBadgeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              Acreditación de Empleadores & Trato a Candidatos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Insignias y Cultura Verificada por Candidatos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Insignias basadas en la respuesta real a candidaturas (tiempo <span className="font-bold text-slate-700">&lt; 24h</span>, ausencia de ghosting y feedback garantizado) y valoraciones de procesos de selección.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-slate-900">{empresas.length}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Empresas TOP</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center">
            <div className="text-lg font-black text-emerald-600">0%</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Ghosting Auditado</div>
          </div>
        </div>
      </div>

      {/* Explanatory Info Card on Candidacy Insignias */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Compromiso con el Candidato
            </span>
            <span className="text-xs text-slate-400">Auditoría continua de procesos</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold">¿Cómo obtienen las empresas sus insignias?</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Las insignias no se compran: se conceden automáticamente según las <strong>métricas reales de respuesta a postulaciones</strong> (tiempo medio y tasa de resolución) y los <strong>votos de los candidatos</strong> que completan entrevistas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-3 text-center min-w-[110px]">
            <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-xs font-bold block text-white">&lt; 24 Horas</span>
            <span className="text-[10px] text-slate-400">Respuesta media</span>
          </div>
          <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-3 text-center min-w-[110px]">
            <MessageSquare className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-xs font-bold block text-white">Feedback</span>
            <span className="text-[10px] text-slate-400">Siempre garantizado</span>
          </div>
        </div>
      </div>

      {/* Search and Insignia Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar empresa por nombre, sector o insignia..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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

        {/* Filter by Badge Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtrar por insignia:
          </span>
          {FILTER_BADGES.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBadgeFilter(b.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedBadgeFilter === b.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {isLoading ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Cargando empresas e insignias desde la base de datos...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(e => (
            <EmpresaCard key={e.id} e={e} onShowReseñas={() => setSelectedEmpresa(e)} />
          ))
        ) : (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Sin empresas con esa insignia</h3>
            <p className="text-xs text-slate-500">Prueba seleccionando otra insignia o borra el texto de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEmpresa && (
        <ReseñaModal 
          empresa={selectedEmpresa} 
          onClose={() => setSelectedEmpresa(null)} 
          onAddReview={handleAddReview}
        />
      )}
    </div>
  );
}
