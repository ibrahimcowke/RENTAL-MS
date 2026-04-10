import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

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
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -12, scale: 1.05 }}
      className={cn(
        "hyper-glass p-[1px] group relative overflow-hidden h-full rounded-[2.5rem]",
        isPositive ? "hover:neon-glow-emerald" : "hover:neon-glow-rose"
      )}
    >
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.2rem] p-8 flex flex-col justify-between h-full relative overflow-hidden">
        {/* Holographic Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        
        {/* Background Decorative Icon */}
        <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-20 transition-all duration-700 -rotate-12 group-hover:rotate-0 group-hover:scale-150">
          <Icon className="w-32 h-32 text-white" />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-[1.5rem] text-white flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-6",
            color,
            isPositive ? "neon-glow-emerald" : "neon-glow-rose"
          )}>
            <Icon className="w-8 h-8" />
          </div>
          <div className={cn(
            "flex items-center gap-2 text-[11px] font-black px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/5",
            isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        </div>

        <div className="mt-10 relative z-10">
          <h3 className="text-5xl font-black text-white tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left drop-shadow-2xl">
            {value}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 ml-1 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" />
             {title}
          </p>
        </div>

        {/* High-Fidelity Sparkline */}
        <div className="h-20 w-full mt-8 -mx-8 -mb-8 relative opacity-40 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? '#10B981' : '#F43F5E'} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill={`url(#gradient-${title})`} 
                  isAnimationActive={true}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardStatCard;
