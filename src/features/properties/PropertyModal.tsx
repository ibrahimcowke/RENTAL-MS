import { X, Building2, MapPin, DollarSign, Home, Image, Plus, Trash2, ChevronRight, ArrowLeft, Layers } from 'lucide-react';
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
    hasAmenities: true,
    hasBuildings: true,
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
    hasAmenities: false,
    hasBuildings: false,
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
    hasAmenities: false,
    hasBuildings: false,
  },
] as const;


const PropertyModal = ({ isOpen, onClose, property }: PropertyModalProps) => {
  const { language, addProperty, updateProperty } = useStore();
  const [districts, setDistricts] = useState<any[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(property ? 2 : 1);
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

  const PHASES = [
    { id: 1, label: 'Asset DNA', color: 'indigo', icon: Layers, gradient: 'from-indigo-600/20 to-transparent', glow: 'neon-glow-primary' },
    { id: 2, label: 'Identity', color: 'blue', icon: Building2, gradient: 'from-blue-600/20 to-transparent', glow: 'neon-glow-primary' },
    { id: 3, label: 'Economics', color: 'emerald', icon: DollarSign, gradient: 'from-emerald-600/20 to-transparent', glow: 'neon-glow-emerald' },
    { id: 4, label: 'Visuals', color: 'amber', icon: Image, gradient: 'from-amber-600/20 to-transparent', glow: 'neon-glow-amber' },
  ];

  const activePhase = PHASES.find(p => p.id === step)!;

  useEffect(() => {
    fetchDistricts();
    if (property) {
      setStep(2);
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
      // Clear amenity fields for non-apartment types
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
            className="bg-slate-900 w-full max-w-6xl h-full md:h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col md:rounded-[4rem] border border-white/10"
          >
            {/* 🌈 HYPER-RAINBOW BACKGROUND */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-20 transition-all duration-1000",
              activePhase.gradient
            )} />
            
            <div className="flex flex-1 overflow-hidden relative z-10">
              
              {/* PHASE TRACKER SIDEBAR */}
              <div className="hidden lg:flex w-80 flex-col bg-black/20 backdrop-blur-3xl border-r border-white/5 p-12">
                 <div className="mb-16">
                    <div className="w-16 h-16 rounded-[2rem] bg-emerald-500 neon-glow-emerald flex items-center justify-center mb-6">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter leading-none">
                      Asset<br/>Deployment
                    </h2>
                 </div>

                 <div className="space-y-12">
                    {PHASES.map((phase) => (
                      <div key={phase.id} className="relative">
                         <div className={cn(
                           "flex items-center gap-6 transition-all duration-500",
                           step === phase.id ? "opacity-100 translate-x-3" : "opacity-40"
                         )}>
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                              step === phase.id ? phase.glow + " bg-" + phase.color + "-600" : "bg-white/5"
                            )}>
                               <phase.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Step 0{phase.id}</p>
                               <h4 className="text-sm font-black text-white tracking-widest uppercase">{phase.label}</h4>
                            </div>
                         </div>
                         {phase.id < 4 && (
                           <div className="absolute left-[23px] top-12 w-px h-12 bg-white/10" />
                         )}
                      </div>
                    ))}
                 </div>

                 <div className="mt-auto p-6 hyper-glass rounded-[2rem] border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                      "Every structural detail strengthens the portfolio's integrity."
                    </p>
                 </div>
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 flex flex-col h-full bg-slate-900/40 backdrop-blur-md overflow-hidden">
                 
                 {/* Header */}
                 <div className="px-12 py-10 flex items-center justify-between">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", "bg-" + activePhase.color + "-500")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", "text-" + activePhase.color + "-400")}>
                             {activePhase.label} Matrix
                          </span>
                       </div>
                       <h3 className="text-5xl font-black text-white tracking-tighter">
                          {step === 1 ? 'Asset Discovery' : step === 2 ? 'Identity Profile' : step === 3 ? 'Economics Hub' : 'Visual Payload'}
                       </h3>
                    </div>
                    <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full text-slate-500 transition-all active:scale-75">
                       <X className="w-10 h-10" />
                    </button>
                 </div>

                 {/* Step Content */}
                 <div className="flex-1 overflow-y-auto px-12 pb-12 no-scrollbar">
                    <AnimatePresence mode="wait">
                       {step === 1 && (
                         <motion.div 
                           key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                           className="grid grid-cols-1 md:grid-cols-3 gap-8"
                         >
                            {PROPERTY_TYPES.map((type) => (
                              <button
                                key={type.id}
                                onClick={() => {
                                  setFormData(fd => ({ ...fd, property_type: type.id as any }));
                                  setStep(2);
                                }}
                                className={cn(
                                  "relative text-left p-10 rounded-[3rem] border-2 transition-all group flex flex-col gap-8 overflow-hidden h-96 hyper-glass hover:bg-white/5",
                                  formData.property_type === type.id ? "border-" + activePhase.color + "-500/50" : "border-white/5"
                                )}
                              >
                                <div className={cn("w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6")}>
                                  <type.icon className={cn("w-12 h-12 text-white")} />
                                </div>
                                <div>
                                  <h3 className="font-black text-white text-3xl tracking-tighter mb-4">
                                    {language === 'so' ? type.labelSo : type.label}
                                  </h3>
                                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    {language === 'so' ? type.descSo : type.description}
                                  </p>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                   <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">Select Category</div>
                                   <div className="w-12 h-12 rounded-full hyper-glass flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                      <ChevronRight className="w-6 h-6 text-white" />
                                   </div>
                                </div>
                              </button>
                            ))}
                         </motion.div>
                       )}

                       {step === 2 && (
                         <motion.div 
                           key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="max-w-3xl space-y-12"
                         >
                            <div className="space-y-4">
                               <label className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] ml-1">Asset Nomenclature</label>
                               <div className="relative group">
                                 <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                                 <input
                                   type="text" required value={formData.name}
                                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                   className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:ring-[20px] focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-black text-4xl text-white tracking-tighter placeholder:text-white/10"
                                   placeholder="AL-HAYAT TOWER..."
                                 />
                               </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                               <div className="space-y-4">
                                  <label className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] ml-1">District Node</label>
                                  <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20" />
                                    <select
                                      required value={formData.district_id}
                                      onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-10 outline-none focus:border-blue-500/50 transition-all font-black text-xl text-white appearance-none cursor-pointer"
                                    >
                                      <option value="" className="bg-slate-900">Select Node</option>
                                      {districts.map(d => <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>)}
                                    </select>
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <label className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] ml-1">Physical Address</label>
                                  <input
                                    type="text" value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-10 outline-none focus:border-blue-500/50 transition-all font-black text-xl text-white tracking-tight"
                                    placeholder="Main Street, Near Intersection"
                                  />
                               </div>
                            </div>
                         </motion.div>
                       )}

                       {step === 3 && (
                         <motion.div 
                           key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="max-w-3xl space-y-16"
                         >
                            <div className="p-16 rounded-[4rem] bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden group hover:neon-glow-emerald transition-all duration-700">
                               <label className="text-sm font-black text-emerald-400 uppercase tracking-[0.4em] block mb-8 text-center italic">TARGET MONTHLY REVENUE (USD)</label>
                               <div className="relative">
                                  <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 text-emerald-500/30" />
                                  <input
                                    type="number" required value={formData.rent_amount}
                                    onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
                                    className="w-full bg-transparent border-none text-center outline-none font-black text-[120px] text-white tracking-tighter leading-none"
                                    placeholder="0"
                                  />
                               </div>
                               <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="space-y-6">
                               <label className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] ml-1">Operational Readiness</label>
                               <div className="grid grid-cols-3 gap-8">
                                 {(['available', 'occupied', 'maintenance'] as const).map((s) => (
                                   <button
                                     key={s} type="button" onClick={() => setFormData({ ...formData, status: s })}
                                     className={cn(
                                       "py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border flex flex-col items-center gap-4",
                                       formData.status === s ? "bg-emerald-600 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] text-white scale-105" : "bg-white/5 border-white/10 text-slate-500 hover:border-emerald-500/30"
                                     )}
                                   >
                                      <div className={cn("w-3 h-3 rounded-full", formData.status === s ? "bg-white animate-pulse" : "bg-slate-700")} />
                                      {s}
                                   </button>
                                 ))}
                               </div>
                            </div>
                         </motion.div>
                       )}

                       {step === 4 && (
                         <motion.div 
                           key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                         >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                               <div className="space-y-8">
                                  <div className="flex items-center justify-between">
                                     <h4 className="text-2xl font-black text-white tracking-tighter">Asset Imagery Container</h4>
                                     <button
                                       type="button" onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                       className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center neon-glow-amber text-white transition-all active:scale-75"
                                     >
                                        <Plus className="w-6 h-6" />
                                     </button>
                                  </div>
                                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                                    {formData.images.map((img, idx) => (
                                      <div key={idx} className="flex gap-4">
                                         <input
                                           type="text" value={img}
                                           onChange={(e) => {
                                             const newImgs = [...formData.images];
                                             newImgs[idx] = e.target.value;
                                             setFormData({ ...formData, images: newImgs });
                                           }}
                                           className="flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-8 text-xs font-black text-amber-200 outline-none focus:border-amber-500/50"
                                           placeholder="HTTPS://CDN.RESOURCE..."
                                         />
                                         <button
                                           type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                           className="p-5 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20"
                                         >
                                           <Trash2 className="w-5 h-5" />
                                         </button>
                                      </div>
                                    ))}
                                    {formData.images.length === 0 && (
                                       <div className="h-40 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-4 grayscale">
                                          <Image className="w-12 h-12" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Visual Buffer</span>
                                       </div>
                                    )}
                                  </div>
                               </div>

                               <div className="space-y-8">
                                  <div className="space-y-4">
                                     <label className="text-[11px] font-black text-amber-400 uppercase tracking-[0.4em] ml-1">Structural Briefing</label>
                                     <textarea
                                       value={formData.description}
                                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                       className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 outline-none h-[350px] resize-none font-bold text-slate-300 leading-relaxed text-lg"
                                       placeholder="Provide depth on architectural features and strategic asset value..."
                                     />
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>

                 {/* ACTION MATRIX */}
                 <div className="px-12 py-12 flex items-center justify-between border-t border-white/5 bg-black/20 backdrop-blur-3xl">
                    <div className="flex gap-6">
                       <button
                         type="button" onClick={onClose}
                         className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                       >
                         Abort Mission
                       </button>
                       {step > 1 && (
                         <button
                           type="button" onClick={() => setStep((s) => (s - 1) as any)}
                           className="px-10 py-5 bg-white/5 rounded-3xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10"
                         >
                           <ArrowLeft className="w-5 h-5 mr-3 inline" />
                           Regression
                         </button>
                       )}
                    </div>

                    <div className="flex gap-6">
                       {step < 4 ? (
                         <button
                           type="button" onClick={() => setStep((s) => (s + 1) as any)}
                           className={cn(
                             "px-12 py-6 rounded-3xl text-[11px] font-black text-white uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95",
                             "bg-" + activePhase.color + "-600 " + activePhase.glow
                           )}
                         >
                           Proceed Matrix
                           <ChevronRight className="w-5 h-5 ml-4 inline" />
                         </button>
                       ) : (
                         <button
                           type="button" onClick={handleSubmit}
                           className="px-16 py-6 bg-emerald-600 neon-glow-emerald rounded-3xl text-[11px] font-black text-white uppercase tracking-[0.5em] transition-all hover:scale-110 active:scale-95"
                         >
                           Finalize Deployment
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
