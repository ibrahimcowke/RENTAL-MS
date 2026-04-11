import { X, Building2, MapPin, DollarSign, Home, Plus, Trash2, ChevronRight, ArrowLeft, Layers, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

const PROPERTY_TYPES = [
  {
    id: 'Apartment',
    label: 'Apartment',
    labelSo: 'Qol / Daa\'im',
    icon: Layers,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBg: 'bg-blue-600',
    description: 'Multi-unit building with sections. Has beds, toilet & kitchen.',
    descSo: 'Dhismo leh qaybaha. Waxaa kujira sariir, musqul & jiko.',
  },
  {
    id: 'Villa',
    label: 'Villa',
    labelSo: 'Filla',
    icon: Home,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBg: 'bg-emerald-600',
    description: 'Premium standalone villa with distinct sections & floor area.',
    descSo: 'Xero weyn oo leh qaybaha iyo masaafada dab.',
  },
  {
    id: 'Normal House',
    label: 'Normal House',
    labelSo: 'Guri Caadi ah',
    icon: Building2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-amber-600',
    description: 'Standard residential house with sections. No amenity breakdown.',
    descSo: 'Guri caadi ah oo leh qaybaha. Aama kuguma jiraan.',
  },
] as const;


const PropertyModal = ({ isOpen, onClose, property }: PropertyModalProps) => {
  const { language, addProperty, updateProperty } = useStore();
  const [districts, setDistricts] = useState<any[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    district_id: '',
    address: '',
    property_type: 'Apartment' as 'Apartment' | 'Villa' | 'Normal House',
    building_number: null as number | null,
    rent_amount: 0,
    status: 'available' as 'available' | 'occupied' | 'maintenance',
    images: [] as string[],
    video_url: '',
    bedrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    floor_area: null as number | null,
    parent_id: '',
    description: ''
  });

  const STEPS = [
    { id: 1, label: language === 'so' ? 'Faahfaahinta' : 'Basic Details', icon: Info, color: 'blue' },
    { id: 2, label: language === 'so' ? 'Lacagta & Sawirada' : 'Finance & Photos', icon: DollarSign, color: 'emerald' },
  ];

  useEffect(() => {
    fetchDistricts();
    if (property) {
      setStep(1);
      setFormData({
        name: property.name || '',
        district_id: property.district_id || '',
        address: property.address || '',
        property_type: property.property_type || 'Apartment',
        building_number: property.building_number || null,
        rent_amount: property.rent_amount || 0,
        status: property.status || 'available',
        images: property.images || [],
        video_url: property.video_url || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        kitchens: property.kitchens || 0,
        floor_area: property.floor_area || null,
        parent_id: property.parent_id || '',
        description: property.description || ''
      });
    } else {
      setStep(1);
      setFormData({
        name: '', district_id: '', address: '', property_type: 'Apartment',
        building_number: null, rent_amount: 0, status: 'available',
        images: [], video_url: '', bedrooms: 1, bathrooms: 1, kitchens: 1,
        floor_area: null, parent_id: '', description: ''
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
      const payload = { ...formData, currency: 'USD' };
      if (formData.property_type !== 'Apartment') {
        payload.bedrooms = 0;
        payload.bathrooms = 0;
        payload.kitchens = 0;
        payload.building_number = null;
      }
      if (property) {
        await updateProperty({ ...property, ...payload });
      } else {
        await addProperty(payload as any);
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 md:p-8 bg-slate-950/80 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className="bg-white w-full max-w-5xl h-full md:h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col md:rounded-[3rem] border border-slate-200"
          >
            <div className="flex flex-1 overflow-hidden relative z-10">
              
              {/* STEP TRACKER SIDEBAR */}
              <div className="hidden lg:flex w-72 flex-col bg-slate-50 border-r border-slate-200 p-10">
                 <div className="mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                      {property ? 'Edit' : 'Add'}<br/>Property
                    </h2>
                 </div>

                 <div className="space-y-8">
                    {STEPS.map((s) => (
                      <div key={s.id} className="relative">
                         <div className={cn(
                           "flex items-center gap-4 transition-all duration-300",
                           step === s.id ? "opacity-100 translate-x-2" : "opacity-40"
                         )}>
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                              step === s.id ? "bg-primary text-white" : "bg-white border border-slate-200"
                            )}>
                               <s.icon className={cn("w-5 h-5", step === s.id ? "text-white" : "text-slate-400")} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 0{s.id}</p>
                               <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">{s.label}</h4>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="mt-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                      "Ensure all property details are accurate for better management."
                    </p>
                 </div>
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
                 
                 {/* Header */}
                 <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <div className={cn("w-2 h-2 rounded-full", "bg-primary")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400")}>
                             {STEPS[step-1].label}
                          </span>
                       </div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                          {step === 1 ? 'Primary Information' : 'Financials & Visuals'}
                       </h3>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-75">
                       <X className="w-6 h-6" />
                    </button>
                 </div>

                 {/* Step Content */}
                 <div className="flex-1 overflow-y-auto px-10 py-10 no-scrollbar">
                    <AnimatePresence mode="wait">
                       {step === 1 && (
                         <motion.div 
                           key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                           className="space-y-10"
                         >
                            {/* Property Type Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               {PROPERTY_TYPES.map((type) => (
                                 <button
                                   key={type.id}
                                   onClick={() => setFormData(fd => ({ ...fd, property_type: type.id as any }))}
                                   className={cn(
                                     "relative text-left p-6 rounded-3xl border-2 transition-all group flex flex-col gap-4 overflow-hidden shadow-sm",
                                     formData.property_type === type.id 
                                      ? "border-primary bg-primary/5" 
                                      : "border-slate-100 bg-white hover:border-primary/20"
                                   )}
                                 >
                                   <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all", 
                                     formData.property_type === type.id ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>
                                     <type.icon className="w-6 h-6" />
                                   </div>
                                   <div>
                                     <h3 className={cn("font-black text-sm tracking-tight mb-1", 
                                       formData.property_type === type.id ? "text-primary" : "text-slate-900")}>
                                       {language === 'so' ? type.labelSo : type.label}
                                     </h3>
                                     <p className="text-[11px] text-slate-500 font-medium leading-normal line-clamp-2">
                                       {language === 'so' ? type.descSo : type.description}
                                     </p>
                                   </div>
                                 </button>
                               ))}
                            </div>

                            <div className="space-y-8 max-w-2xl">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Name / Label</label>
                                  <div className="relative group">
                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                      type="text" required value={formData.name}
                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                      placeholder="e.g. Al-Hayat Tower"
                                    />
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District / Location</label>
                                     <div className="relative group">
                                       <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                                       <select
                                         required value={formData.district_id}
                                         onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-10 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                                       >
                                         <option value="">Select District</option>
                                         {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                       </select>
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address Detail</label>
                                     <input
                                       type="text" value={formData.address}
                                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900"
                                       placeholder="Street name, landmark..."
                                     />
                                  </div>
                               </div>

                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                                  <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none h-32 resize-none font-medium text-slate-600 leading-relaxed"
                                    placeholder="Add any specific details about the property..."
                                  />
                               </div>
                            </div>
                         </motion.div>
                       )}

                       {step === 2 && (
                         <motion.div 
                           key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-10"
                         >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                               <div className="space-y-8">
                                  <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 relative overflow-hidden group">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">MONTHLY RENT (USD)</label>
                                     <div className="relative">
                                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 text-primary/30" />
                                        <input
                                          type="number" required value={formData.rent_amount}
                                          onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
                                          className="w-full bg-transparent border-none text-center outline-none font-black text-7xl text-slate-900 tracking-tighter"
                                          placeholder="0"
                                        />
                                     </div>
                                  </div>

                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                                     <div className="grid grid-cols-3 gap-3">
                                       {(['available', 'occupied', 'maintenance'] as const).map((s) => (
                                         <button
                                           key={s} type="button" onClick={() => setFormData({ ...formData, status: s })}
                                           className={cn(
                                             "py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border",
                                             formData.status === s 
                                              ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                           )}
                                         >
                                            {s}
                                         </button>
                                       ))}
                                     </div>
                                  </div>

                                  <div className="space-y-4">
                                     <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Images</label>
                                        <button
                                          type="button" onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                          className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-all"
                                        >
                                           <Plus className="w-5 h-5" />
                                        </button>
                                     </div>
                                     <div className="space-y-3 max-h-[200px] overflow-y-auto pr-3 no-scrollbar">
                                       {formData.images.map((img, idx) => (
                                         <div key={idx} className="flex gap-2">
                                            <input
                                              type="text" value={img}
                                              onChange={(e) => {
                                                const newImgs = [...formData.images];
                                                newImgs[idx] = e.target.value;
                                                setFormData({ ...formData, images: newImgs });
                                              }}
                                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none focus:border-primary transition-all"
                                              placeholder="Paste image URL here..."
                                            />
                                            <button
                                              type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                              className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                         </div>
                                       ))}
                                     </div>
                                  </div>
                               </div>

                               <div className="space-y-8">
                                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200">
                                     <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-primary" />
                                        Property Specifications
                                     </h4>
                                     <div className="grid grid-cols-2 gap-4">
                                        {formData.property_type === 'Apartment' ? (
                                          <>
                                            <div className="space-y-2">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Bedrooms</label>
                                               <input 
                                                 type="number" value={formData.bedrooms}
                                                 onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
                                                 className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-900"
                                               />
                                            </div>
                                            <div className="space-y-2">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Bathrooms</label>
                                               <input 
                                                 type="number" value={formData.bathrooms}
                                                 onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
                                                 className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-900"
                                               />
                                            </div>
                                            <div className="space-y-2">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Kitchens</label>
                                               <input 
                                                 type="number" value={formData.kitchens}
                                                 onChange={(e) => setFormData({...formData, kitchens: Number(e.target.value)})}
                                                 className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-900"
                                               />
                                            </div>
                                            <div className="space-y-2">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Building No.</label>
                                               <input 
                                                 type="number" value={formData.building_number || ''}
                                                 onChange={(e) => setFormData({...formData, building_number: Number(e.target.value)})}
                                                 className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-900"
                                                 placeholder="Optional"
                                               />
                                            </div>
                                          </>
                                        ) : (
                                          <div className="col-span-2 space-y-2">
                                             <label className="text-[9px] font-black text-slate-400 uppercase">Floor Area (m²)</label>
                                             <input 
                                               type="number" value={formData.floor_area || ''}
                                               onChange={(e) => setFormData({...formData, floor_area: Number(e.target.value)})}
                                               className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 font-black text-2xl text-slate-900"
                                               placeholder="e.g. 150"
                                             />
                                          </div>
                                        )}
                                     </div>
                                  </div>

                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video Tour (URL)</label>
                                     <input
                                       type="text" value={formData.video_url}
                                       onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all font-bold text-slate-900"
                                       placeholder="Youtube or Matterport link..."
                                     />
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>

                 {/* ACTION BAR */}
                 <div className="px-10 py-8 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                    <div>
                       {step > 1 && (
                         <button
                           type="button" onClick={() => setStep(1)}
                           className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-300 transition-all active:scale-95"
                         >
                           <ArrowLeft className="w-4 h-4 mr-2 inline" />
                           Previous
                         </button>
                       )}
                    </div>

                    <div className="flex gap-4">
                       <button
                         type="button" onClick={onClose}
                         className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                       >
                         Cancel
                       </button>
                       {step < 2 ? (
                         <button
                           type="button" onClick={() => setStep(2)}
                           className="px-10 py-4 bg-primary rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                         >
                           Continue
                           <ChevronRight className="w-4 h-4 ml-2 inline" />
                         </button>
                       ) : (
                         <button
                           type="button" onClick={handleSubmit}
                           className="px-12 py-4 bg-primary rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                         >
                           Save Property
                         </button>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
