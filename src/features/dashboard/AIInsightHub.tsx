import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Target,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-zap p-1 relative overflow-hidden group"
    >
      <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 relative overflow-hidden">
        {/* Holographic Overlays */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] group-hover:bg-secondary/10 transition-all duration-1000" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:rotate-3 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-8 h-8 text-white animate-pulse relative z-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                  {language === 'so' ? 'Warbixinta Guud' : 'Portfolio Insights'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex gap-0.5">
                      {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                   </div>
                   <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Automated Analysis</p>
                </div>
              </div>
            </div>
            <button className="p-4 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-75">
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insights.map((insight, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group/item"
              >
                <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover/item:scale-110 group-hover/item:-rotate-3 shadow-sm",
                   insight.bg, insight.color
                )}>
                  <insight.icon className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 mb-2 tracking-tight text-lg">{insight.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed opacity-80">
                  {insight.message}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute inset-0" />
                 <div className="w-3 h-3 bg-primary rounded-full relative" />
              </div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">System Status</p>
                <p className="text-[10px] text-slate-400 font-bold">All property data is up to date</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-[10px] font-black text-white uppercase tracking-widest rounded-xl transition-all border border-white/5">
              Recalculate Insights
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsightHub;
