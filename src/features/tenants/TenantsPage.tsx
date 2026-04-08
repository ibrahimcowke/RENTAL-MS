import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Clock, 
  Star,
  MoreVertical,
  ShieldCheck,
  AlertTriangle,
  History
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const tenants = [
  { 
    id: 1, 
    name: 'Mohamed Abdi', 
    phone: '+252 61 555 1122', 
    property: 'Hodan Suite A', 
    reliability: 98, 
    status: 'good',
    familySize: 5,
    joined: 'Jan 2024',
    history: 'On-time'
  },
  { 
    id: 2, 
    name: 'Fadumo Hirsi', 
    phone: '+252 61 444 3344', 
    property: 'Karaan Heights', 
    reliability: 100, 
    status: 'vip',
    familySize: 3,
    joined: 'Mar 2023',
    history: 'Early'
  },
  { 
    id: 3, 
    name: 'Ahmed Duale', 
    phone: '+252 61 222 5566', 
    property: 'Wadajir Commercial', 
    reliability: 75, 
    status: 'at-risk',
    familySize: 8,
    joined: 'Oct 2023',
    history: 'Late x2'
  },
  { 
    id: 4, 
    name: 'Sahra Yasin', 
    phone: '+252 61 777 8899', 
    property: 'Bondheere Corner', 
    reliability: 92, 
    status: 'good',
    familySize: 2,
    joined: 'Dec 2024',
    history: 'On-time'
  },
];

const TenantsPage = () => {
  const { language } = useStore();

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return 'text-primary';
    if (score >= 85) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vip': return (
        <span className="flex items-center gap-1.2 px-2 py-0.8 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" /> VIP Tenant
        </span>
      );
      case 'good': return (
        <span className="flex items-center gap-1.2 px-2 py-0.8 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Good Stand
        </span>
      );
      case 'at-risk': return (
        <span className="flex items-center gap-1.2 px-2 py-0.8 bg-red-100 text-red-700 border border-red-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3 h-3" /> Payment Risk
        </span>
      );
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Kiraystayaasha' : 'Tenant Management'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Maamul macluumaadka kiraystayaashaada.' : 'Monitor tenant reliability, history and property links.'}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          {language === 'so' ? 'Kirayste Cusub' : 'Add Tenant'}
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Search & Stats */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={language === 'so' ? 'Raadi kirayste (Magac ama Telefoon)...' : 'Search by name or phone...'}
              className="input-field pl-12 h-14"
            />
          </div>
          <div className="flex gap-4">
             <div className="glass-card px-6 py-3 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Reliability</span>
                <span className="text-xl font-bold text-primary">94.2%</span>
             </div>
             <div className="glass-card px-6 py-3 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Level</span>
                <span className="text-xl font-bold text-emerald-500 italic">Low</span>
             </div>
          </div>
        </div>

        {/* Tenant Table/List */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Tenant Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Property & District</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Reliability</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((ten) => (
                  <tr key={ten.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-bold">
                          {ten.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ten.name}</p>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {ten.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-secondary" /> {ten.property}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-5">Lease Since {ten.joined}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${ten.reliability > 90 ? 'bg-primary' : ten.reliability > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${ten.reliability}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${getReliabilityColor(ten.reliability)}`}>{ten.reliability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div className="flex items-center gap-1 tooltip" title="Family Size">
                             <Users className="w-3.5 h-3.5 text-slate-400" />
                             <span className="text-xs font-bold text-slate-600">{ten.familySize}</span>
                          </div>
                          <div className="flex items-center gap-1 tooltip" title="Payment History">
                             <History className="w-3.5 h-3.5 text-slate-400" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{ten.history}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(ten.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reliability Guide - Mini Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-primary flex gap-4">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-primary fill-primary/20" />
           </div>
           <div>
              <p className="text-sm font-bold text-slate-900 mb-1">VIP Recognition</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Tenants with 100% reliability for 12 months qualify for "Trust Shield" program.</p>
           </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500 flex gap-4">
           <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-500" />
           </div>
           <div>
              <p className="text-sm font-bold text-slate-900 mb-1">Grace Periods</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Somali context allows 3-day grace for EVC Plus transfers before scoring hits.</p>
           </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-slate-400 flex gap-4">
           <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
              <History className="w-6 h-6 text-slate-500" />
           </div>
           <div>
              <p className="text-sm font-bold text-slate-900 mb-1">Automatic Logs</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">System auto-updates reliability score based on 'Mark as Paid' timing.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TenantsPage;
