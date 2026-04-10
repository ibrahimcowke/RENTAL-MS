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
import DashboardStatCard from '../dashboard/DashboardStatCard';
import { cn } from '../../utils/cn';

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
      {/* Premium Operational Header */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden group rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:rotate-12 transition-transform duration-500">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-[0.2em] mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                REAL-TIME PORTFOLIO INTELLIGENCE
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white transition-all group-hover:tracking-normal whitespace-nowrap">
                {language === 'so' ? 'Maamulka Guryaha' : 'Property Inventory'}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">
                {language === 'so' ? 'Maamul guryahaaga iyo dakhliga.' : 'Strategic Asset Management & Oversight'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewingParentId && (
              <button
                onClick={() => setViewingParentId(null)}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 backdrop-blur-xl border border-white/10 shadow-lg active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'so' ? 'Dib u laabo' : 'Back to Top'}
              </button>
            )}
            <button
               onClick={() => fetchData()}
               className="p-3.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-2xl transition-all border border-white/10 backdrop-blur-xl active:scale-90"
               disabled={isLoading}
             >
               <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
            <button 
              onClick={handleAdd} 
              className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-primary/20 active:scale-95 border-none"
            >
              <Plus className="w-5 h-5" />
              {language === 'so' ? 'Ku dar Guri' : 'Initialize Asset'}
            </button>
          </div>
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

      {/* Real-time Insights Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardStatCard
          title={language === 'so' ? 'Dhammaan Guryaha' : 'Total Managed Units'}
          value={properties.filter(p => !p.parent_id).length.toString()}
          trend={12}
          icon={Building2}
          color="bg-blue-600"
          chartData={Array.from({ length: 15 }, () => ({ value: 5 + Math.random() * 20 }))}
        />
        <DashboardStatCard
          title="Luxury Villas"
          value={properties.filter(p => p.property_type === 'Villa').length.toString()}
          trend={5}
          icon={Home}
          color="bg-emerald-600"
          chartData={Array.from({ length: 15 }, () => ({ value: 10 + Math.random() * 15 }))}
        />
        <DashboardStatCard
          title="Multi-Unit Apartments"
          value={properties.filter(p => p.property_type === 'Apartment' && !p.parent_id).length.toString()}
          trend={8}
          icon={Layers}
          color="bg-indigo-600"
          chartData={Array.from({ length: 15 }, () => ({ value: 20 + Math.random() * 50 }))}
        />
        <DashboardStatCard
          title="Operational Revenue"
          value={`$${properties.reduce((sum, p) => sum + (p.rent_amount || 0), 0).toLocaleString()}`}
          trend={15}
          icon={TrendingUp}
          color="bg-amber-500"
          chartData={Array.from({ length: 15 }, () => ({ value: 30 + Math.random() * 40 }))}
        />
      </motion.div>

      {/* Enhanced Filters */}
      <div className="space-y-6">
        {/* Type Selection */}
        <div className="flex gap-3 flex-wrap">
          {[
            { id: 'all', label: language === 'so' ? 'Dhammaan' : 'All Assest', icon: Building2 },
            { id: 'Apartment', label: language === 'so' ? 'Qolal' : 'Apartments', icon: Layers },
            { id: 'Villa', label: language === 'so' ? 'Fillooyin' : 'Villas', icon: Home },
            { id: 'Normal House', label: language === 'so' ? 'Guryo' : 'Houses', icon: Building2 },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                typeFilter === t.id
                  ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.05]'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-primary/40 hover:text-primary backdrop-blur-xl'
              }`}
            >
              <t.icon className={cn("w-4 h-4 transition-transform group-hover:rotate-12", typeFilter === t.id ? "text-white" : "text-slate-300")} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Global Hub Search */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={language === 'so' ? 'Ka raadi magaca ama degmada...' : 'Global search by asset name or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all shadow-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-white border border-slate-200 pl-11 pr-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 outline-none focus:ring-8 focus:ring-primary/5 appearance-none shadow-sm cursor-pointer hover:border-primary/40 transition-all"
              >
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button className="flex items-center gap-3 bg-slate-900 border-none text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
              <Filter className="w-4 h-4" />
              {language === 'so' ? 'SHAANDHEEY' : 'APPLY FILTERS'}
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

            return (
              <motion.div
                variants={itemVariants}
                key={property.id}
                className="relative flex flex-col group rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${typeMeta.gradient.replace('/20','').replace('/10','')}`} />

                {/* Media Section */}
                <div className="aspect-[16/10] relative overflow-hidden m-2 rounded-[2rem]">
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border-none shadow-lg ${
                      property.status === 'occupied' ? 'bg-emerald-500 text-white' :
                      property.status === 'maintenance' ? 'bg-orange-500 text-white' :
                      'bg-sky-500 text-white'
                    }`}>
                      {property.status}
                    </span>
                    <div className="bg-white/90 backdrop-blur-xl text-slate-900 px-3 py-1.5 rounded-2xl text-[9px] font-black border border-white/20 flex items-center gap-1.5 shadow-sm">
                      <TypeIcon className={cn("w-3.5 h-3.5", typeMeta.color)} />
                      {property.property_type.toUpperCase()}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {property.video_url && (
                      <div className="bg-rose-500 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Pricing Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 px-4 shadow-2xl">
                       <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-0.5">Asset Valuation</p>
                       <p className="text-xl font-black text-white">${property.rent_amount.toLocaleString()}</p>
                    </div>
                    {property.images && property.images.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[10px] font-black border border-white/20 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {property.images.length}
                      </div>
                    )}
                  </div>

                  {/* Main Image */}
                  <div className="w-full h-full group-hover:scale-110 transition-transform duration-1000">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${typeMeta.gradient} flex items-center justify-center`}>
                        <Building2 className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                </div>

                {/* Content Hub */}
                <div className="p-6 pt-2 flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-xl tracking-tighter leading-none group-hover:text-primary transition-colors">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{property.district}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleEdit(property)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(property.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>

                  {/* Specs Intelligence Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {property.property_type === 'Apartment' ? (
                      <>
                        <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                           <Bed className="w-4 h-4 text-blue-500" />
                           <span className="text-sm font-black text-slate-700">{property.bedrooms} BD</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                           <Bath className="w-4 h-4 text-blue-500" />
                           <span className="text-sm font-black text-slate-700">{property.bathrooms} BT</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                           <Utensils className="w-4 h-4 text-blue-500" />
                           <span className="text-sm font-black text-slate-700">{property.kitchens} KT</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2 flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                           <Maximize2 className={cn("w-5 h-5", typeMeta.color)} />
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Area</p>
                              <p className="text-sm font-black text-slate-700">{property.floor_area || '--'} m²</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                           <FolderTree className={cn("w-5 h-5", typeMeta.color)} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Interactive Control Footer */}
                  <div className="mt-auto pt-4 border-t border-slate-50">
                    {!property.parent_id ? (
                      <button
                        onClick={() => setViewingParentId(property.id)}
                        className={cn(
                          "w-full py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.25em] text-white shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95",
                          typeMeta.gradient.replace('/20','').replace('/10','').replace('from-','bg-')
                        )}
                      >
                        Explore Asset Sections
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                               <Hash className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Detail</span>
                         </div>
                         <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-lg active:scale-90">
                           <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
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
