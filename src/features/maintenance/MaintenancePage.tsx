import { 
  Wrench, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Mic, 
  Image as ImageIcon,
  ChevronRight,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

const MaintenancePage = () => {
  const { language, maintenance, deleteMaintenance, updateMaintenance } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRequest, setEditingRequest] = useState<any>(null);

  const filteredRequests = maintenance.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto codsigan?' : 'Are you sure you want to delete this maintenance request?')) {
      deleteMaintenance(id);
    }
  };

  const toggleStatus = (m: any) => {
    const nextStatus = m.status === 'pending' ? 'in_progress' : m.status === 'in_progress' ? 'resolved' : 'pending';
    updateMaintenance({ ...m, status: nextStatus });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Dayactirka' : 'Maintenance Requests'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Lasocodka cabashooyinka kireyayaasha iyo hagaajinta guryaha.' : 'Track repair tickets, contractor progress, and urgency levels.'}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          {language === 'so' ? 'Codsiga Cusub' : 'New Ticket'}
        </button>
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={language === 'so' ? 'Raadi codsi ama guri...' : 'Search by title or property...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
           {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
             <button key={tab} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'All' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="glass-card flex flex-col lg:flex-row border-slate-100 hover:border-primary/20 transition-all group overflow-hidden bg-white shadow-sm">
             {/* Urgency Color Strip */}
             <div className={`w-full lg:w-2 ${
               request.priority === 'urgent' || request.priority === 'emergency' ? 'bg-red-500' : 
               request.priority === 'normal' ? 'bg-amber-500' : 'bg-blue-500'
             }`} />
             
             <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1 space-y-4">
                   <div className="flex items-start justify-between">
                      <div>
                         <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{request.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                               request.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                               {request.priority}
                            </span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400 text-xs mt-1 font-medium">
                            <MapPin className="w-3 h-3" />
                            {request.property}
                         </div>
                      </div>
                      <div className="flex gap-1">
                         <button 
                            onClick={() => setEditingRequest(request)}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100"
                         >
                            <Edit className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => handleDelete(request.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                         <Clock className="w-3 h-3 text-slate-400" />
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{request.date}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                         <Mic className="w-3 h-3 text-primary" />
                         <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Vocal Log</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                         <ImageIcon className="w-3 h-3 text-slate-400" />
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">2 Photos</span>
                      </div>
                   </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col justify-between items-end gap-4 shrink-0">
                   <button 
                     onClick={() => toggleStatus(request)}
                     className={`w-full sm:w-autox px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap ${
                      request.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 cursor-default' : 
                      request.status === 'in_progress' ? 'bg-primary text-white border-primary shadow-primary/20' : 
                      'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                   }`}>
                      {request.status === 'resolved' ? (
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Resolved</span>
                      ) : (
                        language === 'so' ? 'Kaga shaqee' : request.status.replace('_', ' ')
                      )}
                   </button>
                   <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-all flex items-center gap-1 group/btn">
                      {language === 'so' ? 'Arag Faahfaahin' : 'View Full Details'}
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (Simplified) */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'so' ? 'Wax ka beddel Codsiga' : 'Edit Maintenance Request'}
              </h2>
              <button 
                onClick={() => setEditingRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              updateMaintenance(editingRequest);
              setEditingRequest(null);
            }}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Request Title</label>
                <input 
                  type="text" 
                  value={editingRequest.title}
                  onChange={(e) => setEditingRequest({...editingRequest, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Priority</label>
                <select 
                  value={editingRequest.priority}
                  onChange={(e) => setEditingRequest({...editingRequest, priority: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary transition-all"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingRequest(null)}
                  className="flex-1 px-6 py-3 border border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  {language === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  {language === 'so' ? 'Keydi' : 'Update Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
