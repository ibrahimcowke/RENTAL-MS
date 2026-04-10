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
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import DashboardStatCard from '../dashboard/DashboardStatCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
  }
};

// Mock historical data generator for sparklines
const generateSparkData = (base: number, variance: number = 20) => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i,
    value: base + Math.floor(Math.random() * variance * 2) - variance
  }));
};

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
      {/* 1. TOP HEADER & QUICK ACTIONS */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col xl:flex-row xl:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-[0.2em] mb-2">
            <Zap className="w-3 h-3 fill-current" />
             REAL-TIME ANALYTICS
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <FileText className="w-8 h-8 text-primary" />
             {language === 'so' ? 'Warbixinnada Guud' : 'Global Reports'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
             {language === 'so' ? 'Ka soo bixi warbixino faahfaahsan oo ku saabsan guryahaaga.' : 'Export detailed financial and occupancy analytics for your portfolio.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all whitespace-nowrap">
            <Download className="w-4 h-4" />
            {language === 'so' ? 'Download PDF' : 'Export All Data'}
          </button>
        </div>
      </motion.div>

      {/* 2. FEATURED ANALYTICS STATS */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <DashboardStatCard 
          title="Portfolio Value"
          value="$842,000"
          icon={TrendingUp}
          color="bg-primary"
          trend={12.4}
          chartData={generateSparkData(800, 50)}
        />
        
        <DashboardStatCard 
          title="Avg. Occupancy"
          value="94.2%"
          icon={Building2}
          color="bg-blue-600"
          trend={3.1}
          chartData={generateSparkData(90, 2)}
        />

        <DashboardStatCard 
          title="Annual Yield"
          value="12.4%"
          icon={BarChart3}
          color="bg-teal-600"
          trend={-0.5}
          chartData={generateSparkData(12, 1)}
        />
      </motion.div>

      {/* 3. DETAILED REPORTS & GENERATED DOCS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Main List (2/3 on XL) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Document Archive
            </h3>
            <div className="flex gap-2">
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="glass-card divide-y divide-slate-100 overflow-hidden"
          >
            {reports.map((report) => (
              <motion.div 
                variants={itemVariants}
                key={report.id} 
                className="p-5 flex items-center justify-between group hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-slate-100">
                       <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors">{report.name}</h4>
                       <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                             <Calendar className="w-3 h-3" /> {report.date}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">{report.type}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl border border-emerald-100 uppercase tracking-widest">
                       {report.status}
                    </span>
                    <button className="p-2.5 text-slate-300 group-hover:text-primary transition-all bg-white border border-transparent group-hover:border-slate-200 group-hover:shadow-sm rounded-xl">
                       <Download className="w-5 h-5" />
                    </button>
                 </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sidebar Insights (1/3 on XL) */}
        <div className="space-y-6">
           {/* Top District Card - Refined */}
           <motion.div variants={itemVariants} initial="hidden" animate="visible" className="glass-card p-6 border-slate-100">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-black text-slate-900">District Growth</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance by region</p>
                 </div>
                 <div className="p-2 bg-secondary/10 rounded-xl">
                    <MapPin className="w-5 h-5 text-secondary" />
                 </div>
              </div>
              <div className="space-y-4">
                 {[
                    { name: 'Hodan', status: 'High Growth', val: 92, color: 'bg-primary' },
                    { name: 'Wadajir', status: 'Stable', val: 84, color: 'bg-blue-500' },
                    { name: 'Deynile', status: 'Emerging', val: 65, color: 'bg-secondary' }
                 ].map((d, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-bold text-slate-700">{d.name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase">{d.status}</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${d.val}%` }}
                             transition={{ duration: 1, delay: i * 0.1 }}
                             className={`h-full ${d.color} rounded-full`}
                          />
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all py-3 border-t border-slate-100">
                 Market Heatmap <ChevronRight className="w-3 h-3" />
              </button>
           </motion.div>

           {/* Asset Mix Chart - Refined */}
           <motion.div variants={itemVariants} initial="hidden" animate="visible" className="glass-card p-6 border-slate-100 bg-slate-900 text-white border-none overflow-hidden relative">
              <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full" />
              
              <div className="relative z-10 mb-6">
                 <h3 className="font-black">Asset Allocation</h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portfolio diversification</p>
              </div>

              <div className="flex items-end gap-3 h-24 relative z-10 mb-4">
                 {[
                    { label: 'COMM', val: '60%', color: 'bg-blue-500' },
                    { label: 'RESI', val: '90%', color: 'bg-primary' },
                    { label: 'LAND', val: '40%', color: 'bg-emerald-500' }
                 ].map((a, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                       <div className="w-full bg-white/5 rounded-t-xl h-full relative group">
                          <motion.div 
                             initial={{ scaleY: 0 }}
                             animate={{ scaleY: 1 }}
                             transition={{ duration: 1, delay: i * 0.2 }}
                             style={{ height: a.val }}
                             className={`absolute bottom-0 inset-x-0 ${a.color} rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity`}
                          />
                       </div>
                       <span className="text-[9px] font-black text-slate-500">{a.label}</span>
                    </div>
                 ))}
              </div>
              <p className="text-[10px] text-center text-slate-500 font-bold italic relative z-10 border-t border-white/5 pt-4">Data audited April 2026</p>
           </motion.div>
        </div>
      </div>

      {/* PDF Export Banner - Premium Upgrade */}
      <motion.div 
         variants={itemVariants}
         initial="hidden"
         animate="visible"
         className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-10"
      >
         {/* Decorative Gradients */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-50 pointer-events-none" />
         <div className="absolute bottom-[-50%] left-[-10%] w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

         <div className="flex gap-8 items-center flex-col lg:flex-row text-center lg:text-left relative z-10">
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-primary/30 group-hover:border-primary/50 transition-colors shrink-0">
               <ImageIcon className="w-10 h-10 text-primary opacity-60 group-hover:opacity-100 transition-all" />
            </div>
            <div>
               <div className="flex items-center justify-center lg:justify-start gap-2 text-primary font-black text-[10px] tracking-[0.3em] mb-2">
                  <Zap className="w-3 h-3 fill-current" />
                  PREMIUM FEATURE
               </div>
               <h3 className="text-2xl font-black text-white tracking-tight">Enterprise Portfolio Report</h3>
               <p className="text-slate-400 font-bold text-sm max-w-sm mt-1">Generate a board-ready consolidated PDF ranking performance across 12 unique Mogadishu districts.</p>
            </div>
         </div>

         <div className="flex gap-4 w-full lg:w-auto relative z-10">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
               Live Preview
            </button>
            <button className="flex-1 lg:flex-none px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.95] transition-all">
               Export Bundle
            </button>
         </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
