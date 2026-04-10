import { 
  Users, 
  Search, 
  Phone, 
  Star, 
  UserPlus, 
  ChevronRight,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';
import TenantModal from './TenantModal';
import DashboardStatCard from '../dashboard/DashboardStatCard';
import { cn } from '../../utils/cn';

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

const TenantsPage = () => {
  const { language, tenants, deleteTenant, fetchData, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto kireeyahan?' : 'Are you sure you want to delete this tenant?')) {
      await deleteTenant(id);
    }
  };

  const handleEdit = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTenant(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. CINEMATIC ZAP HEADER */}
      <div className="bg-slate-900 pt-12 pb-32 px-4 md:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="max-w-[1600px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12 relative z-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/20 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Resident Network Active</span>
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
               {language === 'so' ? 'Kireystayaasha' : 'Resident'}<br/>
               <span className="text-primary italic">{language === 'so' ? 'Intelligence' : 'Intelligence'}</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
               {language === 'so' 
                 ? 'Maamul profile-yada kireystayaashaada leh xog hufan iyo qiimeyn saxsan.' 
                 : 'Enterprise resident lifecycle management with real-time reliability indexing and historical tracking.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={handleAdd}
                className="px-10 py-6 bg-primary text-white rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all border-none"
             >
                <UserPlus className="w-6 h-6" />
                {language === 'so' ? 'Add New Resident' : 'Add New Resident'}
             </button>
             <button 
                onClick={() => fetchData()}
                className="p-6 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-white/10 transition-all backdrop-blur-xl"
             >
                <RefreshCw className={cn("w-6 h-6", isLoading && "animate-spin")} />
             </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-20 relative z-20">
        
        {/* 2. PREMIUM STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { 
              title: language === 'so' ? 'Wadarta Kireystayaasha' : 'Active Residents', 
              value: tenants.length.toString(), 
              icon: Users, 
              color: 'bg-slate-900',
              trend: 5,
              chartData: Array.from({ length: 15 }, (_, i) => ({ value: 10 + Math.random() * 20 }))
            },
            { 
              title: language === 'so' ? 'Reliability Celcelis' : 'Mean Reliability', 
              value: '98%', 
              icon: Star, 
              color: 'bg-primary',
              trend: 2,
              chartData: Array.from({ length: 15 }, (_, i) => ({ value: 90 + Math.random() * 10 }))
            },
            { 
              title: language === 'so' ? 'Lease Health' : 'Lease Velocity', 
              value: 'Elite', 
              icon: ChevronRight, 
              color: 'bg-emerald-600',
              trend: 12,
              chartData: Array.from({ length: 15 }, (_, i) => ({ value: 50 + Math.random() * 50 }))
            },
          ].map((stat, i) => (
             <DashboardStatCard key={i} {...stat} />
          ))}
        </div>

        {/* 3. CONTROL CENTER & LIST */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder={language === 'so' ? 'Ka raadi kireeyaha...' : 'Search resident database by name or phone...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-xl text-lg font-bold placeholder:text-slate-300"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-6">
               <RefreshCw className="w-16 h-16 text-primary animate-spin opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Records</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xl:grid-cols-2 gap-8"
            >
              {filteredTenants.map((tenant) => (
                <motion.div 
                  variants={itemVariants}
                  key={tenant.id} 
                  className="glass-zap p-1 group"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-slate-900 rounded-[2.2rem] flex items-center justify-center text-4xl font-black text-white relative overflow-hidden group-hover:rotate-6 transition-transform shadow-2xl">
                         <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 group-hover:text-primary transition-colors">{tenant.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-slate-400">
                          <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest"><Phone className="w-3.5 h-3.5" /> {tenant.phone}</span>
                          <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest"><Users className="w-3.5 h-3.5" /> {tenant.familySize} Members</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-none pt-8 md:pt-0">
                      <div className="text-right flex-1 md:flex-none">
                        <div className="flex items-center gap-1.5 justify-end mb-1">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="text-2xl font-black text-slate-900 tracking-tighter">{tenant.reliability}%</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reliability Index</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(tenant)}
                          className="p-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm"
                        >
                          <Edit className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tenant.id)}
                          className="p-4 bg-slate-50 hover:bg-rose-500 hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredTenants.length === 0 && (
                <div className="col-span-full py-40 text-center glass-zap rounded-[3rem] p-10 bg-slate-50/50 border-2 border-dashed border-slate-200">
                  <Users className="w-24 h-24 text-slate-200 mx-auto mb-8" />
                  <h3 className="text-3xl font-black text-slate-400 tracking-tighter uppercase">No Records Found</h3>
                  <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest">Database query returned zero entries</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TenantModal 
            isOpen={true} 
            onClose={() => setIsModalOpen(false)} 
            tenant={selectedTenant} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantsPage;
