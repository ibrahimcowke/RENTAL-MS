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
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import TenantModal from './TenantModal';

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
            <Users className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Maamulka Kireystayaasha' : 'Tenant Management'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'La soco kireystayaashaada iyo dakhligooda.' : 'Manage tenant profiles and reliability scores.'}
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
            <UserPlus className="w-5 h-5" />
            {language === 'so' ? 'Ku dar Kireeye' : 'Add Tenant'}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: language === 'so' ? 'Wadarta Kireystayaasha' : 'Total Tenants', value: tenants.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: language === 'so' ? 'Reliability Celcelis' : 'Avg. Reliability', value: '98%', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: language === 'so' ? 'Bixiyayaal Firfircoon' : 'Active Payers', value: tenants.length, icon: ChevronRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder={language === 'so' ? 'Ka raadi magaca ama taleefanka...' : 'Search by name or phone...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
        />
      </div>

      {/* Tenant List */}
      {isLoading ? (
        <div className="h-48 flex flex-col items-center justify-center gap-4 text-slate-400 italic">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p>{language === 'so' ? 'Soo rarid...' : 'Loading tenants...'}</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredTenants.map((tenant) => (
            <motion.div 
              variants={itemVariants}
              key={tenant.id} 
              className="glass-card p-4 flex items-center justify-between hover:shadow-xl hover:shadow-primary/5 transition-all border-slate-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {tenant.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{tenant.name}</h3>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {tenant.phone}</span>
                    <span className="text-slate-200">•</span>
                    <span>{tenant.familySize} {language === 'so' ? 'Qof' : 'Family Size'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">{tenant.reliability}%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Reliability' : 'Reliability'}</p>
                </div>
                
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                  tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {tenant.status}
                </div>

                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(tenant)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-primary transition-all"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(tenant.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredTenants.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">{language === 'so' ? 'Wax kireystayaal ah lama helin.' : 'No tenants found matching your search.'}</p>
            </div>
          )}
        </motion.div>
      )}

      <TenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tenant={selectedTenant} 
      />
    </div>
  );
};

export default TenantsPage;
