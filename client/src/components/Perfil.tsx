import { useState, type ReactNode } from 'react';
import {
  Edit, Upload, Eye, MapPin, FileText, ChevronRight,
  Briefcase, GraduationCap, Globe, Github, Linkedin, Award, Plus,
  Video, CheckCircle2, Zap, Settings, Download, LogOut, Check
} from 'lucide-react';

interface PerfilProps {
  onLogout?: () => void;
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3.5 pb-2 border-b border-slate-100">
      <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
      {action ?? (
        <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── Candidatura tabs ───────────────────────────────────────────────────────
const CANDIDATURAS = {
  'En revisión': [
    {
      id: '1', badge: 'Entrevista', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
      title: 'Lead Full Stack Engineer', company: 'Frontend Inc. · Híbrido',
      detail: 'Jueves 16:00 – 17:15 CET (Google Meet con CTO)',
      detailIcon: <Video className="w-3.5 h-3.5 text-blue-600" />,
      cta: 'Ver sala de entrevista', ctaColor: 'text-blue-700 bg-blue-50 border border-blue-200/80 hover:bg-blue-100',
    },
    {
      id: '2', badge: 'Finalista', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      title: 'Senior React Developer', company: 'DevPulsar Tech · Remoto internacional',
      detail: 'Resultado de prueba técnica: 89/100 (Top 3)',
      detailIcon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      cta: 'Ver feedback técnico', ctaColor: 'text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100',
    },
    {
      id: '3', badge: 'En proceso', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      title: 'Platform Architect', company: 'NX Cloud Systems · Madrid',
      detail: 'Revisión curricular superada. Esperando asignación de fecha.',
      detailIcon: <Briefcase className="w-3.5 h-3.5 text-slate-500" />,
      cta: 'Consultar estado', ctaColor: 'text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200',
    },
  ],
  'Enviadas': [
    {
      id: '4', badge: 'Recibida', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      title: 'DevOps & SRE Lead', company: 'Banco Digital Santander · Remoto',
      detail: 'Candidatura enviada hace 2 días',
      detailIcon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />,
      cta: 'Ver candidatura', ctaColor: 'text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200',
    }
  ],
  'Entrevistas': [
    {
      id: '5', badge: 'Próxima', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
      title: 'Lead Full Stack Engineer', company: 'Frontend Inc.',
      detail: 'Jueves 16:00 CET',
      detailIcon: <Video className="w-3.5 h-3.5 text-blue-600" />,
      cta: 'Unirse al Meet', ctaColor: 'text-white bg-blue-600 hover:bg-blue-700',
    }
  ],
};

type CandidaturaTab = keyof typeof CANDIDATURAS;

function MiCandidatura() {
  const [tab, setTab] = useState<CandidaturaTab>('En revisión');
  const items = CANDIDATURAS[tab] || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Mis Candidaturas Activas</h2>
            <p className="text-xs text-slate-500">Seguimiento de procesos de selección abiertos</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-md">
            {items.length} activas
          </span>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          {(Object.keys(CANDIDATURAS) as CandidaturaTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all cursor-pointer ${
                tab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t} ({CANDIDATURAS[t].length})
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{item.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 my-2.5">
                {item.detailIcon}
                <span>{item.detail}</span>
              </div>
              <button className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${item.ctaColor}`}>
                {item.cta}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-400">
          No hay candidaturas en esta fase actualmente.
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Perfil({ onLogout }: PerfilProps) {
  const [notificaciones, setNotificaciones] = useState(true);
  const [visibilidad, setVisibilidad] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Summary, CV & Social Links */}
        <div className="lg:col-span-4 space-y-5">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold shrink-0 ring-4 ring-slate-100">
                EM
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-slate-900 leading-snug">Elena Morales</h1>
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Cloud Architect & Full Stack</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Madrid, España · Remoto global</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                En búsqueda activa
              </span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-600" />
                Visibilidad: Alta
              </span>
            </div>

            {/* Stats Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              {[
                { value: '8+ años', label: 'Experiencia' },
                { value: '94%', label: 'Match medio' },
                { value: '14', label: 'Consultas hoy' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                  <div className="text-sm font-bold text-slate-900">{s.value}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Vitae Widget */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Curriculum Vitae" action={
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/60">
                Indexado ATS
              </span>
            } />
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/70 rounded-lg p-3 mb-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-200/60 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">CV_Elena_Morales_2026.pdf</p>
                <p className="text-[10px] text-slate-400">1.2 MB · Actualizado hace 3 días</p>
              </div>
              <button title="Descargar" className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualizar</span>
              </button>
            </div>
          </div>

          {/* Links & Portfolio */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Redes & Portfolio" />
            <div className="space-y-1.5">
              {[
                { icon: <Github className="w-4 h-4" />, label: 'github.com/elenamorales-dev' },
                { icon: <Linkedin className="w-4 h-4" />, label: 'linkedin.com/in/elena-morales' },
                { icon: <Globe className="w-4 h-4" />, label: 'elenamorales.engineering' },
              ].map(l => (
                <a
                  key={l.label}
                  href="#"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-xs font-medium border border-transparent hover:border-slate-200"
                >
                  <span className="text-slate-500">{l.icon}</span>
                  <span className="flex-1 truncate">{l.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Idiomas Acreditados" />
            <div className="space-y-2">
              {[
                { flag: 'ES', lang: 'Español', level: 'Nativo / Competencia profesional bilingüe' },
                { flag: 'EN', lang: 'Inglés', level: 'Nivel C1 Acreditado (Cambridge Advanced)' },
              ].map(l => (
                <div key={l.lang} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="w-7 h-7 rounded bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {l.flag}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{l.lang}</p>
                    <p className="text-[11px] text-slate-500">{l.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión en este dispositivo</span>
          </button>
        </div>

        {/* Right Column: Applications, Experience, Education & Settings */}
        <div className="lg:col-span-8 space-y-5">
          {/* Applications Pipeline */}
          <MiCandidatura />

          {/* Work Experience */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Experiencia Laboral" />
            <div className="space-y-5">
              {[
                {
                  title: 'Staff Cloud & Infrastructure Engineer',
                  company: 'DICE Systems & Telecom',
                  period: '2022 – Actualidad · 3 años',
                  desc: 'Liderazgo técnico del equipo de arquitectura en la nube. Migración a microservicios distribuidos en AWS con reducción del 42% en latencia y 99.99% de SLA.',
                  tags: ['AWS', 'Kubernetes', 'Terraform', 'Golang'],
                  current: true,
                },
                {
                  title: 'Senior Full Stack Developer',
                  company: 'Fintech Solutions Madrid',
                  period: '2019 – 2022 · 3 años',
                  desc: 'Desarrollo de pasarela de pagos compatible con la directiva PSD2 bancaria europea. Arquitectura de frontend escalable en React, TypeScript y Node.js.',
                  tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
                  current: false,
                },
              ].map((exp, i) => (
                <div key={i} className={i > 0 ? 'pt-5 border-t border-slate-100' : ''}>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                      <p className="text-xs font-semibold text-slate-600">{exp.company}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{exp.period}</p>
                    </div>
                    {exp.current && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-md shrink-0">
                        Puesto Actual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.tags.map(tag => (
                      <span key={tag} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Educación & Certificaciones Oficiales" />
            <div className="space-y-4">
              {[
                {
                  icon: <Award className="w-4 h-4 text-blue-600" />,
                  title: 'AWS Certified Solutions Architect – Professional',
                  sub: 'Amazon Web Services · Certificación Oficial Vigente 2024–2027',
                  badge: 'Verificado',
                },
                {
                  icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
                  title: 'Grado en Ingeniería del Software',
                  sub: 'Universidad Politécnica de Madrid (UPM) · 2014 – 2018',
                },
              ].map((edu, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 rounded-lg bg-slate-50/70 border border-slate-200/60">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {edu.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{edu.title}</p>
                      {edu.badge && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded">
                          {edu.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{edu.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account & Notification Preferences */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <SectionHeader title="Preferencias de Privacidad & Alertas" action={<Settings className="w-4 h-4 text-slate-400" />} />
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-xs font-bold text-slate-800">Alertas de nuevas ofertas y convocatorias</p>
                  <p className="text-[11px] text-slate-500">Recibe notificaciones inmediatas por correo cuando surjan vacantes compatibles</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificaciones(!notificaciones)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${notificaciones ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notificaciones ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-xs font-bold text-slate-800">Visibilidad ante empresas y reclutadores</p>
                  <p className="text-[11px] text-slate-500">Permite que empresas verificadas encuentren tu perfil para ofertas directas</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVisibilidad(!visibilidad)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${visibilidad ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${visibilidad ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

