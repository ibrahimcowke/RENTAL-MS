import { 
  FileText, 
  Download, 
  BarChart3, 
  Calendar, 
  Filter, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Building2,
  Table as TableIcon,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const reports = [
  { id: 1, name: 'Monthly Income Statement', type: 'Financial', date: 'April 2024', status: 'Ready' },
  { id: 2, name: 'Occupancy Rate by District', type: 'Analytics', date: 'Q1 2024', status: 'Ready' },
  { id: 3, name: 'Tenant Reliability Audit', type: 'Risk', date: 'March 2024', status: 'Generated' },
  { id: 4, name: 'Maintenance Expense Report', type: 'Expense', date: '2023 Full Year', status: 'Archived' },
];

const ReportsPage = () => {
  const { language } = useStore();

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Warbixinada' : 'Global Reports'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Ka soo bixi warbixino faahfaahsan oo ku saabsan guryahaaga.' : 'Export detailed financial and occupancy analytics for your portfolio.'}
          </p>
        </div>
        <button className="btn-primary">
          <Download className="w-5 h-5" />
          {language === 'so' ? 'Download PDF' : 'Export All'}
        </button>
      </div>

      {/* Featured Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-primary to-teal-800 text-white border-none shadow-xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded-lg">Performance</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Portfolio Value</h3>
              <p className="text-3xl font-bold mb-4 tracking-tight">$842k</p>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
                 <span className="bg-teal-400/20 px-2 py-1 rounded-md tracking-wider">+12.4% vs last year</span>
              </div>
           </div>
           <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="glass-card p-6 border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 mb-4">
                 <MapPin className="w-5 h-5 text-secondary" />
                 <h3 className="font-bold text-slate-900 underline decoration-secondary/30 decoration-2 underline-offset-4">Top District</h3>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">Hodan</span>
                    <span className="text-xs font-bold text-primary">High Growth</span>
                 </div>
                 <div className="flex justify-between items-center p-2">
                    <span className="text-sm font-medium text-slate-500">Wadajir</span>
                    <span className="text-xs font-bold text-slate-400">Stable</span>
                 </div>
              </div>
           </div>
           <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors py-2 border-t border-slate-50">
              View Map Heatmap <ChevronRight className="w-3 h-3" />
           </button>
        </div>

        <div className="glass-card p-6 border-slate-100 bg-white shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 mb-4">
                 <Building2 className="w-5 h-5 text-blue-500" />
                 <h3 className="font-bold text-slate-900 underline decoration-blue-500/20 decoration-2 underline-offset-4">Asset Type</h3>
              </div>
              <div className="flex items-end gap-3 h-16">
                 <div className="w-full bg-slate-50 rounded-t-lg h-[60%] relative group">
                    <div className="absolute inset-0 bg-blue-500 rounded-t-lg transition-all duration-700 origin-bottom scale-y-75"></div>
                 </div>
                 <div className="w-full bg-slate-50 rounded-t-lg h-[90%] relative group">
                    <div className="absolute inset-0 bg-primary rounded-t-lg transition-all duration-700 origin-bottom scale-y-100"></div>
                 </div>
                 <div className="w-full bg-slate-50 rounded-t-lg h-[40%] relative group">
                    <div className="absolute inset-0 bg-emerald-500 rounded-t-lg transition-all duration-700 origin-bottom scale-y-50"></div>
                 </div>
              </div>
              <div className="flex justify-between mt-2 px-1">
                 <span className="text-[10px] font-bold text-slate-400">Commercial</span>
                 <span className="text-[10px] font-bold text-slate-400">Residential</span>
                 <span className="text-[10px] font-bold text-slate-400">Land</span>
              </div>
           </div>
           <p className="text-[10px] text-center text-slate-300 font-medium mt-4 italic">Updated April 8, 2024</p>
        </div>
      </div>

      {/* Reports Generated List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Generated Documents
           </h3>
           <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary transition-all">
                 <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary transition-all">
                 <TableIcon className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="glass-card overflow-hidden">
           <div className="divide-y divide-slate-100">
              {reports.map((report) => (
                <div key={report.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                         <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{report.name}</h4>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                               <Calendar className="w-3 h-3" /> {report.date}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{report.type}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 uppercase tracking-widest">
                         {report.status}
                      </span>
                      <button className="p-2 text-slate-300 group-hover:text-primary transition-all border border-transparent group-hover:border-slate-100 rounded-xl">
                         <Download className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* PDF Export Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex gap-6 items-center flex-col md:flex-row text-center md:text-left">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border-2 border-dashed border-primary/20 shrink-0">
               <ImageIcon className="w-10 h-10 text-primary opacity-50" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-900">Customize Yearly Report</h3>
               <p className="text-sm text-slate-500 font-medium max-w-sm">Select multiple properties and districts to generate a consolidated 2024 performance PDF.</p>
            </div>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">
               Preview
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
               Export as PDF
            </button>
         </div>
      </div>
    </div>
  );
};

export default ReportsPage;
