import { X, Wrench, Building2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: any;
}

import { X, Wrench, Building2, User, Zap, ChevronRight, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: any;
}

const MaintenanceModal = ({ isOpen, onClose, request }: MaintenanceModalProps) => {
  const { language, properties, tenants, addMaintenance, updateMaintenance } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    property_id: '',
    tenant_id: '',
    priority: 'normal' as any,
    status: 'pending' as any,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title,
        property_id: request.property_id,
        tenant_id: request.tenant_id,
        priority: request.priority,
        status: request.status,
        date: request.date || new Date().toISOString().split('T')[0],
        description: request.description || ''
      });
    } else {
      setFormData({
        title: '',
        property_id: '',
        tenant_id: '',
        priority: 'normal',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
    setStep(1);
  }, [request, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    try {
      if (request) {
        await updateMaintenance({ ...request, ...formData });
      } else {
        await addMaintenance(formData as any);
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const steps = [
    { id: 1, title: 'Issue Diagnosis', icon: AlertTriangle },
    { id: 2, title: 'Operational Tracking', icon: Zap }
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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Cinematic Header */}
            <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full" />
               
               <div className="flex justify-between items-start relative z-10 mb-10">
                 <div>
                    <div className="flex items-center gap-2 mb-3">
                       <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                       <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Restoration Wizard V2.0</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                      {request ? 'Update Work Order' : 'Initiate Restoration'}
                    </h2>
                 </div>
                 <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
               </div>

               {/* Step Indicator */}
               <div className="flex gap-4 relative z-10">
                  {steps.map((s) => (
                    <div key={s.id} className="flex flex-1 items-center gap-3">
                       <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border",
                         step >= s.id ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white/5 border-white/10 text-white/40"
                       )}>
                          {s.id}
                       </div>
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         step >= s.id ? "text-white" : "text-white/20"
                       )}>{s.title}</span>
                       {s.id === 1 && <div className="flex-1 h-px bg-white/10 mx-2" />}
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10">
               <form onSubmit={handleSubmit} className="space-y-8">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Asset Fault Title</label>
                          <input 
                            type="text" 
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-8 outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all text-lg font-bold"
                            placeholder="e.g. Master Suite AC Failure"
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Target Portfolio Asset</label>
                             <div className="relative group">
                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                <select 
                                  required
                                  value={formData.property_id}
                                  onChange={(e) => setFormData({...formData, property_id: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-bold appearance-none"
                                >
                                   <option value="">{language === 'so' ? 'Dooro Guriga' : 'Select Unit'}</option>
                                   {properties.map(p => (
                                     <option key={p.id} value={p.id}>{p.name}</option>
                                   ))}
                                </select>
                             </div>
                          </div>

                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Reporting Resident</label>
                             <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                <select 
                                  required
                                  value={formData.tenant_id}
                                  onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-bold appearance-none"
                                >
                                   <option value="">{language === 'so' ? 'Dooro Kireeyaha' : 'Select Resident'}</option>
                                   {tenants.map(t => (
                                     <option key={t.id} value={t.id}>{t.name}</option>
                                   ))}
                                </select>
                             </div>
                          </div>
                       </div>

                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Threat Priority Level</label>
                          <div className="flex gap-4">
                             {['low', 'normal', 'urgent', 'emergency'].map(p => (
                               <button
                                 key={p}
                                 type="button"
                                 onClick={() => setFormData({...formData, priority: p as any})}
                                 className={cn(
                                   "flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all",
                                   formData.priority === p 
                                   ? "bg-rose-600 text-white border-rose-600 shadow-xl shadow-rose-600/20" 
                                   : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white"
                                 )}
                               >
                                 {p}
                               </button>
                             ))}
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Fault Description & Diagnosis</label>
                          <textarea 
                             rows={4}
                             value={formData.description}
                             onChange={(e) => setFormData({...formData, description: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-8 outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-medium"
                             placeholder="Provide detailed diagnosis of the issue..."
                          />
                       </div>

                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Resolution Pipeline Status</label>
                          <div className="grid grid-cols-3 gap-4">
                             {[
                               { id: 'pending', icon: Clock, label: 'Pending' },
                               { id: 'in_progress', icon: Wrench, label: 'In Progress' },
                               { id: 'resolved', icon: CheckCircle2, label: 'Resolved' }
                             ].map(s => (
                               <button
                                 key={s.id}
                                 type="button"
                                 onClick={() => setFormData({...formData, status: s.id as any})}
                                 className={cn(
                                   "py-6 rounded-2xl border transition-all flex flex-col items-center gap-3",
                                   formData.status === s.id 
                                   ? "bg-slate-900 text-white border-slate-900 shadow-2xl" 
                                   : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white"
                                 )}
                               >
                                 <s.icon className={cn("w-6 h-6", formData.status === s.id ? "text-amber-500" : "text-slate-300")} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                    </motion.div>
                  )}

                  <div className="flex gap-4 pt-6">
                    {step === 2 && (
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="flex-1 px-10 py-6 border border-slate-200 font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] hover:bg-slate-50 transition-all text-slate-600"
                      >
                        Previous Phase
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-[2] px-10 py-6 bg-amber-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {step === 1 ? 'Go to Tracking' : (request ? 'Commit Modifications' : 'Launch Work Order')}
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

export default MaintenanceModal;
