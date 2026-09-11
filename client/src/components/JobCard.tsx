import { MapPin, Clock, Bookmark, BadgeCheck, Zap, Briefcase } from 'lucide-react';
import { Job } from '../types';

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${job.logoColor}`}>
            {job.logoInitial ?? job.company.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-700">{job.company}</span>
              {job.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              {job.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  {job.badge}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 leading-tight text-base">{job.title}</h3>
          </div>
        </div>
        <button className="text-gray-300 hover:text-blue-500 transition-colors flex-shrink-0 mt-1">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-sm">
        <span className="font-bold text-green-600">💰 {job.salary}</span>
        <span className="flex items-center gap-1 text-gray-500">
          <MapPin className="w-3.5 h-3.5" />{job.location}
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Briefcase className="w-3.5 h-3.5" />{job.jornada}
        </span>
      </div>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          {job.postedAt}
        </div>
        {job.fastApply ? (
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-200">
            <Zap className="w-3.5 h-3.5" />
            Inscribirme rápido
          </button>
        ) : (
          <button className="text-blue-600 hover:bg-blue-50 border border-blue-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
            Inscribirme
          </button>
        )}
      </div>
    </div>
  );
}

