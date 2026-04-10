import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Trash2,
  Clock
} from 'lucide-react';
import { useStore, type AppNotification } from '../../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const NotificationCenter = () => {
  const { notifications, markAsRead, clearNotifications, language } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isOpen ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 mt-3 w-80 md:w-96 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  {language === 'so' ? 'Ogeysiisyada' : 'Notifications'}
                </h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      {language === 'so' ? 'Tirtir' : 'Clear All'}
                    </button>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                      <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">
                      {language === 'so' ? 'Ma jiraan ogeysiisyo hadda.' : 'No notifications yet.'}
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <motion.div
                      layout
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer group relative ${
                        n.read 
                          ? 'bg-transparent border-transparent opacity-60' 
                          : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                          n.type === 'error' ? 'bg-red-50' : 
                          n.type === 'warning' ? 'bg-amber-50' : 
                          n.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'
                        }`}>
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold truncate ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>
                            {n.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-medium leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-2 uppercase tracking-tighter">
                            <Clock className="w-2.5 h-2.5" />
                            {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                          </span>
                        </div>
                        {!n.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                <button className="text-xs font-bold text-primary hover:underline">
                  {language === 'so' ? 'Eeg dhamaan' : 'View full log'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
