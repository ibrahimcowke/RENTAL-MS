import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Plus,
  RefreshCw,
  Zap,
  ChevronRight,
  LayoutGrid,
  Activity,
  ArrowRight
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import AIInsightHub from './AIInsightHub';
import RecentActivity from './RecentActivity';
import DashboardStatCard from './DashboardStatCard';
import PortfolioPulse from './PortfolioPulse';
import PropertyModal from '../properties/PropertyModal';
import TenantModal from '../tenants/TenantModal';
import PaymentModal from '../payments/PaymentModal';
import { cn } from '../../utils/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const DashboardPage = () => {
  const { language, currency, properties, tenants, payments, fetchData, isLoading } = useStore();
  const [activeModal, setActiveModal] = useState<'property' | 'tenant' | 'payment' | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const totalProperties = properties.length;
  const activeTenants = tenants.length;
  const monthlyIncome = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const stats = [
    { 
      title: language === 'so' ? 'Guryaha Guud' : 'Total Assets', 
      value: totalProperties.toString(), 
      icon: Building2, 
      color: 'bg-slate-900',
      trend: 12,
      chartData: Array.from({ length: 15 }, (_, i) => ({ value: 20 + Math.random() * 40 }))
    },
    { 
      title: language === 'so' ? 'Kiraystayaasha' : 'Occupancy', 
      value: `${properties.length > 0 ? Math.round((activeTenants / properties.length) * 100) : 0}%`, 
      icon: Users, 
      color: 'bg-primary',
      trend: 8,
      chartData: Array.from({ length: 15 }, (_, i) => ({ value: 30 + Math.random() * 20 }))
    },
    { 
      title: language === 'so' ? 'Dakhliga (Guud)' : 'Yield Revenue', 
      value: currency === 'USD' ? `$${monthlyIncome.toLocaleString()}` : `SOS ${(monthlyIncome * 25000).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-emerald-600',
      trend: 15,
      chartData: Array.from({ length: 15 }, (_, i) => ({ value: 10 + Math.random() * 80 }))
    },
    { 
      title: language === 'so' ? 'Lacag-dhiman' : 'Delinquency', 
      value: overdueCount.toString(), 
      icon: AlertCircle, 
      color: 'bg-rose-500',
      trend: -5,
      chartData: Array.from({ length: 15 }, (_, i) => ({ value: 50 - Math.random() * 30 }))
    },
  ];

  const incomeTrend = [
    { month: 'Jan', amount: 10200 },
    { month: 'Feb', amount: 11500 },
    { month: 'Mar', amount: 12450 },
    { month: 'Apr', amount: monthlyIncome || 9800 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. CINEMATIC ZAP HERO */}
      <div className="bg-slate-900 pt-12 pb-32 px-4 md:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        
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
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational Intelligence Active</span>
               </div>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">V4.2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
               {language === 'so' ? 'Maamulka Guryaha' : 'Portfolio'}<br/>
               <span className="text-primary italic">{language === 'so' ? 'Command Center' : 'Command Center'}</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
               {language === 'so' 
                 ? 'Kusoo dhowaad maamulka guryaha degmooyinka Muqdisho leh hufnaan sare.' 
                 : 'Next-generation executive dashboard for Mogadishu rental networks and high-yield assets.'}
            </p>
          </div>

          {/* Rapid Action Hub */}
          <div className="flex flex-wrap gap-4">
             {[
               { id: 'property', label: 'DEPLOY ASSET', icon: Plus, color: 'bg-primary shadow-primary/40' },
               { id: 'tenant', label: 'ADD TENANT', icon: Users, color: 'bg-blue-600 shadow-blue-500/40' },
               { id: 'payment', label: 'SYNC REVENUE', icon: Activity, color: 'bg-emerald-600 shadow-emerald-500/40' },
             ].map(btn => (
                <button 
                  key={btn.id}
                  onClick={() => setActiveModal(btn.id as any)}
                  className={cn(
                    "px-8 py-5 rounded-[2rem] flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95 shadow-2xl border-none",
                    btn.color
                  )}
                >
                  <btn.icon className="w-5 h-5" />
                  {btn.label}
                </button>
             ))}
             <button 
                onClick={() => fetchData()}
                className="p-5 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-white/10 transition-all backdrop-blur-xl"
             >
                <RefreshCw className={cn("w-6 h-6", isLoading && "animate-spin")} />
             </button>
          </div>
        </motion.div>
      </div>

      {/* 2. MAIN ANALYTICS GRID */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Content (3/4 on XL) */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Stats Row */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, idx) => (
                <DashboardStatCard key={idx} {...stat} />
              ))}
            </motion.div>

            {/* Pulse & AI Hub Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1">
                  <PortfolioPulse />
               </div>
               <div className="lg:col-span-2">
                  <AIInsightHub />
               </div>
            </div>

            {/* Large Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Premium Revenue Matrix */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="glass-zap p-1"
               >
                 <div className="bg-white rounded-[2.5rem] p-8 h-full">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Financial Velocity</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">MONTHLY GROWTH INDEX ($)</p>
                      </div>
                      <div className="flex gap-2">
                         <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-100">+14.2%</span>
                         <button className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ArrowRight className="w-5 h-5 text-slate-400" /></button>
                      </div>
                   </div>
                   
                   <div className="h-80 w-full ml-[-20px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={incomeTrend}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#cbd5e1'}} dy={15} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#cbd5e1'}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 'bold', padding: '16px' }}
                          />
                          <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                 </div>
               </motion.div>

               {/* Performance Score Gauge */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="glass-zap p-1"
               >
                 <div className="bg-slate-900 rounded-[2.5rem] p-10 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
                   
                   <div className="text-left w-full mb-10 relative z-10">
                      <h3 className="text-2xl font-black text-white tracking-tighter">Aggregate Yield</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Portfolio Efficiency Index</p>
                   </div>

                   <div className="relative w-64 h-64 flex items-center justify-center z-10">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="128" cy="128" r="110" stroke="#1e293b" strokeWidth="20" fill="transparent" />
                       <motion.circle
                         cx="128" cy="128" r="110" stroke="hsl(172, 77%, 40%)" strokeWidth="20" fill="transparent"
                         strokeDasharray={691}
                         initial={{ strokeDashoffset: 691 }}
                         animate={{ strokeDashoffset: 691 * (1 - 0.88) }}
                         transition={{ duration: 2, ease: "easeOut" }}
                         strokeLinecap="round"
                         className="drop-shadow-[0_0_15px_rgba(15,118,110,0.8)]"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white tracking-tighter">88<span className="text-2xl opacity-40 ml-1">%</span></span>
                        <div className="mt-4 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black tracking-widest border border-emerald-500/20">
                           ELITE PERFORMANCE
                        </div>
                     </div>
                   </div>

                   <div className="mt-12 grid grid-cols-2 gap-6 w-full relative z-10">
                      <div className="p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Cap Rate</p>
                         <p className="text-xl font-black text-white">12.4%</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Risk Factor</p>
                         <p className="text-xl font-black text-rose-400">LOW</p>
                      </div>
                   </div>
                 </div>
               </motion.div>
            </div>
          </div>

          {/* Right Sidebar (1/4 on XL) */}
          <div className="xl:col-span-1 space-y-8">
             <RecentActivity />
             
             {/* Dynamic Insights Module */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-zap p-1"
             >
               <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[2.2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-primary/30">
                  <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Zap className="w-6 h-6 text-white fill-current animate-pulse" />
                     </div>
                     <h4 className="text-lg font-black tracking-tighter">Intelligence Hub</h4>
                  </div>
                  
                  <ul className="space-y-6">
                    {[
                      { msg: 'Hodan occupancy trending up (+8.2%)', color: 'bg-emerald-400' },
                      { msg: 'Payment cycle efficiency improved', color: 'bg-blue-300' },
                      { msg: 'Maintenance costs below average', color: 'bg-indigo-300' }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 group/li">
                         <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0 shadow-[0_0_8px_white]", item.color)} />
                         <p className="text-xs font-bold leading-relaxed opacity-80 group-hover/li:opacity-100 transition-opacity">
                           {item.msg}
                         </p>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 active:scale-95 shadow-lg">
                    Launch Strategy Matrix
                  </button>
               </div>
             </motion.div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal === 'property' && (
          <PropertyModal 
            isOpen={true} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === 'tenant' && (
          <TenantModal 
            isOpen={true} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === 'payment' && (
          <PaymentModal 
            isOpen={true} 
            onClose={() => setActiveModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
