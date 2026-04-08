import { 
  Wrench, 
  Search, 
  Plus, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Mic, 
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const tickets = [
  { id: 1, title: 'Water Leak in Kitchen', property: 'Hodan Suite A', priority: 'urgent', status: 'pending', date: '2024-04-07', type: 'Plumbing' },
  { id: 2, title: 'Broken Window Glass', property: 'Karaan Heights', priority: 'normal', status: 'in_progress', date: '2024-04-06', type: 'Repair' },
  { id: 3, title: 'Electrical Shortcut', property: 'Wadajir Commercial', priority: 'emergency', status: 'pending', date: '2024-04-08', type: 'Electrical' },
  { id: 4, title: 'AC Not Cooling', property: 'Daynile Family Villa', priority: 'low', status: 'resolved', date: '2024-04-02', type: 'HVAC' },
];

const MaintenancePage = () => {
  const { language } = useStore();

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-600 text-white border-red-700 shadow-md animate-pulse';
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'normal': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'in_progress': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Dayactirka' : 'Maintenance Center'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Maamul cabashooyinka iyo dayactirka guryaha.' : 'Track repair requests, emergency issues and maintenance status.'}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          {language === 'so' ? 'Codsi Cusub' : 'New Request'}
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tickets List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={language === 'so' ? 'Raadi dayactir ama guri...' : 'Search by issue or property...'}
              className="input-field pl-12 h-14"
            />
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/20 transition-all group cursor-pointer">
                <div className="flex gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${getPriorityStyle(ticket.priority)}`}>
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ticket.title}</h3>
                       <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{ticket.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-secondary" /> {ticket.property}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Reported: {ticket.date}
                       </p>
                       <div className="flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3 text-slate-300" />
                          <Mic className="w-3 h-3 text-slate-300" />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    {getStatusIcon(ticket.status)}
                    <span className="text-xs font-bold text-slate-600 capitalize">{ticket.status.replace('_', ' ')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Mini Dashboard */}
        <div className="space-y-6">
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">Urgency Status</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Emergencies</span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">1 Active</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Pending Fixes</span>
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">3 Total</span>
                   </div>
                </div>
                <button className="w-full mt-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                   Contact Contractor
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
           </div>

           <div className="glass-card p-6">
              <h3 className="font-bold mb-4">Quick Voice Log</h3>
              <p className="text-xs text-slate-500 mb-6 italic">Press and hold to record a maintenance issue description in Somali or English.</p>
              <button className="w-full aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary transition-all">
                 <Mic className="w-10 h-10" />
                 <span className="text-xs font-bold uppercase tracking-widest">Hold to Record</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
