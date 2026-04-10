import { motion } from 'framer-motion';
import { 
  DollarSign, 
  UserPlus, 
  Wrench, 
  Building2, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const activityItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const RecentActivity = () => {
  const { language, properties } = useStore();

  // Mocked activities based on current state + some variety
  const activities = [
    {
      id: 1,
      type: 'payment',
      title: language === 'so' ? 'Lacag la helay' : 'Payment Received',
      desc: `A. Ahmed - ${properties[0]?.name || 'Apartment 302'}`,
      time: '2 mins ago',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 2,
      type: 'tenant',
      title: language === 'so' ? 'Kireyste Cusub' : 'New Tenant',
      desc: `Mohamud Hassan joined Wardhiigleey`,
      time: '1 hour ago',
      icon: UserPlus,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      id: 3,
      type: 'maintenance',
      title: language === 'so' ? 'Codsi Dayactir' : 'Maintenance Request',
      desc: 'Leaking pipe in Section A4',
      time: '3 hours ago',
      icon: Wrench,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      id: 4,
      type: 'property',
      title: language === 'so' ? 'Guri la diwaangeliyey' : 'Property Registered',
      desc: properties[1]?.name || 'Villa Al-Noor',
      time: 'Yesterday',
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/10'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-zap p-1 h-full"
    >
      <div className="bg-white rounded-[2rem] p-6 h-full flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl">
               <Clock className="w-5 h-5 text-slate-400" />
            </div>
            {language === 'so' ? 'Dhaqdhaqaaqii dambe' : 'Portfolio Stream'}
          </h3>
          <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-[0.2em] flex items-center gap-2 group">
            Audit Log
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-8 flex-1 relative">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              variants={activityItemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: idx * 0.1 }}
              className="flex gap-5 relative group"
            >
              {/* Timeline line */}
              {idx !== activities.length - 1 && (
                <div className="absolute left-6 top-10 bottom-[-32px] w-[2px] bg-slate-50 group-hover:bg-primary/10 transition-colors" />
              )}

              <div className={`w-12 h-12 rounded-2xl ${activity.bg} ${activity.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                <activity.icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{activity.title}</h4>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">{activity.time}</span>
                </div>
                <p className="text-xs text-slate-500 font-bold opacity-60 line-clamp-1">{activity.desc}</p>
                {activity.type === 'payment' && (
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit shadow-sm border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    LIVE VERIFICATION
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Summary Footer */}
        <div className="mt-10 pt-6 border-t border-slate-50">
          <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
               <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 relative" />
               </div>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Operational Pulse</span>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/20 px-3 py-1 rounded-lg bg-white/5">OPTIMAL</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
