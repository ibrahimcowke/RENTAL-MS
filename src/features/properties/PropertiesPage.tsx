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
  Utensils
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import PropertyModal from './PropertyModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
};

const PropertiesPage = () => {
  const { language, properties, deleteProperty, fetchData, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {language === 'so' ? 'Maamul guryahaaga, kireyayaasha, iyo dakhliga ka soo baxa.' : 'Organize and track your units across all districts.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchData()}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all hover:bg-slate-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleAdd} className="btn-primary">
            <Plus className="w-5 h-5" />
            {language === 'so' ? 'Ku dar Guri' : 'Add Property'}
          </button>
        </div>
      </motion.div>

      {/* Stats Quick View */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: language === 'so' ? 'Wadarta Guryaha' : 'Total Units', value: properties.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: language === 'so' ? 'Deggan' : 'Occupied', value: properties.filter(p => p.status === 'occupied').length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: language === 'so' ? 'Bannaan' : 'Available', value: properties.filter(p => p.status === 'available').length, icon: ChevronRight, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: language === 'so' ? 'Dayactir' : 'Maintenance', value: properties.filter(p => p.status === 'maintenance').length, icon: MapPin, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <motion.div variants={itemVariants} key={i} className="glass-card p-4 flex items-center gap-4 border-slate-100">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Search */}
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
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
            {language === 'so' ? 'Shaandheey' : 'Filter'}
          </button>
          <select className="bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-600 outline-none focus:ring-4 focus:ring-primary/5">
            <option>{language === 'so' ? 'Dhammaan Degmooyinka' : 'All Districts'}</option>
            <option>Hodan</option>
            <option>Wadajir</option>
            <option>Karaan</option>
          </select>
        </div>
      </div>

      {/* Property Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="font-bold animate-pulse">{language === 'so' ? 'Waa la soo raryaa...' : 'Fetching properties...'}</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProperties.map((property) => (
            <motion.div variants={itemVariants} key={property.id} className="glass-card group hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden border-slate-100 flex flex-col">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {/* Status & Type Badges */}
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
                </div>

                {/* Info & Counter Badges */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-2 py-1 rounded-lg text-[10px] font-bold border border-white/20">
                      {property.property_type}
                    </span>
                    {property.images && property.images.length > 0 && (
                      <div className="bg-slate-900/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-white/10 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {property.images.length}
                      </div>
                    )}
                </div>

                {/* Display Image */}
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
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
              </div>
              
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
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Specs Row */}
                <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Bed className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold">{property.bedrooms}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">BD</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Bath className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold">{property.bathrooms}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">BT</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Utensils className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold">{property.kitchens}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">KT</span></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Qiimaha Bishii' : 'Monthly Rent'}</p>
                    <p className="text-xl font-bold text-primary">${property.rent_amount}</p>
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-transparent group-hover:border-primary/20">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
