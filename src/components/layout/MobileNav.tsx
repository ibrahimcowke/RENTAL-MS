import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  Users, 
  CreditCard,
  PlusCircle
} from 'lucide-react';

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-50">
      <NavLink
        to="/"
        className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
      >
        <BarChart3 className="w-6 h-6" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Home</span>
      </NavLink>

      <NavLink
        to="/properties"
        className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Props</span>
      </NavLink>

      <div className="flex flex-col items-center justify-center w-full h-full -mt-8">
        <button className="bg-primary text-white p-3 rounded-full shadow-lg shadow-primary/30 active:scale-90 transition-transform">
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      <NavLink
        to="/tenants"
        className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
      >
        <Users className="w-6 h-6" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Tenants</span>
      </NavLink>

      <NavLink
        to="/payments"
        className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
      >
        <CreditCard className="w-6 h-6" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Pay</span>
      </NavLink>
    </div>
  );
};

export default MobileNav;
