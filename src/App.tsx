import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';

// Feature Pages
import DashboardPage from './features/dashboard/DashboardPage';
import PropertiesPage from './features/properties/PropertiesPage';
import TenantsPage from './features/tenants/TenantsPage';
import PaymentsPage from './features/payments/PaymentsPage';
import MaintenancePage from './features/maintenance/MaintenancePage';
import ReportsPage from './features/reports/ReportsPage';
import AdminPage from './features/admin/AdminPage';
import ProfilePage from './features/profile/ProfilePage';
import { useStore } from './store/useStore';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);

function AppContent() {
  const { user, theme, setUser, fetchData } = useStore();
  const location = useLocation();

  // Apply persisted theme on boot
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'ocean');
    fetchData(); // Ensure data is loaded
  }, [theme, fetchData]);

  // Set default user for demo if none exists
  useEffect(() => {
    if (!user) {
      setUser({
        id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Ali Ahmed',
        role: 'admin',
        phone_number: '+252 61 777 0000',
        bio: 'Chief Executive Administrator at Mogadishu Rental Systems.'
      });
    }
  }, [user, setUser]);

  // Simple Mock Auth Wrapper
  if (!user && false) { // Set to true to force login
    return <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-900 font-bold">Login Required</div>;
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar aria-label="Desktop Sidebar" />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><DashboardPage /></PageWrapper>} />
              <Route path="/properties" element={<PageWrapper><PropertiesPage /></PageWrapper>} />
              <Route path="/tenants" element={<PageWrapper><TenantsPage /></PageWrapper>} />
              <Route path="/payments" element={<PageWrapper><PaymentsPage /></PageWrapper>} />
              <Route path="/maintenance" element={<PageWrapper><MaintenancePage /></PageWrapper>} />
              <Route path="/reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
              <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
              <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
        
        <MobileNav aria-label="Mobile Bottom Navigation" />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
