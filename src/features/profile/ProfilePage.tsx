import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  MapPin, 
  Calendar,
  Settings,
  Bell,
  Lock,
  Globe,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const ProfilePage = () => {
  const { user, language, theme, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Ali Ahmed',
    phone_number: user?.phone_number || '+252 61 XXX XXXX',
    bio: user?.bio || 'Real estate manager based in Mogadishu.',
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Active Leases', value: '12', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Properties', value: '8', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Reliability', value: '98%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="h-80 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-24 -mb-24" />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-12">
           <div className="flex flex-col md:flex-row items-end gap-8 w-full">
              <div className="relative group">
                 <div className="w-40 h-40 rounded-[2.5rem] bg-white p-1 shadow-2xl relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-[2.3rem] bg-slate-100 flex items-center justify-center overflow-hidden">
                       {user?.avatar_url ? (
                         <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <User className="w-20 h-20 text-slate-300" />
                       )}
                    </div>
                 </div>
                 <button className="absolute bottom-2 right-2 z-20 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                    <Camera className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 mb-2">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">
                       {user?.role || 'Landlord'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                       <CheckCircle2 className="w-3 h-3" /> Certified User
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
                    {user?.full_name || 'Ali Ahmed'}
                 </h1>
                 <p className="text-white/60 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Hodan District, Mogadishu
                 </p>
              </div>

              <div className="flex gap-4 mb-2">
                 <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all"
                 >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                 </button>
                 {isEditing && (
                   <button 
                    onClick={handleSave}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                   >
                      Save Changes
                   </button>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* LEFT COLUMN - STATS & INFO */}
           <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Key Performance
                 </h3>
                 <div className="space-y-6">
                    {stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl transition-all group-hover:scale-110", stat.bg)}>
                               <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-slate-500 font-bold text-sm">{stat.label}</span>
                         </div>
                         <span className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Verification
                 </h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                       <span className="text-xs font-bold text-emerald-900">National ID Verified</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-blue-600" />
                       <span className="text-xs font-bold text-blue-900">Phone Verified</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* MAIN COLUMN - SETTINGS & DETAILS */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Account Intelligence</h2>
                    <div className="flex items-center gap-2">
                       <Settings className="w-5 h-5 text-slate-400" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Full Identity</label>
                       {isEditing ? (
                         <input 
                           type="text" 
                           value={formData.full_name}
                           onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                         />
                       ) : (
                         <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <User className="w-5 h-5 text-slate-300" />
                            <span className="font-bold text-slate-700">{user?.full_name || 'Ali Ahmed'}</span>
                         </div>
                       )}
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Secure Phone</label>
                       {isEditing ? (
                         <input 
                           type="text" 
                           value={formData.phone_number}
                           onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                         />
                       ) : (
                         <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <Phone className="w-5 h-5 text-slate-300" />
                            <span className="font-bold text-slate-700">{user?.phone_number || '+252 61 XXX XXXX'}</span>
                         </div>
                       )}
                    </div>

                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Management Bio</label>
                       {isEditing ? (
                         <textarea 
                           rows={4}
                           value={formData.bio}
                           onChange={(e) => setFormData({...formData, bio: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                         />
                       ) : (
                         <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 italic text-slate-500 font-medium">
                            "{user?.bio || 'Real estate manager based in Mogadishu.'}"
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="mt-12 pt-12 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <button className="flex flex-col items-center gap-3 p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group text-center">
                          <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                             <Lock className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">Security</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Password & 2FA</p>
                          </div>
                       </button>

                       <button className="flex flex-col items-center gap-3 p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group text-center">
                          <div className="w-12 h-12 rounded-[1.25rem] bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                             <Bell className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">Alerts</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Notifications</p>
                          </div>
                       </button>

                       <button className="flex flex-col items-center gap-3 p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group text-center">
                          <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                             <Calendar className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">History</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Audit Logs</p>
                          </div>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
