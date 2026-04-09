import { X, DollarSign, Calendar, Wallet, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: any;
}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {payment ? (language === 'so' ? 'Wax ka beddel Bixinta' : 'Edit Payment') : (language === 'so' ? 'Dakhli Cusub' : 'Record New Payment')}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Record a rental payment for a tenant.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Tenant</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    required
                    value={formData.tenant}
                    onChange={(e) => setFormData({...formData, tenant: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium appearance-none"
                  >
                    <option value="">{language === 'so' ? 'Dooro Kireeyaha' : 'Choose Tenant'}</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input 
                      type="number" 
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-bold text-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['EVC Plus', 'e-Dahab', 'Cash', 'Bank Transfer'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({...formData, method: m})}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                        formData.method === m 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                <div className="flex gap-2">
                  {['paid', 'partial', 'overdue'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, status: s as any})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                        formData.status === s 
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                        : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-6 py-4 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {payment ? 'Update Record' : 'Save Payment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
