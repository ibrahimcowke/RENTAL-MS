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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Decorative gradient header */}
            <div className={`h-2 w-full bg-gradient-to-r ${
              formData.property_type === 'Villa' ? 'from-emerald-500 to-teal-400' :
              formData.property_type === 'Normal House' ? 'from-amber-500 to-orange-400' :
              'from-blue-500 to-indigo-500'
            } transition-all duration-500`} />

            {/* Header */}
            <div className="px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${selectedTypeConfig.bg} rounded-2xl flex items-center justify-center`}>
                  <selectedTypeConfig.icon className={`w-6 h-6 ${selectedTypeConfig.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {property
                      ? (language === 'so' ? 'Wax ka beddel' : 'Edit Property')
                      : step === 'type'
                        ? (language === 'so' ? 'Nooca Guriga' : 'Choose Property Type')
                        : (language === 'so' ? 'Guri Cusub' : `New ${formData.property_type}`)}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {step === 'type'
                      ? (language === 'so' ? 'Xulo nooca guriga adiga leh' : 'Select the type that matches your property')
                      : (language === 'so' ? 'Fadlan geli macluumaadka guriga.' : 'Fill in the property details below.')}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-8">
              <AnimatePresence mode="wait">

                {/* === STEP 1: TYPE SELECTION === */}
                {step === 'type' && (
                  <motion.div
                    key="type-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData(fd => ({ ...fd, property_type: type.id as any }));
                          setStep('form');
                        }}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-5 group ${type.border} hover:shadow-lg`}
                      >
                        <div className={`w-16 h-16 ${type.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <type.icon className={`w-8 h-8 ${type.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-lg">
                              {language === 'so' ? type.labelSo : type.label}
                            </h3>
                            {type.hasBuildings && (
                              <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Buildings 1,2,3,5
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1 font-medium">
                            {language === 'so' ? type.descSo : type.description}
                          </p>
                          {type.hasAmenities && (
                            <div className="flex items-center gap-3 mt-3">
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                <Bed className="w-3 h-3" /> Beds
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                <Bath className="w-3 h-3" /> Toilets
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                <Utensils className="w-3 h-3" /> Kitchen
                              </span>
                            </div>
                          )}
                          {!type.hasAmenities && (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                <Maximize2 className="w-3 h-3" /> Floor Area (m²)
                              </span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className={`w-5 h-5 ${type.color} shrink-0`} />
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* === STEP 2: FORM === */}
                {step === 'form' && (
                  <motion.form
                    key="form-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Back button */}
                    {!property && (
                      <button
                        type="button"
                        onClick={() => setStep('type')}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'so' ? 'Ku laabo noocyada' : 'Back to types'}
                      </button>
                    )}

                    {/* Type badge */}
                    <div className={`flex items-center gap-3 p-4 ${selectedTypeConfig.bg} rounded-2xl border ${selectedTypeConfig.border}`}>
                      <selectedTypeConfig.icon className={`w-5 h-5 ${selectedTypeConfig.color}`} />
                      <span className={`font-bold text-sm ${selectedTypeConfig.color}`}>
                        {language === 'so' ? selectedTypeConfig.labelSo : selectedTypeConfig.label}
                      </span>
                      {formData.property_type === 'Apartment' && (
                        <span className="text-xs text-blue-500 font-medium ml-auto">Has Beds · Toilet · Kitchen</span>
                      )}
                      {formData.property_type !== 'Apartment' && (
                        <span className="text-xs text-slate-500 font-medium ml-auto">Has sections · Floor area</span>
                      )}
                    </div>

                    {/* Section 1: Identity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {language === 'so' ? 'Magaca' : `${formData.property_type} Name`}
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                            placeholder={formData.property_type === 'Apartment' ? 'e.g. Section A3' : formData.property_type === 'Villa' ? 'e.g. Villa Al-Noor' : 'e.g. Hodan Family House'}
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
                            onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium appearance-none"
                          >
                            <option value="">Select District</option>
                            {districts.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Apartment-specific: Building Number */}
                    {formData.property_type === 'Apartment' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Building Number
                        </label>
                        <div className="flex gap-3">
                          {BUILDING_NUMBERS.map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setFormData({ ...formData, building_number: num })}
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
                                formData.building_number === num
                                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.05]'
                                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              <Hash className="w-3.5 h-3.5" />
                              Building {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Parent (Part of a bigger property) */}
                    {(parentProperties.length > 0 || formData.parent_id) && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Part of an existing {formData.property_type}? (Optional)
                        </label>
                        <div className="relative">
                          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium appearance-none"
                          >
                            <option value="">Independent (Top-level)</option>
                            {parentProperties.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.district})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Address / Landmark</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                        placeholder="Maka Al Mukarama St"
                      />
                    </div>

                    {/* Rent & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Monthly Rent ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input
                            type="number"
                            required
                            value={formData.rent_amount}
                            onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold text-emerald-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                        <div className="flex gap-2">
                          {(['available', 'occupied', 'maintenance'] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setFormData({ ...formData, status: s })}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
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

                    {/* === APARTMENT: Amenities === */}
                    {formData.property_type === 'Apartment' && (
                      <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-4">
                        <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          Apartment Section Amenities
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bedrooms</label>
                            <div className="relative">
                              <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                type="number"
                                min="0"
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-400 transition-all text-sm font-medium"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Toilets</label>
                            <div className="relative">
                              <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                type="number"
                                min="0"
                                value={formData.bathrooms}
                                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-400 transition-all text-sm font-medium"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Kitchen</label>
                            <div className="relative">
                              <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                type="number"
                                min="0"
                                value={formData.kitchens}
                                onChange={(e) => setFormData({ ...formData, kitchens: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-400 transition-all text-sm font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* === VILLA / NORMAL HOUSE: Floor Area === */}
                    {formData.property_type !== 'Apartment' && (
                      <div className={`p-5 rounded-2xl border space-y-3 ${
                        formData.property_type === 'Villa' ? 'bg-emerald-50/70 border-emerald-100' : 'bg-amber-50/70 border-amber-100'
                      }`}>
                        <h3 className={`text-sm font-bold flex items-center gap-2 ${
                          formData.property_type === 'Villa' ? 'text-emerald-800' : 'text-amber-800'
                        }`}>
                          <Maximize2 className="w-4 h-4" />
                          Section / Floor Area
                        </h3>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Floor Area (m²)</label>
                          <div className="relative">
                            <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                              type="number"
                              min="0"
                              value={formData.floor_area || ''}
                              onChange={(e) => setFormData({ ...formData, floor_area: Number(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                              placeholder="e.g. 120"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Media Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Image className="w-4 h-4 text-primary" />
                        Multimedia Assets
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image URLs */}
                        <div className="space-y-3">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Property Images (URLs)</label>
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={img}
                                onChange={(e) => {
                                  const newImgs = [...formData.images];
                                  newImgs[idx] = e.target.value;
                                  setFormData({ ...formData, images: newImgs });
                                }}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-primary transition-all"
                                placeholder="https://example.com/image.jpg"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                            className="flex items-center gap-2 text-primary font-bold text-xs py-2 px-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all border border-dashed border-primary/20 w-full justify-center"
                          >
                            <Plus className="w-4 h-4" />
                            Add Image URL
                          </button>
                        </div>

                        {/* Video & Description */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Video Tour URL</label>
                            <div className="relative">
                              <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                type="text"
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                                placeholder="https://youtube.com/..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                            <textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-medium h-24 resize-none"
                              placeholder="Describe features, renovations..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-8 py-4 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
                      >
                        {language === 'so' ? 'Ka noqo' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className={`flex-[2] px-8 py-4 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                          formData.property_type === 'Villa' ? 'bg-emerald-600 shadow-emerald-500/20' :
                          formData.property_type === 'Normal House' ? 'bg-amber-600 shadow-amber-500/20' :
                          'bg-blue-600 shadow-blue-500/20'
                        }`}
                      >
                        {property
                          ? (language === 'so' ? 'Cusboonaysii' : 'Update Property')
                          : (language === 'so' ? 'Kaydi Guriga' : `Save ${formData.property_type}`)}
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
