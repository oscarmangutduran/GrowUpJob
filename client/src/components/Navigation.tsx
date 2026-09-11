import { Briefcase, Building2, BookOpen, Award, User, LandmarkIcon } from 'lucide-react';

const navItems = [
  { icon: Briefcase, label: 'Empleo' },
  { icon: LandmarkIcon, label: 'Público' },
  { icon: BookOpen, label: 'Cursos' },
  { icon: Building2, label: 'Empresas' },
  { icon: Award, label: 'Insignias' },
  { icon: User, label: 'Perfil' },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-40">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label }) => {
          const isActive = activeTab === label;
          return (
            <button
              key={label}
              onClick={() => onTabChange(label)}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-0.5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

