export function Logo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bar 1 */}
      <rect x="5" y="55" width="20" height="25" rx="6" fill="#E0E7FF" />
      <rect x="10" y="62" width="10" height="11" rx="3" fill="#2563EB" />
      
      {/* Bar 2 */}
      <rect x="30" y="35" width="20" height="45" rx="6" fill="#DBEAFE" />
      <rect x="35" y="42" width="10" height="31" rx="4" fill="#2563EB" />
      
      {/* Bar 3 */}
      <rect x="55" y="20" width="20" height="60" rx="4" fill="#2563EB" />
      
      {/* Arrow */}
      <path d="M 45 40 L 75 15" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
      <polygon points="65,15 80,10 75,25" fill="#10B981" />
      <circle cx="80" cy="10" r="4" fill="#10B981" />
    </svg>
  );
}

export function BrandText({ className = "text-4xl" }: { className?: string }) {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="font-extrabold tracking-tight leading-none">
        <span className="text-[#0F172A]">Grow </span>
        <span className="text-[#3B82F6]">Up </span>
        <span className="text-[#10B981]">Job</span>
      </div>
      <span className="text-[0.25em] tracking-[0.2em] text-gray-500 font-bold mt-1">EMPLEO & CARRERA PROFESIONAL</span>
    </div>
  );
}
