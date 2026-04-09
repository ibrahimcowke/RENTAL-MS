import { X, Building2, MapPin, DollarSign, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

const PropertyModal = ({ isOpen, onClose, property }: PropertyModalProps) => {
  const { language, addProperty, updateProperty } = useStore();
  const [districts, setDistricts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    district_id: '',
    address: '',
    property_type: 'Apartment',
    rent_amount: 0,
    status: 'available'
  });

  useEffect(() => {
    fetchDistricts();
    if (property) {
      setFormData({
        name: property.name,
        district_id: property.district_id,
        address: property.address,
        property_type: property.property_type || property.type || 'Apartment',
        rent_amount: property.rent_amount || property.rent || 0,
        status: property.status || 'available'
      });
    } else {
      setFormData({
        name: '',
        district_id: '',
        address: '',
        property_type: 'Apartment',
        rent_amount: 0,
        status: 'available'
      });
    }
  }, [property, isOpen]);

  const fetchDistricts = async () => {
    const { data } = await supabase.from('districts').select('*').order('name');
    if (data) setDistricts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (property) {
        await updateProperty({ ...property, ...formData, rent: formData.rent_amount });
      } else {
        await addProperty({ ...formData, rent: formData.rent_amount, currency: 'USD' } as any);
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {property ? (language === 'so' ? 'Wax ka beddel' : 'Edit Property') : (language === 'so' ? 'Guri Cusub' : 'Add New Property')}
                  </h2>
                  <p className="text-slate-500 text-sm">{language === 'so' ? 'Fadlan geli macluumaadka guriga.' : 'Enter the property details below.'}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all border border-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Property Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                      placeholder="e.g. Hodan Suite A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">District</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      required
                      value={formData.district_id}
                      onChange={(e) => setFormData({...formData, district_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium appearance-none"
                    >
                      <option value="">Select District</option>
                      {districts.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Address / Landmark</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    placeholder="Maka Al Mukarama St"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Property Type</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      value={formData.property_type}
                      onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium appearance-none"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Room">Room</option>
                      <option value="Shop">Shop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Monthly Rent ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input 
                      type="number" 
                      required
                      value={formData.rent_amount}
                      onChange={(e) => setFormData({...formData, rent_amount: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold text-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                  <div className="flex gap-2">
                    {['available', 'occupied', 'maintenance'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s as any})}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                          formData.status === s 
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.05]' 
                          : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-4 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  {language === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {property ? (language === 'so' ? 'Cusboonaysii' : 'Update Property') : (language === 'so' ? 'Kaydi Guriga' : 'Save Property')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
