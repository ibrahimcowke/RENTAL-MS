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
      bg: 'bg-emerald-50'
    },
    {
      id: 2,
      type: 'tenant',
      title: language === 'so' ? 'Kireyste Cusub' : 'New Tenant',
      desc: `Mohamud Hassan joined Wardhiigleey`,
      time: '1 hour ago',
      icon: UserPlus,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'maintenance',
      title: language === 'so' ? 'Codsi Dayactir' : 'Maintenance Request',
      desc: 'Leaking pipe in Section A4',
      time: '3 hours ago',
      icon: Wrench,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      id: 4,
      type: 'property',
      title: language === 'so' ? 'Guri la diwaangeliyey' : 'Property Registered',
      desc: properties[1]?.name || 'Villa Al-Noor',
      time: 'Yesterday',
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/5'
    }
  ];

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          {language === 'so' ? 'Dhaqdhaqaaqii dambe' : 'Recent Activity'}
        </h3>
        <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1 group">
          View All
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            variants={activityItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 relative group"
          >
            {/* Timeline line */}
            {idx !== activities.length - 1 && (
              <div className="absolute left-6 top-10 bottom-[-24px] w-px bg-slate-100 group-last:hidden" />
            )}

            <div className={`w-12 h-12 rounded-xl ${activity.bg} ${activity.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
              <activity.icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{activity.title}</h4>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{activity.time}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">{activity.desc}</p>
              {activity.type === 'payment' && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Summary Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Health</span>
          </div>
          <span className="text-xs font-black text-slate-800">OPTIMAL</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
