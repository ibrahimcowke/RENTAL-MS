import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import AIInsightHub from './AIInsightHub';

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

const DashboardPage = () => {
  const { language, currency, properties, tenants, payments, fetchData } = useStore();

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
    { title: language === 'so' ? 'Guryaha Guud' : 'Total Properties', value: totalProperties.toString(), icon: Building2, color: 'bg-primary' },
    { title: language === 'so' ? 'Kiraystayaasha' : 'Active Tenants', value: activeTenants.toString(), icon: Users, color: 'bg-blue-600' },
    { title: language === 'so' ? 'Dakhliga (Guud)' : 'Total Income', value: currency === 'USD' ? `$${monthlyIncome.toLocaleString()}` : `SOS ${(monthlyIncome * 25000).toLocaleString()}`, icon: DollarSign, color: 'bg-teal-600' },
    { title: language === 'so' ? 'Lacag-dhiman' : 'Overdue Payments', value: overdueCount.toString(), icon: AlertCircle, color: 'bg-red-500' },
  ];

  // Derive District Performance from real properties
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

  const paymentStatus = [
    { name: 'Paid', value: payments.filter(p => p.status === 'paid').length || 85, color: '#0F766E' },
    { name: 'Partial', value: payments.filter(p => p.status === 'partial').length || 10, color: '#F59E0B' },
    { name: 'Overdue', value: payments.filter(p => p.status === 'overdue').length || 5, color: '#EF4444' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Welcome Header */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {language === 'so' ? 'Maamulka Guryaha Muqdisho' : 'Mogadishu Rental Dashboard'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'Kusoo dhowaad maamulka guryaha degmooyinka.' : 'Real-time overview of your property portfolio across districts.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm self-start md:self-center">
          <Clock className="w-3.5 h-3.5" />
          Last Update: 2 mins ago
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx} className="glass-card p-6 h-full flex flex-col justify-between group hover:scale-[1.02] transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Intelligence Hub */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <AIInsightHub />
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Income Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {language === 'so' ? 'Isbedelka Dakhliga' : 'Income Trend (USD)'}
            </h3>
            <select className="bg-slate-50 border-none outline-none text-xs font-bold uppercase py-1 px-3 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-100">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeTrend}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#64748B'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Health Score */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <h3 className="text-lg font-bold mb-8 w-full text-left">
            {language === 'so' ? 'Nafaqada Portfolio' : 'Portfolio Health'}
          </h3>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={502.6}
                strokeDashoffset={502.6 * (1 - 0.84)}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">84%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Excellent</span>
            </div>
          </div>

          <div className="mt-8 space-y-2 w-full">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Risk Level</span>
              <span className="text-emerald-500">Low</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[15%] rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* District & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* District Performance */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold">
              {language === 'so' ? 'Degmooyinka & Qabsashada' : 'District Performance'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {districtData.map((d, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-700">{d.name} District</span>
                  <span className="text-xs font-bold text-slate-400 capitalize">{d.occupancy}% Occupancy</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${d.occupancy > 90 ? 'bg-primary' : d.occupancy > 80 ? 'bg-teal-500' : 'bg-secondary'}`}
                    style={{ width: `${d.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend / Info */}
        <div className="glass-card p-6 bg-slate-900 text-white border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold underline decoration-primary decoration-2 underline-offset-4">Portfolio Alpha</h4>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
            Your portfolio is performing in the top 5% of Mogadishu rental markets for Q1 2024. Keep up the high reliability scores.
          </p>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-medium opacity-60">Yearly Yield</span>
                <span className="font-bold text-primary">14.2%</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-medium opacity-60">Market Share</span>
                <span className="font-bold text-secondary">2.8%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
