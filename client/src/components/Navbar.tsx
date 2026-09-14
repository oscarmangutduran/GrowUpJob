import { Bell, CheckCircle2 } from 'lucide-react';
import { Logo, BrandText } from './Logo';
import { navItems } from './Navigation';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export default function Navbar({
  activeTab,
  onTabChange,
  userName = "Elena Morales",
  userRole = "Cloud Architect",
  userInitials = "EM",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onTabChange('Empleo')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
              <BrandText className="text-lg" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ icon: Icon, label }) => {
                const isActive = activeTab === label;
                return (
                  <button
                    key={label}
                    onClick={() => onTabChange(label)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={isActive ? 2.25 : 1.75} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <button
              onClick={() => onTabChange('Perfil')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 rounded-lg hover:bg-emerald-100/70 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Perfil Verificado</span>
            </button>

            {/* Notification Bell */}
            <button
              title="Notificaciones"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* User Profile Chip */}
            <button
              onClick={() => onTabChange('Perfil')}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-colors group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100 group-hover:bg-blue-600 transition-colors">
                {userInitials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600">
                  {userName}
                </span>
                <span className="text-[10px] text-slate-500 leading-none">
                  {userRole}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
