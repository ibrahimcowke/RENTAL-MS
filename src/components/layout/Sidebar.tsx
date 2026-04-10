import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  Users, 
  CreditCard, 
  Wrench, 
  FileText, 
  LogOut,
  Building2
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const Sidebar = () => {
  const { language } = useStore();

  const menuItems = [
    { name: language === 'so' ? 'Dashboard' : 'Dashboard', icon: BarChart3, path: '/' },
    { name: language === 'so' ? 'Guryaha' : 'Properties', icon: Home, path: '/properties' },
    { name: language === 'so' ? 'Kiraystayaasha' : 'Tenants', icon: Users, path: '/tenants' },
    { name: language === 'so' ? 'Lacag-bixinta' : 'Payments', icon: CreditCard, path: '/payments' },
    { name: language === 'so' ? 'Dayactirka' : 'Maintenance', icon: Wrench, path: '/maintenance' },
    { name: language === 'so' ? 'Warbixinada' : 'Reports', icon: FileText, path: '/reports' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 themed-sidebar border-r border-slate-200/10 h-screen sticky top-0 shadow-2xl">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-xl">
          <Building2 className="w-6 h-6 themed-sidebar-accent" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Mogadishu</h1>
          <p className="text-[10px] text-white/50 font-bold tracking-[0.2em] pt-0.5 mt-0.5 uppercase">Rental Mgmt</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.05]' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110`} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-white/50 hover:text-white hover:bg-red-500/20 rounded-xl transition-all font-bold text-sm">
          <LogOut className="w-5 h-5" />
          <span>{language === 'so' ? 'Ka bax' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
