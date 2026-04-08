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
  Calendar,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

const PaymentsPage = () => {
  const { language, currency, payments, deletePayment, updatePayment } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPayment, setEditingPayment] = useState<any>(null);

  const filteredPayments = payments.filter(p => 
    p.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto lacag-bixintan?' : 'Are you sure you want to delete this payment record?')) {
      deletePayment(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Lasocodka Lacagaha' : 'Payment Tracking'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Maamul dakhliga ka soo baxa guryaha iyo bixinta kirada.' : 'Record and audit rent collections and transaction codes.'}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          {language === 'so' ? 'Diiwaangali Lacag' : 'Record Payment'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-slate-100 bg-white shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Bishaan la qabtay' : 'Collected This Month'}</p>
              <p className="text-2xl font-bold text-slate-900">$8,450</p>
           </div>
        </div>
        <div className="glass-card p-6 border-slate-100 bg-white shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Wali maqan' : 'Pending Rent'}</p>
              <p className="text-2xl font-bold text-slate-900">$1,200</p>
           </div>
        </div>
        <div className="glass-card p-6 border-slate-100 bg-white shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Dakhliga guud' : 'Total Revenue'}</p>
              <p className="text-2xl font-bold text-slate-900">$94,200</p>
           </div>
        </div>
      </div>

      {/* Filter & Table Area */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={language === 'so' ? 'Raadi kireye ama habka lacag-bixinta...' : 'Search by tenant or method...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
            {language === 'so' ? 'Maalmaha' : 'Last 30 Days'}
          </button>
        </div>

        <div className="glass-card overflow-hidden border-slate-100 bg-white shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Kireyaha' : 'Tenant'}</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Qiimaha' : 'Amount'}</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Taariikhda' : 'Date'}</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Habka' : 'Method'}</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Xaaladda' : 'Status'}</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{language === 'so' ? 'Ficil' : 'Actions'}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{payment.tenant}</p>
                         </td>
                         <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">${payment.amount}</p>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                               <Calendar className="w-3 h-3" />
                               {payment.date}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               {payment.method === 'EVC Plus' || payment.method === 'e-Dahab' ? (
                                 <Smartphone className="w-4 h-4 text-blue-500" />
                               ) : (
                                 <Banknote className="w-4 h-4 text-emerald-500" />
                               )}
                               <span className="text-xs font-bold text-slate-700">{payment.method}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${
                               payment.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                               payment.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                               'bg-amber-100 text-amber-700'
                            }`}>
                               <div className={`w-1 h-1 rounded-full ${
                                 payment.status === 'paid' ? 'bg-emerald-500' : 
                                 payment.status === 'overdue' ? 'bg-red-500' : 
                                 'bg-amber-500'
                               }`} />
                               {payment.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => setEditingPayment(payment)}
                                 className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100"
                               >
                                 <Edit className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleDelete(payment.id)}
                                 className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100"
                               >
                                 <Trash2 className="w-4 h-4" />
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

      {/* Edit Modal (Simplified) */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'so' ? 'Wax ka beddel Lacag-bixinta' : 'Edit Payment Record'}
              </h2>
              <button 
                onClick={() => setEditingPayment(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              updatePayment(editingPayment);
              setEditingPayment(null);
            }}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Amount ($)</label>
                <input 
                  type="number" 
                  value={editingPayment.amount}
                  onChange={(e) => setEditingPayment({...editingPayment, amount: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Payment Method</label>
                <select 
                  value={editingPayment.method}
                  onChange={(e) => setEditingPayment({...editingPayment, method: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                >
                  <option>EVC Plus</option>
                  <option>e-Dahab</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="flex-1 px-6 py-3 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  {language === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  {language === 'so' ? 'Keydi' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
