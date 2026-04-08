import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Clock, 
  Star,
  Edit,
  Trash2,
  X,
  History,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

const TenantsPage = () => {
  const { language, tenants, deleteTenant, updateTenant } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTenant, setEditingTenant] = useState<any>(null);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery)
  );

  const handleDelete = (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto kireyahan?' : 'Are you sure you want to delete this tenant?')) {
      deleteTenant(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Maamulka Kireyayaasha' : 'Tenant Management'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Lasocodka dadka dagan guryahaaga iyo kalsoonidooda.' : 'Track resident history, reliability, and contact info.'}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          {language === 'so' ? 'Kireeye Cusub' : 'Add New Tenant'}
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={language === 'so' ? 'Raadi magaca ama taleefanka...' : 'Search by name or phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto whitespace-nowrap">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">High Trust: {tenants.filter(t => t.reliability > 90).length}</span>
           </div>
           <div className="w-px h-4 bg-slate-200" />
           <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">At Risk: {tenants.filter(t => t.reliability < 80).length}</span>
           </div>
        </div>
      </div>

      {/* Tenants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="glass-card p-6 flex flex-col sm:flex-row gap-6 border-slate-100 hover:border-primary/20 transition-all hover:bg-slate-50/30 group">
             <div className="relative shrink-0">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                   <Users className="w-8 h-8 text-primary" />
                </div>
                {tenant.reliability > 95 && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-lg shadow-lg border-2 border-white">
                     <Star className="w-3 h-3 fill-white" />
                  </div>
                )}
             </div>

             <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{tenant.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <div className="flex items-center gap-1 text-slate-400">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs font-bold">{tenant.phone}</span>
                         </div>
                         <div className="w-1 h-1 bg-slate-300 rounded-full" />
                         <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{tenant.status}</span>
                      </div>
                   </div>
                   <div className="flex gap-1">
                      <button 
                         onClick={() => setEditingTenant(tenant)}
                         className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary shadow-sm transition-all"
                      >
                         <Edit className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDelete(tenant.id)}
                         className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 shadow-sm transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                   <div className="text-center sm:text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{language === 'so' ? 'Qoyska' : 'Family Size'}</p>
                      <p className="text-sm font-bold text-slate-700">{tenant.familySize} {language === 'so' ? 'Qof' : 'People'}</p>
                   </div>
                   <div className="text-center sm:text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{language === 'so' ? 'Kalsoonida' : 'Reliability'}</p>
                      <div className="flex items-center gap-2">
                         <div className="flex-1 h-1 bg-slate-100 rounded-full max-w-[40px] hidden sm:block">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tenant.reliability}%` }} />
                         </div>
                         <p className="text-sm font-bold text-emerald-600">{tenant.reliability}%</p>
                      </div>
                   </div>
                   <div className="text-center sm:text-right">
                      <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center justify-center sm:justify-end gap-1 mx-auto sm:mx-0">
                         <History className="w-3 h-3" />
                         {language === 'so' ? 'Taariikh' : 'History'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (Simplified) */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'so' ? 'Wax ka beddel Kireeyaha' : 'Edit Tenant Profile'}
              </h2>
              <button 
                onClick={() => setEditingTenant(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              updateTenant(editingTenant);
              setEditingTenant(null);
            }}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Phone Number</label>
                <input 
                  type="text" 
                  value={editingTenant.phone}
                  onChange={(e) => setEditingTenant({...editingTenant, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Reliability Score (%)</label>
                <input 
                  type="number" 
                  value={editingTenant.reliability}
                  onChange={(e) => setEditingTenant({...editingTenant, reliability: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 px-6 py-3 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  {language === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  {language === 'so' ? 'Keydi' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantsPage;
