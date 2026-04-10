import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Settings, 
  UserPlus, 
  Search,
  MoreVertical,
  ShieldAlert,
  Shield,
  CheckCircle2,
  Trash2,
  Lock,
  Zap,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

const AdminPage = () => {
  const { allProfiles, fetchProfiles, language, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const stats = [
    { label: 'Total Users', value: allProfiles.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Cloud Revenue', value: '$45,280', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Sessions', value: '12', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'System Health', value: '100%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const filteredProfiles = allProfiles.filter(p => 
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. CINEMATIC PANEL HEADER */}
      <div className="bg-slate-900 pt-12 pb-32 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="px-4 py-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/20 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Neural Core Active</span>
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
               Admin<br/>
               <span className="text-red-500 italic">Command Center</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
               Global system intelligence and user lifecycle management. Control access, monitor performance, and secure the network.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                className="px-10 py-6 bg-red-600 text-white rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all border-none"
             >
                <Lock className="w-6 h-6" />
                Security Audit
             </button>
             <button 
                className="p-6 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-white/10 transition-all backdrop-blur-xl"
             >
                <Settings className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-20 relative z-20">
        
        {/* 2. SYSTEM STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={i} 
               className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 group hover:scale-[1.02] transition-all cursor-pointer"
             >
                <div className="flex items-center justify-between mb-6">
                   <div className={cn("p-4 rounded-[1.5rem] transition-all group-hover:rotate-12", stat.bg)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                   </div>
                   <Zap className="w-4 h-4 text-slate-200" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
             </motion.div>
          ))}
        </div>

        {/* 3. USER MANAGEMENT */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
           <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-slate-50/50">
              <div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">User Hierarchy</h2>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Active Licenses: {allProfiles.length}</p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500" />
                    <input 
                      type="text" 
                      placeholder="Filter by name or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all font-bold text-sm"
                    />
                 </div>
                 <button className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-xl">
                    <UserPlus className="w-6 h-6" />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity</th>
                       <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Role Access</th>
                       <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Security Status</th>
                       <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredProfiles.map((p) => (
                       <tr key={p.id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 overflow-hidden relative group-hover:rotate-3 transition-transform">
                                   {p.avatar_url ? (
                                      <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                                   ) : (
                                      <span>{p.full_name.charAt(0)}</span>
                                   )}
                                </div>
                                <div>
                                   <p className="text-lg font-black text-slate-900 tracking-tighter">{p.full_name}</p>
                                   <p className="text-xs font-bold text-slate-400">{p.id.substring(0, 8)}...</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border",
                                p.role === 'admin' ? "bg-red-50 border-red-100 text-red-600" : 
                                p.role === 'manager' ? "bg-amber-50 border-amber-100 text-amber-600" : 
                                "bg-blue-50 border-blue-100 text-blue-600"
                             )}>
                                {p.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                {p.role}
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Authorized</span>
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Last Login: Today</p>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                                   <MoreVertical className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                                   <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* 4. ACTIVITY AUDIT */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-8 flex items-center justify-between">
                 Global Activity Log
                 <span className="text-[10px] text-primary">{new Date().toLocaleDateString()}</span>
              </h3>
              <div className="space-y-6">
                 {[
                   { user: 'Ali Ahmed', action: 'Modified Property', time: '2m ago', color: 'bg-emerald-50 text-emerald-500' },
                   { user: 'System', action: 'Database Backup Complete', time: '45m ago', color: 'bg-blue-50 text-blue-500' },
                   { user: 'Manager Jay', action: 'Approved Maintenance', time: '1h ago', color: 'bg-amber-50 text-amber-500' },
                   { user: 'Admin', action: 'Updated Global Tax Rate', time: '3h ago', color: 'bg-red-50 text-red-500' },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className={cn("p-2 rounded-lg font-black text-[10px]", log.color)}>
                            {log.user.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{log.action}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter text-left">{log.user}</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{log.time}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
              <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-8">Security Overview</h3>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Encryption Status</p>
                       <p className="text-white font-bold">AES-256 Multi-Layer</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Firewall Active</p>
                       <p className="text-white font-bold">Intrusion Prevention V4.2</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                 </div>
                 <div className="pt-8 border-t border-white/10">
                    <button className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-200 transition-all">
                       Revoke All Tokens
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
