import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Activity, Zap, ArrowUpRight } from 'lucide-react';

const mockActivityData = [
  { time: '00:00', value: 45 },
  { time: '04:00', value: 30 },
  { time: '08:00', value: 85 },
  { time: '12:00', value: 65 },
  { time: '16:00', value: 95 },
  { time: '20:00', value: 70 },
  { time: '23:59', value: 90 },
];

const PortfolioPulse = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-zap p-1 overflow-hidden relative group"
    >
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.2rem] p-6 h-full border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/20 animate-pulse" />
               <Activity className="w-6 h-6 text-primary relative z-10" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-widest uppercase opacity-80">Portfolio Pulse</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                 <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live Monitoring</p>
              </div>
            </div>
          </div>
          <div className="text-right">
             <p className="text-2xl font-black text-white tracking-tighter">94.2<span className="text-sm opacity-40 ml-1">v/s</span></p>
             <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Operational Velocity</p>
          </div>
        </div>

        <div className="h-24 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockActivityData}>
              <defs>
                <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#pulseGradient)" 
                isAnimationActive={true}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Animated Glow Dot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_#3B82F6] animate-pulse" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-secondary" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Peak Hour</span>
             </div>
             <p className="text-xs font-black text-white">08:00 - 10:00 AM</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
             </div>
             <p className="text-xs font-black text-white">UP 12.4% TODAY</p>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
    </motion.div>
  );
};

export default PortfolioPulse;
