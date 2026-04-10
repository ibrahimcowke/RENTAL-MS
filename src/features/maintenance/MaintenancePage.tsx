import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Trash2, 
  Edit, 
  RefreshCw, 
  Zap, 
  Building2, 
  Filter 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import DashboardStatCard from '../dashboard/DashboardStatCard';
import MaintenanceModal from './MaintenanceModal';

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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
};

const MaintenancePage = () => {
  const { language, maintenance, deleteMaintenance, fetchData, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRequests = maintenance.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto codsigan?' : 'Are you sure you want to delete this restoration request?')) {
      await deleteMaintenance(id);
    }
  };

  const handleEdit = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. CINEMATIC MAINTENANCE HERO */}
      <div className="bg-slate-900 pt-12 pb-32 px-4 md:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="max-w-[1600px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12 relative z-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="px-4 py-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-500/20 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Restoration Network Active</span>
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
               {language === 'so' ? 'Dayactirka' : 'Maintenance'}<br/>
               <span className="text-amber-500 italic">{language === 'so' ? 'Operations' : 'Operations'}</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
               {language === 'so' 
                 ? 'Maamul codsiyada dayactirka iyo hagaajinta leh hufnaan sare iyo xallin degdeg ah.' 
                 : 'High-fidelity operational oversight for repair request lifecycle management and portfolio preservation.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={handleAdd}
                className="px-10 py-6 bg-amber-600 text-white rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all border-none"
             >
                <Plus className="w-6 h-6" />
                {language === 'so' ? 'File Request' : 'File Request'}
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
        
        {/* 2. OPERATIONAL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <DashboardStatCard 
            title={language === 'so' ? 'Codsiyo Cusub' : 'Pending Diagnosis'}
            value={maintenance.filter(m => m.status === 'pending').length.toString()}
            icon={Clock}
            color="bg-amber-500"
            trend={12}
            chartData={Array.from({ length: 15 }, (_, i) => ({ value: 5 + Math.random() * 20 }))}
          />
          <DashboardStatCard 
            title={language === 'so' ? 'Socda' : 'Active Restoration'}
            value={maintenance.filter(m => m.status === 'in_progress').length.toString()}
            icon={Wrench}
            color="bg-blue-600"
            trend={-5}
            chartData={Array.from({ length: 15 }, (_, i) => ({ value: 10 + Math.random() * 15 }))}
          />
          <DashboardStatCard 
            title={language === 'so' ? 'La Xalliyay' : 'Deployment Resolved'}
            value={maintenance.filter(m => m.status === 'resolved').length.toString()}
            icon={CheckCircle2}
            color="bg-emerald-600"
            trend={8}
            chartData={Array.from({ length: 15 }, (_, i) => ({ value: 20 + Math.random() * 50 }))}
          />
        </div>

        {/* 3. REQUEST GRID */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder={language === 'so' ? 'Ka raadi hagaajinta...' : 'Search operational database by title or property...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all shadow-xl text-lg font-bold placeholder:text-slate-300"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-6">
               <RefreshCw className="w-16 h-16 text-amber-500 animate-spin opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Operations</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xl:grid-cols-2 gap-8"
            >
              {filteredRequests.map((request) => (
                <motion.div 
                  variants={itemVariants}
                  key={request.id} 
                  className="glass-zap p-1 group"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 flex flex-col justify-between h-full hover:bg-slate-50 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform border",
                          request.priority === 'urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          request.priority === 'normal' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-slate-50 text-slate-600 border-slate-100'
                        )}>
                          <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                              request.priority === 'urgent' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-500'
                            )}>
                              {request.priority}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-amber-600 transition-colors leading-tight">{request.title}</h3>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleEdit(request)}
                          className="p-4 bg-white border border-slate-100 hover:border-amber-200 rounded-2xl text-slate-400 hover:text-amber-500 transition-all shadow-sm active:scale-75"
                        >
                          <Edit className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => handleDelete(request.id)}
                          className="p-4 bg-white border border-slate-100 hover:border-rose-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm active:scale-75"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-500 font-medium mb-8 leading-relaxed line-clamp-2">
                       {request.description || (language === 'so' ? 'Faahfaahin dheeri ah laguma darin.' : 'No detailed description provided.')}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                           <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Asset</p>
                           <p className="text-xs font-black text-slate-900 tracking-tight">{request.property}</p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all group-hover:scale-105",
                        request.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        request.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                      )}>
                        {request.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredRequests.length === 0 && (
                <div className="col-span-full py-40 text-center glass-zap rounded-[3rem] p-10 bg-slate-50/50 border-2 border-dashed border-slate-200">
                  <Wrench className="w-24 h-24 text-slate-200 mx-auto mb-8" />
                  <h3 className="text-3xl font-black text-slate-400 tracking-tighter uppercase">Operational Peace</h3>
                  <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest">No restoration requests detected in database</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <MaintenanceModal 
            isOpen={true} 
            onClose={() => setIsModalOpen(false)} 
            request={selectedRequest} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaintenancePage;
