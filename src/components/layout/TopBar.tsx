import { 
  Bell, 
  Search, 
  Globe, 
  DollarSign, 
  User as UserIcon 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import NotificationCenter from './NotificationCenter';

const TopBar = () => {
  const { language, setLanguage, currency, setCurrency } = useStore();

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-4 md:px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={language === 'so' ? 'Halkan ka raadi...' : 'Search everything...'}
            className="w-full bg-slate-50 border border-transparent rounded-xl py-2 pl-10 pr-4 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Toggle */}
        <button 
          onClick={() => setLanguage(language === 'so' ? 'en' : 'so')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <Globe className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold uppercase">{language}</span>
        </button>

        {/* Currency Toggle */}
        <button 
          onClick={() => setCurrency(currency === 'USD' ? 'SOS' : 'USD')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <DollarSign className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold">{currency}</span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        <NotificationCenter />

        <button className="flex items-center gap-2 p-1 pl-1 md:pl-3 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-100">
          <div className="hidden md:block text-right mr-1">
            <p className="text-xs font-bold text-slate-900 leading-none">Ali Ahmed</p>
            <p className="text-[10px] text-slate-500 font-medium">Landlord</p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
            <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
