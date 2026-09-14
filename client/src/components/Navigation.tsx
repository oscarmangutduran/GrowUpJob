import { Briefcase, Building2, BookOpen, User, Landmark, Award } from 'lucide-react';

export const navItems = [
  { icon: Briefcase, label: 'Empleo', shortLabel: 'Empleo' },
  { icon: Landmark, label: 'Público', shortLabel: 'Público' },
  { icon: BookOpen, label: 'Cursos', shortLabel: 'Cursos' },
  { icon: Building2, label: 'Empresas', shortLabel: 'Empresas' },
  { icon: User, label: 'Perfil', shortLabel: 'Perfil' },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, shortLabel }) => {
          const isActive = activeTab === label;
          return (
            <button
              key={label}
              onClick={() => onTabChange(label)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 active:scale-95'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-blue-600 rounded-full" />
              )}
              <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="text-[10px] tracking-tight">{shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


