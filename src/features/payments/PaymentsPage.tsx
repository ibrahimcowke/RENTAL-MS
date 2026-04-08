import { 
  CreditCard, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Smartphone,
  Banknote,
  ArrowUpRight,
  Filter,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const payments = [
  { id: 1, tenant: 'Mohamed Abdi', property: 'Hodan Suite A', amount: 450, method: 'EVC Plus', date: '2024-04-05', status: 'paid', code: 'TX-99218' },
  { id: 2, tenant: 'Fadumo Hirsi', property: 'Karaan Heights', amount: 350, method: 'EVC Plus', date: '2024-04-03', status: 'paid', code: 'TX-88122' },
  { id: 3, tenant: 'Ahmed Duale', property: 'Wadajir Commercial', amount: 1200, method: 'Cash', date: '2024-04-01', status: 'partial', code: null },
  { id: 4, tenant: 'Sahra Yasin', property: 'Bondheere Corner', amount: 500, method: 'e-Dahab', date: '2024-03-28', status: 'overdue', code: null },
  { id: 5, tenant: 'Ali Jeyte', property: 'Daynile Family Villa', amount: 800, method: 'EVC Plus', date: '2024-04-07', status: 'paid', code: 'TX-11223' },
];

const PaymentsPage = () => {
  const { language, currency } = useStore();

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'EVC Plus': 
      case 'e-Dahab': return <Smartphone className="w-4 h-4" />;
      case 'Cash': return <Banknote className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'partial': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Lacag-bixinta' : 'Rent Payments'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Lasoco kirada laga soo bixiyay guryahaaga.' : 'Track incoming rent, overdue status and mobile money logs.'}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          {language === 'so' ? 'Lacag-qabbado' : 'Record Payment'}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-b-4 border-b-primary">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Collected (Apr)</p>
                <h3 className="text-2xl font-bold">{currency === 'USD' ? '$11,250' : 'SOS 281M'}</h3>
             </div>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-amber-500">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending/Partial</p>
                <h3 className="text-2xl font-bold">{currency === 'USD' ? '$1,400' : 'SOS 35M'}</h3>
             </div>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-red-500">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overdue (Risk)</p>
                <h3 className="text-2xl font-bold">{currency === 'USD' ? '$500' : 'SOS 12.5M'}</h3>
             </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={language === 'so' ? 'Raadi lacag-bixin (Magac ama Code)...' : 'Search by name or TX code...'}
            className="input-field pl-12 h-12"
          />
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
             <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
             <Calendar className="w-4 h-4" /> This Month
           </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Tenant / Property</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Method & Code</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(pay.status)}`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{pay.tenant}</p>
                      <p className="text-xs text-slate-400 font-medium">{pay.property}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900">
                      {currency === 'USD' ? `$${pay.amount}` : `SOS ${(pay.amount * 25).toLocaleString()}k`}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                          {getMethodIcon(pay.method)}
                       </span>
                       <div>
                          <p className="text-sm font-bold text-slate-700">{pay.method}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{pay.code || 'NO CODE'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-slate-500">{new Date(pay.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Details">
                          <ArrowUpRight className="w-5 h-5" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
