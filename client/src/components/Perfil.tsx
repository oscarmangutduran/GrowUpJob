import { useState } from 'react';
import {
  Search, Bell, Edit, Upload, Eye, MapPin, Star, FileText, ChevronRight,
  Briefcase, GraduationCap, Globe, Github, Linkedin, Award, Plus,
  Video, Clock, CheckCircle, Zap, Settings, Moon, ToggleRight, ExternalLink, Download
} from 'lucide-react';

// ── Sub-sections ───────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      {action ?? <button className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><Plus className="w-4 h-4 text-gray-500" /></button>}
    </div>
  );
}

// ── Candidatura tabs ───────────────────────────────────────────────────────
const CANDIDATURAS = {
  'En revisión': [
    {
      id: '1', badge: 'Entrevista', badgeColor: 'bg-blue-100 text-blue-700',
      title: 'Lead Full Stack', company: 'Frontend Inc.',
      detail: 'Jueves, 16:00 – 17:15 CST (Google Meet)',
      detailIcon: <Video className="w-3 h-3" />,
      cta: 'Ver detalles', ctaColor: 'text-blue-600 border border-blue-200 hover:bg-blue-50',
    },
    {
      id: '2', badge: 'Finalista', badgeColor: 'bg-purple-100 text-purple-700',
      title: 'Senior React Dev', company: 'DevPulsar Tech · Remoto (0–40)',
      detail: 'Resultado: 89% Match',
      detailIcon: <Star className="w-3 h-3 text-amber-400" />,
      cta: 'Ver detalles', ctaColor: 'text-purple-600 border border-purple-200 hover:bg-purple-50',
    },
    {
      id: '3', badge: 'Invitación', badgeColor: 'bg-green-100 text-green-700',
      title: 'Platform Architect', company: 'NX Cloud Systems',
      detail: 'Feedback constructivo disponible. Tienes completa disposición de la presentación...',
      detailIcon: <CheckCircle className="w-3 h-3 text-green-500" />,
      cta: 'Ver detalles', ctaColor: 'text-green-600 border border-green-200 hover:bg-green-50',
    },
  ],
  'Enviadas': [],
  'Entrevistas': [],
};

type CandidaturaTab = keyof typeof CANDIDATURAS;

function MiCandidatura() {
  const [tab, setTab] = useState<CandidaturaTab>('En revisión');
  const items = CANDIDATURAS[tab];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-800">Mi Candidatura</h2>
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">En proceso</span>
        </div>
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-0.5 mb-3">
          {(Object.keys(CANDIDATURAS) as CandidaturaTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-[10px] font-semibold py-1.5 rounded-lg transition-all ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {items.map(item => (
            <div key={item.id} className="px-4 py-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                {item.detailIcon}
                <span>{item.detail}</span>
              </div>
              <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${item.ctaColor}`}>
                {item.cta}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 pb-4 text-center text-xs text-gray-400 py-6">No hay candidaturas en esta etapa</div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Perfil() {
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="px-4 pt-10 pb-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-bold text-gray-800">Perfil</h1>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 relative hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-4 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative">
            <button className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              <Edit className="w-3.5 h-3.5" /> Editar
            </button>

            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                EM
              </div>
              <div className="flex-1 min-w-0 pr-10">
                <h2 className="text-base font-extrabold text-gray-900 leading-tight">Elena Morales García</h2>
                <p className="text-xs font-semibold text-gray-600 mt-0.5">Full Stack Engineer & Cloud Architect</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>Madrid, España · Disponible para remoto</span>
                </div>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Pre-seleccionada Activa
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Visibilidad directa: +34%
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '8+', label: 'Años exp.' },
                { value: '94%', label: 'Match global' },
                { value: '14', label: 'Ofertas HOY' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-2 text-center">
                  <div className="text-sm font-extrabold text-gray-900">{s.value}</div>
                  <div className="text-[9px] text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Vitae */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" /> Curriculum Vitae
              </h2>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Subiendo ATS</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-3">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">CV_Elena_Morales_2025.pdf</p>
                <p className="text-[10px] text-gray-400">1.1 MB · PDF</p>
              </div>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Reemplazar PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Previsualizar
              </button>
            </div>
          </div>

          {/* Mi Candidatura */}
          <MiCandidatura />

          {/* Experiencia Laboral */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader title="Experiencia Laboral" />
            <div className="space-y-4">
              {[
                {
                  title: 'Staff Cloud Engineer',
                  company: 'DICE · Actualidad',
                  org: 'Iberia Digital Solutions',
                  desc: 'Liderazgo de equipo de arquitectura. Implementó microservicios en AWS con un 54% de mejora en el rendimiento bajo alta carga (2M y visible APls activos).',
                  tags: ['AWS', 'Terraform', 'Kotlin'],
                  current: true,
                },
                {
                  title: 'Full Stack Developer',
                  company: 'Sofia Fintech Labs · Remoto',
                  period: '2019 – 2022',
                  desc: 'Contribuyó al núcleo de micro-frontend formando en React/TypeScript y vectores de seguridad de pagos hasta completamente alineados con la normativa PSD2.',
                  tags: ['React', 'TypeScript', 'PSD2'],
                  current: false,
                },
              ].map((exp, i) => (
                <div key={i} className={i > 0 ? 'pt-4 border-t border-gray-50' : ''}>
                  <div className="flex items-start gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-[10px] text-gray-500">{exp.company}</p>
                          {exp.org && <p className="text-[10px] text-gray-400">{exp.org}</p>}
                        </div>
                        {exp.current && <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex-shrink-0">Activo</span>}
                        {exp.period && <span className="text-[9px] text-gray-400">{exp.period}</span>}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{exp.desc}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.tags.map(t => <span key={t} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-medium">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educación & Certificaciones */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader title="Educación & Certificaciones" />
            <div className="space-y-3">
              {[
                {
                  icon: <Award className="w-4 h-4 text-amber-600" />,
                  iconBg: 'bg-amber-100',
                  title: 'AWS Certified Solutions Architect...',
                  sub: 'Vigente 2025 · $1 AWS-523231',
                  badge: 'Vigente', badgeColor: 'bg-green-100 text-green-700',
                },
                {
                  icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
                  iconBg: 'bg-blue-100',
                  title: 'Grado en Ingeniería del Software',
                  sub: 'Universidad Politécnica de Madrid · 2014 – 2018',
                },
              ].map((edu, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${edu.iconBg}`}>{edu.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-gray-800 truncate">{edu.title}</p>
                      {edu.badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${edu.badgeColor}`}>{edu.badge}</span>}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{edu.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader title="Idiomas" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { flag: '🇪🇸', lang: 'Español', level: 'Nativo / Bilingüe', color: 'bg-red-50 border-red-100' },
                { flag: '🇬🇧', lang: 'Inglés', level: 'Certificado C1 · Cambridge', color: 'bg-blue-50 border-blue-100' },
              ].map(l => (
                <div key={l.lang} className={`flex items-center gap-2 p-3 rounded-xl border ${l.color}`}>
                  <span className="text-xl">{l.flag}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{l.lang}</p>
                    <p className="text-[9px] text-gray-500">{l.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enlaces & Portfolio */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader title="Enlaces & Portfolio" />
            <div className="space-y-2">
              {[
                { icon: <Github className="w-4 h-4" />, label: 'github.com/elenamorales-dev', color: 'text-gray-700' },
                { icon: <Linkedin className="w-4 h-4" />, label: 'linkedin.com/elena-morales-dev', color: 'text-blue-600' },
                { icon: <Globe className="w-4 h-4" />, label: 'elenamorales/engineering', color: 'text-purple-600' },
              ].map(l => (
                <button key={l.label} className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <span className={l.color}>{l.icon}</span>
                  <span className="text-xs text-gray-700 flex-1 truncate">{l.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Preferencias & Configuración */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader title="Preferencias & Configuración" action={<Settings className="w-4 h-4 text-gray-400" />} />
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 py-3 px-1 border-b border-gray-50 hover:bg-gray-50 rounded-xl transition-colors">
                <Moon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-800">Tema de Interfaz</p>
                  <p className="text-[10px] text-gray-400">Hipnótico oscuro</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </button>

              <div className="flex items-center gap-3 py-3 px-1 border-b border-gray-50">
                <Bell className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-800">Notificaciones y alertas</p>
                  <p className="text-[10px] text-gray-400">Históricamente cool y real</p>
                </div>
                <button
                  onClick={() => setNotificaciones(!notificaciones)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notificaciones ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notificaciones ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <button className="w-full flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors">
                <Eye className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-800">Visibilidad ante reclutadores</p>
                  <p className="text-[10px] text-gray-400">Perfil visible para empresas</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
