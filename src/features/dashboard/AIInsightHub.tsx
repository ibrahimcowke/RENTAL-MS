import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const AIInsightHub = () => {
  const { properties, payments, language } = useStore();

  // Logic to derive premium insights
  const totalOccupied = properties.filter(p => p.status === 'occupied').length;
  const occupancyRate = properties.length > 0 ? (totalOccupied / properties.length) * 100 : 0;
  
  const unpaidAmount = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const insights = [
    {
      title: language === 'so' ? 'Kordhinta Dakhliga' : 'Revenue Optimization',
      message: language === 'so' 
        ? `Waxaad kordhin kartaa dakhliga 12% adoo hagaajinaya qiimaha guryaha degmada Hodan.`
        : `Potential to increase monthly revenue by 12% by adjusting rates in Hodan District.`,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: language === 'so' ? 'Badbaadada Dakhliga' : 'Revenue at Risk',
      message: language === 'so'
        ? `$${unpaidAmount} ayaa halis ugu jira dib u dhac. Waxaan ku talinaynaa in la diro fariimo xusuusin ah.`
        : `$${unpaidAmount} is currently at risk due to overdue payments. SMS reminders recommended.`,
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: language === 'so' ? 'Yoolka Qabsashada' : 'Occupancy Target',
      message: language === 'so'
        ? `Heerka qabsashadaadu waa ${occupancyRate.toFixed(1)}%. Waxaad u baahan tahay 3 kireyste oo cusub si aad u gaarto 100%.`
        : `Your current occupancy is ${occupancyRate.toFixed(1)}%. You need 3 more tenants to reach full capacity.`,
      icon: Target,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-700" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'so' ? 'Malaika AI Advisor' : 'Malaika Advisor'}
              </h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 fill-primary" />
                Premium Intelligence
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-3xl bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`w-10 h-10 ${insight.bg} ${insight.color} rounded-xl flex items-center justify-center mb-4`}>
                <insight.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{insight.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {insight.message}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              AI Analysis active: 100% Data coverage
            </p>
          </div>
          <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest underline underline-offset-4">
            Recalculate Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightHub;
