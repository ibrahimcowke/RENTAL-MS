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
import { useStore } from '../../store/useStore';

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
  const { language, currency } = useStore();

  // Demo Data (Somalia Context)
  const stats = [
    { title: language === 'so' ? 'Guryaha Guud' : 'Total Properties', value: '42', icon: Building2, color: 'bg-primary' },
    { title: language === 'so' ? 'Kiraystayaasha' : 'Active Tenants', value: '38', icon: Users, color: 'bg-blue-600' },
    { title: language === 'so' ? 'Dakhliga (Bishaan)' : 'Monthly Income', value: currency === 'USD' ? '$12,450' : 'SOS 311M', icon: DollarSign, color: 'bg-teal-600' },
    { title: language === 'so' ? 'Lacag-dhiman' : 'Overdue Payments', value: '5', icon: AlertCircle, color: 'bg-red-500' },
  ];

  const districtData = [
    { name: 'Hodan', total: 4500, occupancy: 95 },
    { name: 'Wadajir', total: 3200, occupancy: 88 },
    { name: 'Daynile', total: 2100, occupancy: 72 },
    { name: 'Karaan', total: 1800, occupancy: 82 },
    { name: 'Yaqshid', total: 2400, occupancy: 85 },
  ];

  const incomeTrend = [
    { month: 'Jan', amount: 10200 },
    { month: 'Feb', amount: 11500 },
    { month: 'Mar', amount: 12450 },
    { month: 'Apr', amount: 9800 },
    { month: 'May', amount: 13200 },
    { month: 'Jun', amount: 14500 },
  ];

  const paymentStatus = [
    { name: 'Paid', value: 85, color: '#0F766E' },
    { name: 'Partial', value: 10, color: '#F59E0B' },
    { name: 'Overdue', value: 5, color: '#EF4444' },
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

        {/* Payment Status Pie */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-8">
            {language === 'so' ? 'Xaaladda Lacagaha' : 'Payment Status'}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {paymentStatus.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="font-medium text-slate-600">{status.name}</span>
                </div>
                <span className="font-bold">{status.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* District & Smart Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* District Performance */}
        <div className="glass-card shadow-none border-slate-100 bg-white/50 backdrop-blur-none p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold">
              {language === 'so' ? 'Degmooyinka & Qabsashada' : 'District Performance'}
            </h3>
          </div>
          <div className="space-y-6">
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

        {/* Smart Insights (Somali Context) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold px-2">
            {language === 'so' ? 'Fariimaha Muhiimka ah' : 'Smart Insights'}
          </h3>
          <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-xl">
            <div className="flex gap-3">
              <TrendingUp className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <p className="text-sm font-bold text-teal-900">Highest Growth Area</p>
                <p className="text-sm text-teal-700">Hodan District is showing 15% more demand this month for Shop spacing.</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <p className="text-sm font-bold text-amber-900">Payment Risk Detected</p>
                <p className="text-sm text-amber-700">Wadajir District has 3 late payments. EVC Plus reminders recommended.</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-bold text-blue-900">Maintenance Needed</p>
                <p className="text-sm text-blue-700">Daynile District property "Daynile Heights" has 2 urgent water issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
