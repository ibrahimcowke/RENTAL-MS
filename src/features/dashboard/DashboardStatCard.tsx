import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string;
  icon: any;
  color: string;
  trend: number; // Percentage change
  chartData: any[];
}

const DashboardStatCard = ({ title, value, icon: Icon, color, trend, chartData }: DashboardStatCardProps) => {
  const isPositive = trend >= 0;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-zap p-1 group relative overflow-hidden h-full"
    >
      <div className="bg-white rounded-[2rem] p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-slate-50">
        {/* Background Icon Decoration */}
        <div className="absolute top-[-5%] right-[-5%] opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:rotate-12 group-hover:scale-125">
          <Icon className="w-32 h-32" />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className={cn(
            "w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-6",
            color
          )}>
            <Icon className="w-7 h-7" />
          </div>
          <div className={cn(
            "flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm transition-all group-hover:shadow-md",
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          )}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-0.5">{title}</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-primary transition-colors">{value}</h3>
        </div>

        {/* Mini Sparkline */}
        <div className="h-16 w-full mt-6 -mx-6 -mb-6 relative pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? '#10B981' : '#F43F5E'} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill={`url(#gradient-${title})`} 
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardStatCard;
