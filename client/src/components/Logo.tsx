export function Logo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Target Arc - Green */}
      <path d="M 55 15 A 30 30 0 0 1 85 45" stroke="#1F9B5E" strokeWidth="10" strokeLinecap="round" />
      {/* Target Center - Green */}
      <circle cx="65" cy="35" r="8" fill="#1F9B5E" />
      
      {/* Arrow Shaft - Blue */}
      <path d="M 20 80 L 65 35" stroke="#334195" strokeWidth="10" strokeLinecap="round" />
      
      {/* Abstract Wings/Bow - Blue */}
      <path d="M 20 40 L 50 40 L 35 55" stroke="#334195" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 60 80 L 60 50 L 45 65" stroke="#334195" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandText({ className = "text-4xl" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-[#334195]">Nex</span>
      <span className="text-[#1F9B5E]">Job</span>
    </span>
  );
}
