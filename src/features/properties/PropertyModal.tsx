import { X, Building2, MapPin, DollarSign, Home, Image, Video, Plus, Trash2, Bed, Bath, Utensils, ChevronRight, ArrowLeft, Layers, Maximize2, Hash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const BUILDING_NUMBERS = [1, 2, 3, 5];

const PropertyModal = ({ isOpen, onClose, property }: PropertyModalProps) => {
  const { language, addProperty, updateProperty } = useStore();
  const [districts, setDistricts] = useState<any[]>([]);
  const [step, setStep] = useState<'type' | 'form'>(property ? 'form' : 'type');
  const [activeTab, setActiveTab] = useState<'general' | 'financial' | 'specs' | 'media'>('general');
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

  const selectedTypeConfig = PROPERTY_TYPES.find(t => t.id === formData.property_type)!;

  useEffect(() => {
    fetchDistricts();
    if (property) {
      setStep('form');
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
      setStep('type');
      setActiveTab('general');
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

  // Parent properties filtered by selected type
  const parentProperties = useStore.getState().properties.filter(p =>
    p.property_type === formData.property_type && !p.parent_id
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-white rounded-[3rem] w-full max-w-4xl shadow-[0_32px_128px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden max-h-[90vh] flex flex-col border border-white/20"
          >
            {/* Action Bar Header */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className={cn(
                   "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg transition-all duration-500",
                   selectedTypeConfig.bg,
                   "hover:rotate-6 active:scale-95"
                )}>
                  <selectedTypeConfig.icon className={cn("w-8 h-8", selectedTypeConfig.color)} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                    {property ? 'Edit Operational Asset' : step === 'type' ? 'Initialize New Asset' : `Configure ${formData.property_type}`}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                       System Ready • {step === 'type' ? 'Classification Phase' : 'Configuration Phase'}
                     </p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-slate-200/50 rounded-full text-slate-400 transition-all active:scale-75">
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Navigation Tabs (Only in form step) */}
            {step === 'form' && (
              <div className="px-10 py-4 bg-white border-b border-slate-50 flex gap-8 overflow-x-auto no-scrollbar">
                {[
                  { id: 'general', label: 'Identity', icon: Building2 },
                  { id: 'financial', label: 'Financials', icon: DollarSign },
                  { id: 'specs', label: 'Specs', icon: Maximize2 },
                  { id: 'media', label: 'Multimedia', icon: Image },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 pb-3 border-b-2 px-1 transition-all text-[10px] font-black uppercase tracking-widest outline-none",
                      activeTab === tab.id 
                        ? "border-primary text-primary" 
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content Hub */}
            <div className="overflow-y-auto flex-1 p-10 bg-gradient-to-br from-white to-slate-50/30">
              <AnimatePresence mode="wait">
                {step === 'type' ? (
                  <motion.div
                    key="type-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFormData(fd => ({ ...fd, property_type: type.id as any }));
                          setStep('form');
                        }}
                        className={cn(
                          "relative text-left p-8 rounded-[2.5rem] border-2 transition-all group flex flex-col gap-6 overflow-hidden",
                          type.border,
                          "hover:shadow-2xl hover:border-primary/20 bg-white"
                        )}
                      >
                        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 transition-all group-hover:scale-110", type.bg)}>
                          <type.icon className={cn("w-10 h-10", type.color)} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-2xl tracking-tighter">
                            {language === 'so' ? type.labelSo : type.label}
                          </h3>
                          <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                            {language === 'so' ? type.descSo : type.description}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Select Type</span>
                           <div className="p-2 rounded-full bg-slate-900 text-white group-hover:bg-primary transition-colors">
                              <ChevronRight className="w-4 h-4" />
                           </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    {/* General Section */}
                    {activeTab === 'general' && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Asset Nomenclature</label>
                             <div className="relative group">
                               <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                               <input
                                 type="text"
                                 required
                                 value={formData.name}
                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                 className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-700 shadow-sm"
                                 placeholder="e.g. Al-Hayat Tower Section B"
                               />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Geographic district</label>
                             <div className="relative group">
                               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                               <select
                                 required
                                 value={formData.district_id}
                                 onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                                 className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-700 shadow-sm appearance-none cursor-pointer"
                               >
                                 <option value="">Select District</option>
                                 {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                               </select>
                             </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Physical Location</label>
                           <input
                             type="text"
                             value={formData.address}
                             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                             className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-700 shadow-sm"
                             placeholder="Maka Al Mukarama St, Near Sahafi Hotel"
                           />
                        </div>

                        {formData.property_type === 'Apartment' && (
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Structural Classification (Building #)</label>
                            <div className="flex gap-4">
                              {BUILDING_NUMBERS.map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, building_number: num })}
                                  className={cn(
                                    "flex-1 py-5 rounded-2xl font-black text-sm transition-all border flex items-center justify-center gap-3",
                                    formData.building_number === num
                                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 scale-105"
                                      : "bg-white text-slate-400 border-slate-200 hover:border-primary/40 hover:text-primary shadow-sm"
                                  )}
                                >
                                  <Hash className="w-4 h-4" />
                                  BUILDING {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Financial Section */}
                    {activeTab === 'financial' && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Yield / Monthly Revenue ($)</label>
                               <div className="relative group">
                                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 transition-colors" />
                                 <input
                                   type="number"
                                   required
                                   value={formData.rent_amount}
                                   onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
                                   className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-12 pr-6 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-black text-2xl text-emerald-600 shadow-sm"
                                 />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational State</label>
                               <div className="grid grid-cols-3 gap-3 h-full">
                                 {(['available', 'occupied', 'maintenance'] as const).map((s) => (
                                   <button
                                     key={s}
                                     type="button"
                                     onClick={() => setFormData({ ...formData, status: s })}
                                     className={cn(
                                       "py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm",
                                       formData.status === s
                                         ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                                         : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                     )}
                                   >
                                     {s}
                                   </button>
                                 ))}
                               </div>
                            </div>
                         </div>

                         {(parentProperties.length > 0 || formData.parent_id) && (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Portfolio Hierarchy (Parent Asset)</label>
                              <div className="relative group">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <select
                                  value={formData.parent_id}
                                  onChange={(e) => {
                                    const parent = useStore.getState().properties.find(p => p.id === e.target.value);
                                    setFormData({
                                      ...formData,
                                      parent_id: e.target.value,
                                      district_id: parent?.district_id || formData.district_id,
                                      address: parent?.address || formData.address
                                    });
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-700 shadow-sm appearance-none cursor-pointer"
                                >
                                  <option value="">Independent Asset (Master)</option>
                                  {parentProperties.map(p => <option key={p.id} value={p.id}>{p.name} ({p.district})</option>)}
                                </select>
                              </div>
                           </div>
                         )}
                      </div>
                    )}

                    {/* Specs Section */}
                    {activeTab === 'specs' && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        {formData.property_type === 'Apartment' ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { key: 'bedrooms', label: 'Bedrooms', icon: Bed, color: 'text-blue-500' },
                              { key: 'bathrooms', label: 'Bathrooms', icon: Bath, color: 'text-sky-500' },
                              { key: 'kitchens', label: 'Kitchens', icon: Utensils, color: 'text-indigo-500' },
                            ].map(item => (
                              <div key={item.key} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                   <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                                      <item.icon className="w-5 h-5" />
                                   </div>
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</label>
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  value={(formData as any)[item.key]}
                                  onChange={(e) => setFormData({ ...formData, [item.key]: Number(e.target.value) })}
                                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-xl font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-4">
                             <div className="flex items-center gap-4 mb-2">
                               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem]">
                                 <Maximize2 className="w-8 h-8" />
                               </div>
                               <div>
                                 <h4 className="font-black text-slate-900 tracking-tighter text-xl text-emerald-800">Dimensional Analytics</h4>
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Physical Floor footprint in square meters</p>
                               </div>
                             </div>
                             <div className="relative group">
                               <input
                                 type="number"
                                 min="0"
                                 value={formData.floor_area || ''}
                                 onChange={(e) => setFormData({ ...formData, floor_area: Number(e.target.value) || null })}
                                 className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-6 px-8 text-4xl font-black outline-none focus:ring-12 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-800"
                                 placeholder="0.00"
                               />
                               <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl italic pointer-events-none">Metric Meters (m²)</span>
                             </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Media Section */}
                    {activeTab === 'media' && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Visual Asset Management */}
                            <div className="space-y-6">
                               <div className="flex items-center justify-between">
                                 <div>
                                    <h4 className="font-black text-slate-900 tracking-tighter text-xl">Photographic Data</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Global Content Delivery (URLs)</p>
                                 </div>
                                 <button
                                   type="button"
                                   onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                   className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all active:scale-90"
                                 >
                                    <Plus className="w-5 h-5" />
                                 </button>
                               </div>
                               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                 {formData.images.map((img, idx) => (
                                   <div key={idx} className="flex gap-3 group animate-in slide-in-from-left-4">
                                     <div className="relative flex-1">
                                       <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                       <input
                                         type="text"
                                         value={img}
                                         onChange={(e) => {
                                           const newImgs = [...formData.images];
                                           newImgs[idx] = e.target.value;
                                           setFormData({ ...formData, images: newImgs });
                                         }}
                                         className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-xs font-black outline-none focus:border-primary transition-all shadow-sm"
                                         placeholder="Image Resource URL..."
                                       />
                                     </div>
                                     <button
                                       type="button"
                                       onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                       className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all active:scale-90"
                                     >
                                       <Trash2 className="w-5 h-5" />
                                     </button>
                                   </div>
                                 ))}
                                 {formData.images.length === 0 && (
                                   <div className="h-40 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-3 grayscale opacity-50">
                                      <Image className="w-12 h-12" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">No Visual Assets Identified</span>
                                   </div>
                                 )}
                               </div>
                            </div>

                            {/* Multimedia Integration */}
                            <div className="space-y-8">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Immersive Video Tour (URL)</label>
                                  <div className="relative group">
                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500 transition-colors" />
                                    <input
                                      type="text"
                                      value={formData.video_url}
                                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 transition-all font-black text-slate-700 shadow-sm"
                                      placeholder="https://youtube.com/watch?v=..."
                                    />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Executive Asset Briefing</label>
                                  <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-[2rem] py-5 px-6 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-700 shadow-sm h-48 resize-none leading-relaxed"
                                    placeholder="Provide detailed intelligence on asset features, renovations, and strategic value..."
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Operational Actions */}
                    <div className="flex gap-6 pt-10 border-t border-slate-100">
                      {!property && (
                        <button
                          type="button"
                          onClick={() => setStep('type')}
                          className="px-10 py-5 bg-white border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-400 rounded-3xl hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 shadow-sm"
                        >
                          <ArrowLeft className="w-5 h-5 mr-3 inline" />
                          Back to Discovery
                        </button>
                      )}
                      
                      <div className="flex-1" />

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-10 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 rounded-3xl hover:text-slate-600 transition-all active:scale-95"
                      >
                        Cancel Deployment
                      </button>

                      <button
                        type="submit"
                        className={cn(
                          "px-12 py-5 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-3xl shadow-2xl transition-all hover:scale-[1.05] active:scale-95 border-none",
                          selectedTypeConfig.activeBg
                        )}
                      >
                        {property ? 'Synchronize Asset Data' : `Finalize ${formData.property_type.toUpperCase()} DEPLOYMENT`}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
