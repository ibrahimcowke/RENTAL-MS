import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertCircle,
  Plus,
  RefreshCw,
  Zap,
  Activity
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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
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
      title: language === 'so' ? 'Guryaha Guud' : 'Total Properties', 
      value: totalProperties.toString(), 
      icon: Building2, 
      color: 'bg-indigo-600',
      trend: 12,
      chartData: Array.from({ length: 15 }, () => ({ value: 20 + Math.random() * 40 }))
    },
    { 
      title: language === 'so' ? 'Kiraystayaasha' : 'Occupancy Rate', 
      value: `${properties.length > 0 ? Math.round((activeTenants / properties.length) * 100) : 0}%`, 
      icon: Users, 
      color: 'bg-blue-600',
      trend: 8,
      chartData: Array.from({ length: 15 }, () => ({ value: 30 + Math.random() * 20 }))
    },
    { 
      title: language === 'so' ? 'Dakhliga (Guud)' : 'Monthly Income', 
      value: currency === 'USD' ? `$${monthlyIncome.toLocaleString()}` : `SOS ${(monthlyIncome * 25000).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-emerald-600',
      trend: 15,
      chartData: Array.from({ length: 15 }, () => ({ value: 10 + Math.random() * 80 }))
    },
    { 
      title: language === 'so' ? 'Lacag-dhiman' : 'Overdue Payments', 
      value: overdueCount.toString(), 
      icon: AlertCircle, 
      color: 'bg-rose-600',
      trend: -5,
      chartData: Array.from({ length: 15 }, () => ({ value: 50 - Math.random() * 30 }))
    },
  ];

  const incomeTrend = [
    { month: 'Jan', amount: 10200 },
    { month: 'Feb', amount: 11500 },
    { month: 'Mar', amount: 12450 },
    { month: 'Apr', amount: monthlyIncome || 9800 },
  ];

  return (
    <div className="min-h-screen command-center-bg pb-24 relative overflow-hidden">
      
      {/* 1. NEON HOLOGRAPHIC OVERLAYS */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[150px] -mr-96 -mt-96 opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -ml-40 opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] opacity-20 pointer-events-none" />

      {/* 2. COMMAND CENTER HERO */}
      <div className="pt-16 pb-32 px-4 md:px-12 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="max-w-[1800px] mx-auto flex flex-col xl:flex-row items-end justify-between gap-12"
        >
          <div className="relative group">
            <div className="flex items-center gap-4 mb-8">
               <div className="px-5 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10B981] animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">System Active</span>
               </div>
               <div className="w-12 h-px bg-white/10" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Mogadishu Portfolio</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8">
               RENTAL<br/>
               <span className="text-primary drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]">OVERVIEW</span>
            </h1>
            
            <p className="text-lg text-slate-400 font-bold max-w-lg leading-relaxed border-l-2 border-white/10 pl-8 ml-2">
               Manage your properties, tenants, and payments with ease. Real-time insights into your portfolio.
            </p>
          </div>

          {/* Rapid Interaction Interface */}
          <div className="grid grid-cols-2 sm:flex gap-4">
             {[
               { id: 'property', label: language === 'so' ? 'KUDAR GURI' : 'ADD PROPERTY', icon: Plus, color: 'bg-primary neon-glow-primary', accent: 'border-primary/30' },
               { id: 'payment', label: language === 'so' ? 'BIXIN LACAG' : 'RECORD PAYMENT', icon: Activity, color: 'bg-blue-600 neon-glow-primary', accent: 'border-blue-500/30' },
             ].map(btn => (
                <button 
                  key={btn.id}
                  onClick={() => setActiveModal(btn.id as any)}
                  className={cn(
                    "px-10 py-6 rounded-[2.5rem] flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-105 active:scale-95 border-b-4",
                    btn.color,
                    btn.accent
                  )}
                >
                  <btn.icon className="w-5 h-5" />
                  {btn.label}
                </button>
             ))}
             <button 
                onClick={() => fetchData()}
                className="hidden xl:flex p-6 hyper-glass text-white rounded-[2.5rem] hover:bg-white/10 transition-all items-center justify-center aspect-square"
             >
                <RefreshCw className={cn("w-6 h-6", isLoading && "animate-spin")} />
             </button>
          </div>
        </motion.div>
      </div>

      {/* 3. ANALYTICS INTERFACE */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 -mt-24 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          
          <div className="xl:col-span-3 space-y-10">
            {/* Real-time Metrics Grid */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-1">
                  <PortfolioPulse />
               </div>
               <div className="lg:col-span-2">
                  <AIInsightHub />
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Financial Performance Matrix */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="hyper-glass p-8 rounded-[3rem] relative overflow-hidden group"
               >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                 
                 <div className="flex items-center justify-between mb-12 relative z-10">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter">Yield Velocity</h3>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">PROFIT GROWTH INDEX (USD)</p>
                    </div>
                    <div className="px-5 py-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-2xl border border-emerald-500/20 animate-pulse">
                       LIVE STREAM
                    </div>
                 </div>
                 
                 <div className="h-80 w-full ml-[-20px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={incomeTrend}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontWeight: 'bold' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </motion.div>

               {/* Efficiency Gauge */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.1 }}
                 className="hyper-glass p-12 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-50" />
                 
                 <div className="text-left w-full mb-10 relative z-10">
                    <h3 className="text-3xl font-black text-white tracking-tighter">Operational ROI</h3>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-1">Efficiency Baseline</p>
                 </div>

                 <div className="relative w-72 h-72 flex items-center justify-center z-10">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="144" cy="144" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="24" fill="transparent" />
                     <motion.circle
                       cx="144" cy="144" r="120" stroke="#10B981" strokeWidth="24" fill="transparent"
                       strokeDasharray={754}
                       initial={{ strokeDashoffset: 754 }}
                       animate={{ strokeDashoffset: 754 * (1 - 0.88) }}
                       transition={{ duration: 2, ease: "easeOut" }}
                       strokeLinecap="round"
                       className="drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                     />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-7xl font-black text-white tracking-tighter">88<span className="text-3xl opacity-30 ml-2">%</span></span>
                      <div className="mt-5 px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-black tracking-[0.3em] border border-emerald-500/20 neon-glow-emerald">
                         OPTIMAL
                      </div>
                   </div>
                 </div>

                 <div className="mt-12 grid grid-cols-2 gap-8 w-full relative z-10">
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Yield Factor</p>
                       <p className="text-2xl font-black text-white">12.4%</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Portfolio Grade</p>
                       <p className="text-2xl font-black text-blue-400">AAA</p>
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-10">
             <RecentActivity />
             
             {/* Dynamic Operational Insights */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="hyper-glass p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 neon-glow-emerald flex items-center justify-center relative overflow-hidden">
                      <Zap className="w-8 h-8 text-white fill-current animate-pulse relative z-10" />
                   </div>
                   <h4 className="text-2xl font-black text-white tracking-tighter">Status Radar</h4>
                </div>
                
                <div className="space-y-8">
                  {[
                    { msg: 'Hodan Node: High Yield (+14%)', color: 'bg-emerald-400 shadow-[0_0_10px_#34d399]' },
                    { msg: 'Payment Latency: Reduced 8%', color: 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' },
                    { msg: 'Restoration Cycle: Optimal', color: 'bg-indigo-400 shadow-[0_0_10px_#818cf8]' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5 group/li items-center">
                       <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", item.color)} />
                       <p className="text-xs font-bold text-slate-400 group-hover/li:text-white transition-colors leading-snug">
                         {item.msg}
                       </p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-12 py-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all border border-white/5 active:scale-95">
                  Expand Intelligence
                </button>
             </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal === 'property' && (
          <PropertyModal isOpen={true} onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'payment' && (
          <PaymentModal isOpen={true} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
