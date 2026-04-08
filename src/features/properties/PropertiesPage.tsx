import { 
  Plus, 
  MapPin, 
  Home, 
  Search, 
  Filter, 
  MoreVertical,
  Building2,
  Phone,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const properties = [
  { id: 1, name: 'Hodan Suite A', district: 'Hodan', status: 'occupied', rent: 450, type: 'Apartment', address: 'Maka Al Mukarama St', thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Wadajir Commercial', district: 'Wadajir', status: 'available', rent: 1200, type: 'Shop', address: 'Airport Rd', thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Daynile Family Villa', district: 'Daynile', status: 'maintenance', rent: 800, type: 'House', address: 'Daynile Main Street', thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Karaan Heights', district: 'Karaan', status: 'occupied', rent: 350, type: 'Apartment', address: 'Lido Beach Ave', thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Bondheere Corner', district: 'Bondhere', status: 'available', rent: 500, type: 'Room', address: 'Sayidka Area', thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80' },
];

const PropertiesPage = () => {
  const { language, currency } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8 text-neutral-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {language === 'so' ? 'Guryaha' : 'Properties'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Maamul guryahaaga dhamaan degmooyinka.' : 'Manage your property portfolio across Mogadishu.'}
          </p>
        </div>
        <button className="btn-primary group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {language === 'so' ? 'Guri Cusub' : 'Add Property'}
        </button>
      </div>

      {/* Filters & District Heatmap Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={language === 'so' ? 'Raadi guri ama degmo...' : 'Search by name or district...'}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-bold">Filter</span>
              </button>
              <select className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold outline-none cursor-pointer hover:bg-slate-50">
                <option>All Districts</option>
                <option>Hodan</option>
                <option>Wadajir</option>
                <option>Daynile</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="glass-card overflow-hidden group hover:shadow-premium transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={prop.thumbnail} alt={prop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(prop.status)}`}>
                      {prop.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {prop.district}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{prop.name}</h3>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {prop.type} • {prop.address}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Rent</p>
                      <p className="text-lg font-bold text-slate-900">
                        {currency === 'USD' ? `$${prop.rent}` : `SOS ${(prop.rent * 25).toLocaleString()}k`}
                      </p>
                    </div>
                    <button className="p-2.5 rounded-xl bg-slate-50 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                      <Home className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              District Heatmap
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Most Profitable</span>
                <span className="text-sm font-bold text-primary">Hodan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Highest Demand</span>
                <span className="text-sm font-bold text-primary">Wadajir</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Best Occupancy</span>
                <span className="text-sm font-bold text-primary">Daynile</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white text-primary text-sm font-bold rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all">
              View Analytics
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Urgent Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Plumbing Issue</p>
                  <p className="text-xs text-slate-400">Hodan Suite A • Urgent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
