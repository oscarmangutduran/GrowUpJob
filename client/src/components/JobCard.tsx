import { useState } from 'react';
import { MapPin, Clock, Bookmark, CheckCircle2, ArrowUpRight, Banknote, Laptop, Building2 } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  key?: any;
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const getModalityIcon = (modality: string) => {
    if (modality.includes('Remoto')) return <Laptop className="w-3.5 h-3.5 text-slate-500" />;
    return <Building2 className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 p-5 hover:border-slate-300 hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06)] transition-all duration-200 cursor-pointer relative flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3.5">
            {/* Company Avatar / Monogram */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border border-black/5 shadow-xs ${job.logoColor}`}>
              {job.logoInitial ?? job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-700">{job.company}</span>
                {job.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    Verificada
                  </span>
                )}
                {job.badge && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {job.badge}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            aria-label={isSaved ? "Guardado" : "Guardar oferta"}
            className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isSaved
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Metadata Details Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50/90 px-2.5 py-1 rounded-md border border-emerald-200/60">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>{job.salary}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center gap-1">
            {getModalityIcon(job.modality)}
            <span>{job.modality}</span>
          </div>

          <div className="text-slate-400 hidden sm:inline">·</div>
          <span className="text-slate-500">{job.jornada}</span>
        </div>

        {/* Skills & Tech Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200/60 hover:bg-slate-200/70 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Apply action */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Publicado {job.postedAt}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setApplied(true);
          }}
          disabled={applied}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
            applied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : job.fastApply
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow'
              : 'border border-slate-300 hover:bg-slate-50 text-slate-800'
          }`}
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inscrito</span>
            </>
          ) : job.fastApply ? (
            <>
              <span>Inscripción Directa</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Ver Candidatura</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </article>
  );
}


