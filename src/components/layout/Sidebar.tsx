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
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-xl">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">Mogadishu</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide border-t border-slate-100 pt-0.5 mt-0.5">RENTAL MGMT</p>
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
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110`} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
          <LogOut className="w-5 h-5" />
          <span>{language === 'so' ? 'Ka bax' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
