import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  RefreshCw,
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '../../store/useStore';
import { generateReceiptPDF } from '../../lib/ReceiptService';
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
      propertyAddress: 'Managed Premium Property', // Simplified for demo
      language: language
    });

    // Premium Feedback
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0F766E', '#F59E0B', '#14B8A6']
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-up pb-24 md:pb-8">
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            {language === 'so' ? 'Maamulka Lacagaha' : 'Payment Management'}
          </h1>
          <p className="text-slate-500 font-medium">
            {language === 'so' ? 'La soco dakhliga ka soo baxa guryahaaga.' : 'Track rental income and payment history.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchData()}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all hover:bg-slate-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleAdd} className="btn-primary">
            <Plus className="w-5 h-5" />
            {language === 'so' ? 'Xaree Lacag' : 'Record Payment'}
          </button>
        </div>
      </motion.div>

      {/* Financial Overview */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="glass-card p-6 bg-gradient-to-br from-primary to-blue-600 text-white border-none shadow-xl shadow-primary/20">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">Bishan</span>
          </div>
          <p className="text-sm font-medium opacity-80">{language === 'so' ? 'Wadarta la aruuriyay' : 'Total Collected'}</p>
          <p className="text-3xl font-bold mt-1">${totalCollected.toLocaleString()}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 border-slate-100 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">{language === 'so' ? 'Lacagaha maqan' : 'Pending Amount'}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">${pendingAmount.toLocaleString()}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 border-slate-100 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">{language === 'so' ? 'Bixiyayaasha' : 'Payment Success Rate'}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">94.2%</p>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={language === 'so' ? 'Ka raadi kireeyaha ama habka bixinta...' : 'Search by tenant or method...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4" />
          {language === 'so' ? 'Shaandheey' : 'Filter'}
        </button>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden border-slate-100 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Kireeyaha' : 'Tenant'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'CADADKA' : 'Amount'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'TAARIIXDA' : 'Date'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'HABKA' : 'Method'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'XAALADDA' : 'Status'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      {language === 'so' ? 'Waa la soo raryaa...' : 'Fetching transactions...'}
                   </td>
                </tr>
              ) : filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{payment.tenant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-600">${payment.amount}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-sm">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200/50">
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border ${
                      payment.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      payment.status === 'overdue' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {payment.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {payment.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                      {payment.status === 'partial' && <Clock className="w-3 h-3" />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDownloadReceipt(payment)}
                        className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 hover:text-emerald-500 transition-all"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(payment)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(payment.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPayments.length === 0 && !isLoading && (
            <div className="py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                 <DollarSign className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-slate-500 font-medium">{language === 'so' ? 'Ma jiro dakhli la helay.' : 'No payment records found.'}</p>
            </div>
          )}
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        payment={selectedPayment} 
      />
    </div>
  );
};

export default PaymentsPage;
