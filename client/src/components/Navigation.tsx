import { Home, Search, Bookmark, User } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-40">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <NavItem icon={<Home className="w-6 h-6" />} label="Inicio" active />
        <NavItem icon={<Search className="w-6 h-6" />} label="Buscar" />
        <NavItem icon={<Bookmark className="w-6 h-6" />} label="Guardado" />
        <NavItem icon={<User className="w-6 h-6" />} label="Perfil" />
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-[#334195]' : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`${active ? 'fill-current' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
