import { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Check, 
  Trash2, 
  Building2, 
  Calendar, 
  Award, 
  Briefcase, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Logo, BrandText } from './Logo';
import { navItems } from './Navigation';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'interview' | 'company' | 'badge' | 'job';
  actionTab?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'DevPulse Tech revisó tu perfil',
    description: 'El reclutador técnico consultó tu experiencia y validación Cloud.',
    time: 'Hace 25 min',
    read: false,
    type: 'company',
    actionTab: 'Perfil',
  },
  {
    id: 'n2',
    title: 'Entrevista confirmada: Frontend Inc.',
    description: 'Fase técnica agendada para este Jueves a las 16:00 (Google Meet).',
    time: 'Hace 2 h',
    read: false,
    type: 'interview',
    actionTab: 'Perfil',
  },
  {
    id: 'n3',
    title: 'Nueva prueba técnica disponible',
    description: 'Evalúa tus conocimientos en OWASP para ascender a Nivel 5.',
    time: 'Ayer',
    read: true,
    type: 'badge',
    actionTab: 'Insignias',
  },
  {
    id: 'n4',
    title: '4 nuevas vacantes en Cloud & DevOps',
    description: 'Empresas con salario verificado (+50k€) buscan perfiles como el tuyo.',
    time: 'Hace 2 días',
    read: true,
    type: 'job',
    actionTab: 'Empleo',
  },
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (n: NotificationItem) => {
    setNotifications(prev => 
      prev.map(item => item.id === n.id ? { ...item, read: true } : item)
    );
    if (n.actionTab) {
      onTabChange(n.actionTab);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'company':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'badge':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
    }
  };

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

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(prev => !prev)}
                title="Notificaciones"
                aria-label="Abrir panel de notificaciones"
                className={`relative p-2 rounded-lg transition-colors focus:outline-none cursor-pointer ${
                  isOpen 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {unreadCount} nuevas
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Leídas</span>
                          </button>
                        )}
                        <button
                          onClick={clearAllNotifications}
                          title="Vaciar notificaciones"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Body */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group ${
                            !item.read ? 'bg-blue-50/40' : 'bg-white'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-slate-300">
                            {getNotificationIcon(item.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <p className={`text-xs ${!item.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'} truncate`}>
                                {item.title}
                              </p>
                              {!item.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-1.5">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>{item.time}</span>
                              {item.actionTab && (
                                <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                                  Ver en {item.actionTab} <ChevronRight className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                          <Bell className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mb-0.5">No tienes notificaciones pendientes</p>
                        <p className="text-[11px] text-slate-400">Te avisaremos cuando haya novedades en tus candidaturas.</p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  {notifications.length > 0 && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <button
                        onClick={() => {
                          onTabChange('Perfil');
                          setIsOpen(false);
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Ver centro de alertas completo
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

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
