import { X, Users, Phone, UserPlus, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: any;
}

const TenantModal = ({ isOpen, onClose, tenant }: TenantModalProps) => {
  const { language, addTenant, updateTenant } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    familySize: 1,
    reliability: 100,
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        phone: tenant.phone,
        familySize: tenant.familySize,
        reliability: tenant.reliability,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        familySize: 1,
        reliability: 100,
      });
    }
  }, [tenant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {tenant ? (language === 'so' ? 'Wax ka beddel' : 'Edit Tenant') : (language === 'so' ? 'Kireeye Cusub' : 'Add Tenant')}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                    placeholder="+252..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Family Size</label>
                  <input 
                    type="number" 
                    required
                    value={formData.familySize}
                    onChange={(e) => setFormData({...formData, familySize: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Reliability (%)</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input 
                      type="number" 
                      max="100"
                      min="0"
                      value={formData.reliability}
                      onChange={(e) => setFormData({...formData, reliability: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-bold text-amber-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  {language === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {language === 'so' ? 'Kaydi' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TenantModal;
