import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Zap,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';
import { useStore } from '../../store/useStore';
import { generateReceiptPDF } from '../../lib/ReceiptService';
import DashboardStatCard from '../dashboard/DashboardStatCard';
import PaymentModal from './PaymentModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
};

const PaymentsPage = () => {
  const { language, payments, deletePayment, fetchData, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPayments = payments.filter(p => 
    p.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'overdue' || p.status === 'partial')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto bixintan?' : 'Are you sure you want to delete this payment record?')) {
      await deletePayment(id);
    }
  };

  const handleEdit = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleDownloadReceipt = (payment: any) => {
    generateReceiptPDF({
      receiptNumber: `RCP-${payment.id.substring(0, 6).toUpperCase()}`,
      tenantName: payment.tenant,
      amount: payment.amount,
      date: payment.date,
      paymentMethod: payment.method,
      propertyAddress: 'Managed Premium Portfolio Asset',
      language: language
    });

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00E2FF', '#3B82F6', '#10B981']
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. CINEMATIC REVENUE HERO */}
      <div className="bg-slate-900 pt-12 pb-32 px-4 md:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="max-w-[1600px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12 relative z-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Revenue Stream Synchronized</span>
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
               {language === 'so' ? 'Maamulka Lacagaha' : 'Revenue'}<br/>
               <span className="text-emerald-500 italic">{language === 'so' ? 'Command Center' : 'Command Center'}</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
               {language === 'so' 
                 ? 'La soco dakhliga ka soo baxa guryahaaga leh hufnaan sare iyo xisaabin saxsan.' 
                 : 'High-fidelity financial instrumentation for tracking yield, collection velocity, and historical ledger integrity.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={handleAdd}
                className="px-10 py-6 bg-emerald-600 text-white rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all border-none"
             >
                <Plus className="w-6 h-6" />
                {language === 'so' ? 'Record Revenue' : 'Record Revenue'}
             </button>
             <button 
                onClick={() => fetchData()}
                className="p-6 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-white/10 transition-all backdrop-blur-xl"
             >
                <RefreshCw className={cn("w-6 h-6", isLoading && "animate-spin")} />
             </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-20 relative z-20">
        
        {/* 2. REVENUE METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <DashboardStatCard 
            title={language === 'so' ? 'Wadarta La Helay' : 'Total Revenue'}
            value={`$${totalCollected.toLocaleString()}`}
            icon={ArrowUpRight}
            color="bg-emerald-600"
            trend={15.2}
            chartData={Array.from({ length: 15 }, (_, i) => ({ value: 10 + Math.random() * 80 }))}
          />
          <DashboardStatCard 
            title={language === 'so' ? 'Lacagaha Maqan' : 'Portfolio Receivables'}
            value={`$${pendingAmount.toLocaleString()}`}
            icon={Clock}
            color="bg-amber-500"
            trend={-8.4}
            chartData={Array.from({ length: 15 }, (_, i) => ({ value: 50 - Math.random() * 30 }))}
          />
          <DashboardStatCard 
            title={language === 'so' ? 'Heerka Bixinta' : 'Collection Velocity'}
            value="94.2%"
            icon={CheckCircle2}
            color="bg-primary"
            trend={2.1}
            chartData={Array.from({ length: 15 }, (_, i) => ({ value: 90 + Math.random() * 5 }))}
          />
        </div>

        {/* 3. TRANSACTION LEDGER */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder={language === 'so' ? 'Ka raadi bixinta...' : 'Search financial ledger by resident or channel...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-xl text-lg font-bold placeholder:text-slate-300"
              />
            </div>
            <button className="px-8 py-6 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-all shadow-lg active:scale-95">
               <Download className="w-5 h-5" />
               Export Ledger
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-zap p-1 overflow-hidden"
          >
            <div className="bg-white rounded-[2.5rem] overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-900 border-none">
                       <th className="px-10 py-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Operational Identity</th>
                       <th className="px-10 py-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Value Matrix</th>
                       <th className="px-10 py-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Channel</th>
                       <th className="px-10 py-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Verification Status</th>
                       <th className="px-10 py-8"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {isLoading ? (
                       <tr>
                          <td colSpan={5} className="px-10 py-32 text-center">
                             <RefreshCw className="w-16 h-16 animate-spin mx-auto mb-6 text-emerald-500 opacity-20" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Querying Distributed Ledger</p>
                          </td>
                       </tr>
                     ) : filteredPayments.map((payment) => (
                       <tr key={payment.id} className="hover:bg-slate-50/80 transition-all group">
                         <td className="px-10 py-8">
                           <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-xl">
                               <Wallet className="w-7 h-7" />
                             </div>
                             <div>
                                <p className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tighter">{payment.tenant}</p>
                                <div className="flex items-center gap-2 mt-1">
                                   <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{payment.date}</p>
                                </div>
                             </div>
                           </div>
                         </td>
                         <td className="px-10 py-8">
                           <div className="flex flex-col">
                              <span className="text-3xl font-black text-slate-900 tracking-tighter">${payment.amount.toLocaleString()}</span>
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">Operational Credit</span>
                           </div>
                         </td>
                         <td className="px-10 py-8 text-center md:text-left">
                           <span className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all shadow-sm">
                             {payment.method}
                           </span>
                         </td>
                         <td className="px-10 py-8">
                           <span className={cn(
                             "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] w-fit border shadow-sm transition-all group-hover:scale-105",
                             payment.status === 'paid' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100 shadow-emerald-100/50' :
                             payment.status === 'overdue' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50' :
                             'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50'
                           )}>
                             {payment.status === 'paid' && <CheckCircle2 className="w-4 h-4" />}
                             {payment.status === 'overdue' && <AlertCircle className="w-4 h-4" />}
                             {payment.status === 'partial' && <Clock className="w-4 h-4" />}
                             {payment.status}
                           </span>
                         </td>
                         <td className="px-10 py-8">
                           <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(payment); }}
                               className="p-4 bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all shadow-sm active:scale-75"
                               title="Download Receipt"
                             >
                               <Download className="w-6 h-6" />
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleEdit(payment); }}
                               className="p-4 bg-white border border-slate-100 hover:border-primary/30 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm active:scale-75"
                             >
                               <Edit className="w-6 h-6" />
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleDelete(payment.id); }}
                               className="p-4 bg-white border border-slate-100 hover:border-rose-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm active:scale-75"
                             >
                               <Trash2 className="w-6 h-6" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </motion.div>

          {filteredPayments.length === 0 && !isLoading && (
            <div className="py-40 text-center glass-zap rounded-[3rem] p-10 bg-slate-50/50 border-2 border-dashed border-slate-200">
               <DollarSign className="w-24 h-24 text-slate-200 mx-auto mb-8" />
               <h3 className="text-3xl font-black text-slate-400 tracking-tighter uppercase">No Financial Events</h3>
               <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest">Revenue records are currently null</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <PaymentModal 
            isOpen={true} 
            onClose={() => setIsModalOpen(false)} 
            payment={selectedPayment} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentsPage;
