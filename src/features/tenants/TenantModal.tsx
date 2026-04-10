import { X, Users, Phone, UserPlus, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: any;
}

const TenantModal = ({ isOpen, onClose, tenant }: TenantModalProps) => {
  const { language, addTenant, updateTenant } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    familySize: 1,
    reliability: 100,
    income: 0,
    leaseStart: new Date().toISOString().split('T')[0],
    leaseEnd: '',
    notes: ''
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        phone: tenant.phone || '',
        email: tenant.email || '',
        familySize: tenant.familySize || 1,
        reliability: tenant.reliability || 100,
        income: tenant.income || 0,
        leaseStart: tenant.leaseStart || new Date().toISOString().split('T')[0],
        leaseEnd: tenant.leaseEnd || '',
        notes: tenant.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        familySize: 1,
        reliability: 100,
        income: 0,
        leaseStart: new Date().toISOString().split('T')[0],
        leaseEnd: '',
        notes: ''
      });
    }
  }, [tenant, isOpen]);

  const handleSubmit = async () => {
    try {
      if (tenant) {
        await updateTenant({ ...tenant, ...formData });
      } else {
        await addTenant({ ...formData, status: 'Active' });
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const steps = [
    { id: 1, label: language === 'so' ? 'Aqoon-jir' : 'Resident Identity', icon: UserPlus },
    { id: 2, label: language === 'so' ? 'Heshiiska' : 'Lease Agreement', icon: Star },
  ];

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
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Header / Progress */}
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
               
               <div className="flex justify-between items-start relative z-10 mb-8">
                 <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                      {tenant ? 'UPDATE RESIDENT' : 'DEPLOY RESIDENT'}
                    </h2>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Operational Lifecycle V4.0</p>
                 </div>
                 <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="flex gap-4 relative z-10">
                  {steps.map((s) => (
                    <div 
                      key={s.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest",
                        step === s.id ? "bg-primary text-white" : "bg-white/5 text-slate-400 opacity-60"
                      )}
                    >
                       <s.icon className="w-4 h-4" />
                       {s.label}
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10">
               <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Identity Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-lg font-bold"
                            placeholder="e.g. Abdirahman Ahmed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Phone Terminal</label>
                          <input 
                            type="text" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                            placeholder="+252..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Family Unit Size</label>
                          <input 
                            type="number" 
                            required
                            value={formData.familySize}
                            onChange={(e) => setFormData({...formData, familySize: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Reliability Score (%)</label>
                          <input 
                            type="number" 
                            max="100"
                            min="0"
                            value={formData.reliability}
                            onChange={(e) => setFormData({...formData, reliability: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Verified Income ($)</label>
                          <input 
                            type="number" 
                            value={formData.income}
                            onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Agreement Notes</label>
                          <textarea 
                            rows={4}
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium resize-none"
                            placeholder="Enter any additional lease terms or resident notes..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               <div className="flex gap-4 mt-12 bg-slate-50 p-4 rounded-[2rem]">
                  {step > 1 && (
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-8 py-5 border border-slate-200 text-slate-400 font-black text-[10px] tracking-widest uppercase rounded-2xl hover:bg-white transition-all active:scale-95"
                    >
                      Back Sequence
                    </button>
                  )}
                  {step < steps.length ? (
                    <button 
                      onClick={() => setStep(step + 1)}
                      className="flex-1 px-8 py-5 bg-slate-900 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Next Phase
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      className="flex-1 px-8 py-5 bg-primary text-white font-black text-[10px] tracking-widest uppercase rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Confirm Deployment
                    </button>
                  )}
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TenantModal;
