import { 
  Building2, 
  Plus, 
  Filter, 
  Search, 
  MapPin, 
  TrendingUp, 
  ChevronRight,
  Edit,
  Trash2,
  RefreshCw,
  Play,
  Image as ImageIcon,
  Bed,
  Bath,
  Utensils,
  FolderTree,
  ArrowLeft,
  Home,
  Layers,
  Maximize2,
  Hash
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import PropertyModal from './PropertyModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
  }
};

const TYPE_META: Record<string, { color: string; bg: string; border: string; icon: any; gradient: string }> = {
  'Apartment': {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    gradient: 'from-blue-500/20 to-indigo-500/10',
    icon: Layers,
  },
  'Villa': {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    icon: Home,
  },
  'Normal House': {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    gradient: 'from-amber-500/20 to-orange-500/10',
    icon: Building2,
  },
};

const DISTRICTS = [
  'All Districts', 'Hodan', 'Wadajir', 'Karaan', 'Yaqshid', 'Xamar Weyne',
  'Daynile', 'Heliwa', 'Huriwaa', 'Kaxda', 'Bondhere',
  'Daarusalaam', 'Garasbaaleey'
];

const PropertiesPage = () => {
  const { language, properties, deleteProperty, fetchData, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingParentId, setViewingParentId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('All Districts');

  useEffect(() => {
    fetchData();
  }, []);

  const currentParent = viewingParentId ? properties.find(p => p.id === viewingParentId) : null;

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParent = viewingParentId ? p.parent_id === viewingParentId : !p.parent_id;
    const matchesType = typeFilter === 'all' || p.property_type === typeFilter;
    const matchesDistrict = districtFilter === 'All Districts' || p.district === districtFilter;
    return matchesSearch && matchesParent && matchesType && matchesDistrict;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto gurigan?' : 'Are you sure you want to delete this property?')) {
      await deleteProperty(id);
    }
  };

  const handleEdit = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Maamulka Guryaha' : 'Property Management'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Maamul guryahaaga, kireyayaasha, iyo dakhliga.' : 'Apartments, Villas & Houses across Mogadishu.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {viewingParentId && (
            <button
              onClick={() => setViewingParentId(null)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-primary transition-all flex items-center gap-2 font-bold shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'so' ? 'Dib u laabo' : 'Back'}
            </button>
          )}
          <button
            onClick={() => fetchData()}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all hover:bg-slate-50 shadow-sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleAdd} className="btn-primary shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            {language === 'so' ? 'Ku dar Guri' : 'Add Property'}
          </button>
        </div>
      </motion.div>

      {/* Breadcrumb / Drill-down */}
      <AnimatePresence>
        {viewingParentId && currentParent && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10"
          >
            <FolderTree className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-slate-800">{currentParent.name}</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                {language === 'so' ? 'Waxaad eegaysaa qaybaha hoos yimaada' : 'Viewing sections inside this property'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: language === 'so' ? 'Wadarta' : 'Total Units', value: properties.filter(p => !p.parent_id).length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Apartments', value: properties.filter(p => p.property_type === 'Apartment' && !p.parent_id).length, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Villas', value: properties.filter(p => p.property_type === 'Villa').length, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Normal Houses', value: properties.filter(p => p.property_type === 'Normal House').length, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div variants={itemVariants} key={i} className="glass-card p-4 flex items-center gap-4 border-slate-100 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Type Pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: language === 'so' ? 'Dhammaan' : 'All Types', icon: Building2 },
            { id: 'Apartment', label: language === 'so' ? 'Qolal' : 'Apartments', icon: Layers },
            { id: 'Villa', label: language === 'so' ? 'Fillooyin' : 'Villas', icon: Home },
            { id: 'Normal House', label: language === 'so' ? 'Guryo' : 'Houses', icon: Building2 },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
                typeFilter === t.id
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & District */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={language === 'so' ? 'Ka raadi magaca ama degmada...' : 'Search by name or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-white border border-slate-200 pl-9 pr-4 py-3 rounded-2xl font-bold text-slate-600 outline-none focus:ring-4 focus:ring-primary/5 appearance-none shadow-sm"
              >
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              {language === 'so' ? 'Shaandheey' : 'Filter'}
            </button>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="font-bold animate-pulse">{language === 'so' ? 'Waa la soo raryaa...' : 'Fetching properties...'}</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-300">
          <Building2 className="w-16 h-16" />
          <p className="font-bold text-slate-400">{language === 'so' ? 'Ma jiro guri la helay.' : 'No properties found.'}</p>
          <button onClick={handleAdd} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            {language === 'so' ? 'Ku dar Guri' : 'Add First Property'}
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProperties.map((property) => {
            const typeMeta = TYPE_META[property.property_type] || TYPE_META['Normal House'];
            const TypeIcon = typeMeta.icon;
            const sectionCount = properties.filter(p => p.parent_id === property.id).length;

            return (
              <motion.div
                variants={itemVariants}
                key={property.id}
                className="glass-card group hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden border-slate-100 flex flex-col"
              >
                {/* Type accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${typeMeta.gradient.replace('/20','').replace('/10','')}`} />

                {/* Image/Thumbnail */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {/* Badges top-right */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm border ${
                      property.status === 'occupied' ? 'bg-emerald-500/90 text-white border-emerald-400' :
                      property.status === 'maintenance' ? 'bg-amber-500/90 text-white border-amber-400' :
                      'bg-blue-500/90 text-white border-blue-400'
                    }`}>
                      {property.status}
                    </span>
                    {property.video_url && (
                      <div className="bg-red-500/90 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-bold border border-red-400 flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        TOUR
                      </div>
                    )}
                    {sectionCount > 0 && (
                      <div className="bg-primary/90 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-bold border border-primary/40 flex items-center gap-1">
                        <FolderTree className="w-2.5 h-2.5" />
                        {sectionCount} SECTIONS
                      </div>
                    )}
                  </div>

                  {/* Badges bottom-left */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center">
                    <div className={`flex items-center gap-1.5 ${typeMeta.bg} ${typeMeta.color} px-2 py-1.5 rounded-lg text-[10px] font-bold backdrop-blur-md border ${typeMeta.border}`}>
                      <TypeIcon className="w-3 h-3" />
                      {property.property_type}
                      {property.building_number && (
                        <span className="ml-1 flex items-center gap-0.5 text-blue-500 font-black">
                          <Hash className="w-2.5 h-2.5" />{property.building_number}
                        </span>
                      )}
                    </div>
                    {property.images && property.images.length > 0 && (
                      <div className="bg-slate-900/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-white/10 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {property.images.length}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${typeMeta.gradient} flex items-center justify-center`}>
                        <TypeIcon className="w-14 h-14 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg line-clamp-1">{property.name}</h3>
                      <div className="flex items-center gap-1 text-slate-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-bold uppercase tracking-wider line-clamp-1">{property.district}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(property)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                    {property.property_type === 'Apartment' ? (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Bed className="w-4 h-4 text-blue-300" />
                          <span className="text-xs font-bold">{property.bedrooms}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">BD</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Bath className="w-4 h-4 text-blue-300" />
                          <span className="text-xs font-bold">{property.bathrooms}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">BT</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Utensils className="w-4 h-4 text-blue-300" />
                          <span className="text-xs font-bold">{property.kitchens}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">KT</span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Maximize2 className={`w-4 h-4 ${property.property_type === 'Villa' ? 'text-emerald-300' : 'text-amber-300'}`} />
                          <span className="text-xs font-bold">
                            {property.floor_area ? `${property.floor_area} m²` : 'N/A'}
                            <span className="text-[10px] ml-0.5 text-slate-400 font-medium"> Area</span>
                          </span>
                        </div>
                        {sectionCount > 0 && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Layers className={`w-4 h-4 ${property.property_type === 'Villa' ? 'text-emerald-300' : 'text-amber-300'}`} />
                            <span className="text-xs font-bold">{sectionCount}<span className="text-[10px] ml-0.5 text-slate-400 font-medium"> Sections</span></span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Qiimaha Bishii' : 'Monthly Rent'}</p>
                      <p className="text-xl font-black text-primary">${property.rent_amount.toLocaleString()}</p>
                    </div>
                    {!property.parent_id ? (
                      <button
                        onClick={() => setViewingParentId(property.id)}
                        className={`px-4 py-2 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 hover:scale-[1.04] ${
                          property.property_type === 'Villa' ? 'bg-emerald-600 shadow-emerald-500/20' :
                          property.property_type === 'Normal House' ? 'bg-amber-600 shadow-amber-500/20' :
                          'bg-blue-600 shadow-blue-500/20'
                        }`}
                      >
                        <FolderTree className="w-3 h-3" />
                        {language === 'so' ? 'EEG QAYBAHA' : 'VIEW SECTIONS'}
                      </button>
                    ) : (
                      <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default PropertiesPage;
