import { X, Wrench, Building2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: any;
}

const MaintenanceModal = ({ isOpen, onClose, request }: MaintenanceModalProps) => {
  const { language, properties, tenants, addMaintenance, updateMaintenance } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    property_id: '',
    tenant_id: '',
    priority: 'normal' as any,
    status: 'pending' as any,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title,
        property_id: request.property_id,
        tenant_id: request.tenant_id,
        priority: request.priority,
        status: request.status,
        date: request.date || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        property_id: '',
        tenant_id: '',
        priority: 'normal',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [request, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Wrench className="w-6 h-6 text-primary" />
                {request ? (language === 'so' ? 'Cusboonaysii' : 'Edit Request') : (language === 'so' ? 'Codsi Cusub' : 'New Maintenance Request')}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Issue Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-medium"
                  placeholder="e.g. Broken Sink, AC Repair"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Property</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      required
                      value={formData.property_id}
                      onChange={(e) => setFormData({...formData, property_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium appearance-none"
                    >
                      <option value="">Choose Unit</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Reporting Tenant</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      required
                      value={formData.tenant_id}
                      onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium appearance-none"
                    >
                      <option value="">Choose Tenant</option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-bold uppercase"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                   <select 
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-bold uppercase"
                   >
                     <option value="pending">Pending</option>
                     <option value="in_progress">In Progress</option>
                     <option value="resolved">Resolved</option>
                   </select>
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
                  {request ? 'Update Request' : 'Submit Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MaintenanceModal;
