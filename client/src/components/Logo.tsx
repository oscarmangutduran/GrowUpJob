export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background shape */}
      <rect width="40" height="40" rx="10" fill="#1E293B" />
      {/* Growth bars */}
      <rect x="9" y="23" width="5" height="9" rx="2.5" fill="#64748B" />
      <rect x="17.5" y="16" width="5" height="16" rx="2.5" fill="#3B82F6" />
      <rect x="26" y="9" width="5" height="23" rx="2.5" fill="#10B981" />
      {/* Dynamic trajectory dot */}
      <circle cx="28.5" cy="6" r="2" fill="#34D399" />
    </svg>
  );
}

export function BrandText({ className = "text-xl", darkMode = false }: { className?: string; darkMode?: boolean }) {
  return (
    <div className={`flex flex-col justify-center select-none ${className}`}>
      <div className="font-extrabold tracking-tight leading-none flex items-center gap-0.5">
        <span className={darkMode ? "text-white" : "text-slate-900"}>Grow</span>
        <span className="text-blue-600">Up</span>
        <span className="text-emerald-600 ml-0.5">Job</span>
        <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
          Pro
        </span>
      </div>
      <span className={`text-[9px] tracking-[0.16em] font-semibold mt-1 uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        Empleo & Carrera Profesional
      </span>
    </div>
  );
}

