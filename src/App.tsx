import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { useStore } from './store/useStore';

function App() {
  const { user } = useStore();

  // Simple Mock Auth Wrapper
  if (!user && false) { // Set to true to force login
    return <div className="flex items-center justify-center h-screen bg-slate-50">Login Required (Implementation Pending)</div>;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar aria-label="Desktop Sidebar" />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <TopBar />
          
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          
          <MobileNav aria-label="Mobile Bottom Navigation" />
        </main>
      </div>
    </Router>
  );
}

export default App;
