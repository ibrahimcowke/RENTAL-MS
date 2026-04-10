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
  LayoutGrid
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
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import AIInsightHub from './AIInsightHub';
import RecentActivity from './RecentActivity';
import DashboardStatCard from './DashboardStatCard';
import PropertyModal from '../properties/PropertyModal';
import TenantModal from '../tenants/TenantModal';
import PaymentModal from '../payments/PaymentModal';

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

const DashboardPage = () => {
  const { language, currency, properties, tenants, payments, fetchData, isLoading } = useStore();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<'property' | 'tenant' | 'payment' | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Real Stats
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
      color: 'bg-primary',
      trend: 12,
      chartData: generateSparkData(30, 5)
    },
    { 
      title: language === 'so' ? 'Kiraystayaasha' : 'Active Tenants', 
      value: activeTenants.toString(), 
      icon: Users, 
      color: 'bg-blue-600',
      trend: 8,
      chartData: generateSparkData(25, 4)
    },
    { 
      title: language === 'so' ? 'Dakhliga (Guud)' : 'Monthly Income', 
      value: currency === 'USD' ? `$${monthlyIncome.toLocaleString()}` : `SOS ${(monthlyIncome * 25000).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-teal-600',
      trend: 15,
      chartData: generateSparkData(1000, 100)
    },
    { 
      title: language === 'so' ? 'Lacag-dhiman' : 'Overdue', 
      value: overdueCount.toString(), 
      icon: AlertCircle, 
      color: 'bg-red-500',
      trend: -5,
      chartData: generateSparkData(10, 3)
    },
  ];

  // Derive District Performance
  const districts = [...new Set(properties.map(p => p.district))];
  const districtData = districts.map(name => {
    const propsInDist = properties.filter(p => p.district === name);
    const occupied = propsInDist.filter(p => p.status === 'occupied').length;
    return {
      name,
      total: propsInDist.length,
      occupancy: propsInDist.length > 0 ? Math.round((occupied / propsInDist.length) * 100) : 0
    };
  }).sort((a, b) => b.total - a.total).slice(0, 5);

  const incomeTrend = [
    { month: 'Jan', amount: 10200 },
    { month: 'Feb', amount: 11500 },
    { month: 'Mar', amount: 12450 },
    { month: 'Apr', amount: monthlyIncome || 9800 },
  ];

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
             REAL-TIME OVERVIEW
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <LayoutGrid className="w-8 h-8 text-primary" />
             {language === 'so' ? 'Maamulka Guryaha' : 'Portfolio Dashboard'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
             {language === 'so' ? 'Kusoo dhowaad maamulka guryaha degmooyinka.' : 'Managing your Mogadishu rental portfolio with precision.'}
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
          <button 
            onClick={() => setActiveModal('property')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
          <button 
            onClick={() => setActiveModal('tenant')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
          <button 
            onClick={() => setActiveModal('payment')}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Payment
          </button>
          <button 
            onClick={() => fetchData()}
            className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-primary hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* 2. STATS GRID & MAIN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        
        {/* Left Column (3/4 on XL) */}
        <div className="xl:col-span-3 space-y-8">
          
          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => (
              <DashboardStatCard key={idx} {...stat} />
            ))}
          </motion.div>

          <AIInsightHub />

          {/* Detailed Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Income Trend Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {language === 'so' ? 'Isbedelka Dakhliga' : 'Revenue Trend'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">MONTHLY CASHFLOW IN USD</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md">+14.2%</span>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeTrend}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#0F766E" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Portfolio Health & High-Level Metrics */}
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-900 text-white border-none">
              {/* Decorative radial blur */}
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
              
              <div className="text-left w-full relative z-10">
                <h3 className="text-lg font-black mb-1">Portfolio Score</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Aggregate performance index</p>
              </div>
              
              <div className="relative w-52 h-52 flex items-center justify-center z-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="104" cy="104" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="16" fill="transparent" />
                  <motion.circle
                    cx="104" cy="104" r="88" stroke="hsl(172, 77%, 26%)" strokeWidth="16" fill="transparent"
                    strokeDasharray={552.9}
                    initial={{ strokeDashoffset: 552.9 }}
                    animate={{ strokeDashoffset: 552.9 * (1 - 0.88) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(15,118,110,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white tracking-tighter">88<span className="text-xl opacity-40 ml-1">%</span></span>
                  <div className="flex items-center gap-1.5 mt-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold">
                     <TrendingUp className="w-3 h-3" /> EXCELLENT
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 w-full relative z-10">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Yield</p>
                  <p className="text-lg font-black text-white">12.4%</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Delinquency</p>
                  <p className="text-lg font-black text-red-400">2.1%</p>
                </div>
              </div>
            </div>
          </div>

          {/* District Performance Table/List */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  District Performance
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">OCCUPANCY RATES BY MOGADISHU REGIONS</p>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {districtData.map((d, i) => (
                <div key={i} className="group relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{d.name} District</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${d.occupancy > 90 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                         {d.occupancy}% OCCUPIED
                       </span>
                       <button className="p-1 text-slate-300 hover:text-primary transition-all">
                          <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${d.occupancy}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full rounded-full ${d.occupancy > 90 ? 'bg-primary' : d.occupancy > 80 ? 'bg-teal-500' : 'bg-secondary'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (1/4 on XL) */}
        <div className="xl:sticky xl:top-24 space-y-8">
           <RecentActivity />
           
           {/* Quick Stats Helper */}
           <div className="glass-card p-6 bg-gradient-to-br from-primary to-primary-dark text-white border-none shadow-2xl shadow-primary/20">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary fill-current" />
                Quick Insights
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                   <p className="text-[11px] font-medium leading-relaxed opacity-90">
                     Occupancy in <span className="font-bold underline">Hodan</span> has increased by 5% this week.
                   </p>
                </li>
                <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                   <p className="text-[11px] font-medium leading-relaxed opacity-90">
                     <span className="font-bold">4 payments</span> are pending verification since yesterday.
                   </p>
                </li>
              </ul>
              <button className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Optimize Strategy
              </button>
           </div>
        </div>
      </div>

      {/* MODALS */}
      <PropertyModal 
        isOpen={activeModal === 'property'} 
        onClose={() => setActiveModal(null)} 
      />
      <TenantModal 
        isOpen={activeModal === 'tenant'} 
        onClose={() => setActiveModal(null)} 
      />
      <PaymentModal 
        isOpen={activeModal === 'payment'} 
        onClose={() => setActiveModal(null)} 
      />

    </div>
  );
};

export default DashboardPage;
