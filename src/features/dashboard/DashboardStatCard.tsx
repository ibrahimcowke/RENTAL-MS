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
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col justify-between group h-full relative overflow-hidden"
    >
      {/* Background Icon Decoration */}
      <div className="absolute top-[-10%] right-[-5%] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Icon className="w-24 h-24" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>

      {/* Mini Sparkline */}
      <div className="h-12 w-full mt-4 -mx-6 -mb-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? '#10B981' : '#EF4444'} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill={`url(#gradient-${title})`} 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DashboardStatCard;
