import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter,
  Trash2,
  Edit,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
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
            <Wrench className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Dayactirka' : 'Maintenance'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Maamul codsiyada dayactirka iyo hagaajinta.' : 'Oversee repair requests and work orders.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchData()}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all hover:bg-slate-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleAdd} className="btn-primary">
            <Plus className="w-5 h-5" />
            {language === 'so' ? 'Cudsi Cusub' : 'New Request'}
          </button>
        </div>
      </motion.div>

      {/* Overview */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: language === 'so' ? 'Wali Maqan' : 'Pending', value: maintenance.filter(m => m.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: language === 'so' ? 'Socda' : 'In Progress', value: maintenance.filter(m => m.status === 'in_progress').length , color: 'text-blue-600', bg: 'bg-blue-50', icon: Wrench },
          { label: language === 'so' ? 'La Dhameeyay' : 'Resolved', value: maintenance.filter(m => m.status === 'resolved').length , color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
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

      {/* List */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={language === 'so' ? 'Ka raadi magaca ama guriga...' : 'Search requests...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            {language === 'so' ? 'Shaandheey' : 'Filter'}
          </button>
        </div>

        {isLoading ? (
           <div className="py-20 text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
              <p className="text-slate-400 font-bold">{language === 'so' ? 'Rarka...' : 'Loading requests...'}</p>
           </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredRequests.map((request) => (
              <motion.div 
                variants={itemVariants} 
                key={request.id} 
                className="glass-card p-5 border-slate-100 group hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      request.priority === 'urgent' ? 'bg-red-50 text-red-600' : 
                      request.priority === 'normal' ? 'bg-blue-50 text-blue-600' : 
                      'bg-slate-50 text-slate-600'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        request.priority === 'urgent' ? 'text-red-600' : 'text-slate-400'
                      }`}>
                        {request.priority} PRIORITY
                      </span>
                      <h3 className="font-bold text-slate-900 leading-tight">{request.title}</h3>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(request)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-primary transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(request.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">{request.property}</span>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    request.status === 'resolved' ? 'bg-emerald-500 text-white' : 
                    request.status === 'in_progress' ? 'bg-blue-500 text-white' : 
                    'bg-amber-500 text-white'
                  }`}>
                    {request.status}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredRequests.length === 0 && (
              <div className="md:col-span-2 py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No maintenance requests found.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <MaintenanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedRequest} 
      />
    </div>
  );
};

export default MaintenancePage;
