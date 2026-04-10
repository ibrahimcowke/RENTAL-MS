import { X, DollarSign, Calendar, Wallet, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: any;
}

import { X, DollarSign, Calendar, Wallet, User, Zap, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

const PaymentModal = ({ isOpen, onClose, payment }: PaymentModalProps) => {
  const { language, tenants, addPayment, updatePayment } = useStore();
  const [formData, setFormData] = useState({
    tenant: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: 'EVC Plus',
    status: 'paid' as any
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        tenant: payment.tenant,
        amount: payment.amount,
        date: payment.date,
        method: payment.method,
        status: payment.status
      });
    } else {
      setFormData({
        tenant: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        method: 'EVC Plus',
        status: 'paid'
      });
    }
  }, [payment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (payment) {
        await updatePayment({ ...payment, ...formData });
      } else {
        await addPayment(formData as any);
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Cinematic Header */}
            <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
               
               <div className="flex justify-between items-start relative z-10 mb-8">
                 <div>
                    <div className="flex items-center gap-2 mb-3">
                       <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Revenue Interface V1.4</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">
                      {payment ? 'UPDATE LEDGER' : 'RECORD TRANSACTION'}
                    </h2>
                 </div>
                 <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
               </div>
            </div>

            <div className="p-10">
               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Resident Account</label>
                       <div className="relative group">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <select 
                            required
                            value={formData.tenant}
                            onChange={(e) => setFormData({...formData, tenant: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-lg font-bold appearance-none"
                          >
                             <option value="">{language === 'so' ? 'Dooro Kireeyaha' : 'Choose Resident'}</option>
                             {tenants.map(t => (
                               <option key={t.id} value={t.name}>{t.name}</option>
                             ))}
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">USD Credit Value</label>
                       <div className="relative group">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
                          <input 
                            type="number" 
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-xl font-black text-emerald-600"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Timestamp</label>
                       <div className="relative group">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="date" 
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold"
                          />
                       </div>
                    </div>

                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Payment Channel</label>
                       <div className="grid grid-cols-2 gap-4">
                          {['EVC Plus', 'e-Dahab', 'Cash', 'Bank Transfer'].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setFormData({...formData, method: m})}
                              className={cn(
                                "py-5 px-6 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.1em] border transition-all flex items-center justify-between group",
                                formData.method === m 
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20" 
                                : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200"
                              )}
                            >
                               <div className="flex items-center gap-3">
                                  <Wallet className={cn("w-5 h-5", formData.method === m ? "text-white" : "text-slate-300")} />
                                  {m}
                               </div>
                               {formData.method === m && <Zap className="w-4 h-4 fill-current" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Verification Status</label>
                       <div className="flex gap-4">
                          {['paid', 'partial', 'overdue'].map(s => (
                            <button
                               key={s}
                               type="button"
                               onClick={() => setFormData({...formData, status: s as any})}
                               className={cn(
                                 "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                                 formData.status === s 
                                 ? "bg-slate-900 text-white border-slate-900 shadow-2xl" 
                                 : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white"
                               )}
                            >
                               {s}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="submit"
                      className="flex-1 px-10 py-6 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {payment ? 'Confirm Modifications' : 'Commit Revenue Stream'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
               </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
