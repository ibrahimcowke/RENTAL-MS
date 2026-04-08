import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'landlord' | 'manager';
}

interface Property {
  id: string;
  name: string;
  district: string;
  address: string;
  type: string;
  rent: number;
  currency: string;
  status: 'available' | 'occupied' | 'maintenance';
}

interface Tenant {
  id: string;
  name: string;
  phone: string;
  familySize: number;
  reliability: number;
  status: string;
}

interface Payment {
  id: string;
  tenant: string;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'overdue' | 'partial';
}

interface MaintenanceRequest {
  id: string;
  property: string;
  title: string;
  priority: 'low' | 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'in_progress' | 'resolved';
  date: string;
}

interface AppState {
  user: UserProfile | null;
  language: 'so' | 'en';
  currency: 'USD' | 'SOS';
  isDarkMode: boolean;
  
  // Data
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];

  // Actions
  setUser: (user: UserProfile | null) => void;
  setLanguage: (lang: 'so' | 'en') => void;
  setCurrency: (cur: 'USD' | 'SOS') => void;
  toggleDarkMode: () => void;

  // CRUD Actions
  addProperty: (p: Property) => void;
  updateProperty: (p: Property) => void;
  deleteProperty: (id: string) => void;
  
  addTenant: (t: Tenant) => void;
  updateTenant: (t: Tenant) => void;
  deleteTenant: (id: string) => void;

  addPayment: (p: Payment) => void;
  updatePayment: (p: Payment) => void;
  deletePayment: (id: string) => void;

  addMaintenance: (m: MaintenanceRequest) => void;
  updateMaintenance: (m: MaintenanceRequest) => void;
  deleteMaintenance: (id: string) => void;
}

const initialProperties: Property[] = [
  { id: '1', name: 'Hodan Suite A', district: 'Hodan', address: 'Maka Al Mukarama', type: 'Apartment', rent: 450, currency: 'USD', status: 'occupied' },
  { id: '2', name: 'Wadajir Commercial', district: 'Wadajir', address: 'Airport Road', type: 'Shop', rent: 1200, currency: 'USD', status: 'available' },
];

const initialTenants: Tenant[] = [
  { id: '1', name: 'Mohamed Abdi', phone: '+252 61 555 1122', familySize: 5, reliability: 98, status: 'Active' },
  { id: '2', name: 'Fadumo Hirsi', phone: '+252 61 444 3344', familySize: 3, reliability: 100, status: 'Active' },
];

const initialPayments: Payment[] = [
  { id: '1', tenant: 'Mohamed Abdi', amount: 450, date: '2024-04-05', method: 'EVC Plus', status: 'paid' },
  { id: '2', tenant: 'Ahmed Duale', amount: 350, date: '2024-03-28', method: 'Cash', status: 'overdue' },
];

const initialMaintenance: MaintenanceRequest[] = [
  { id: '1', property: 'Hodan Suite A', title: 'Water Leak in Kitchen', priority: 'urgent', status: 'pending', date: '2024-04-07' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'so',
      currency: 'USD',
      isDarkMode: false,
      
      properties: initialProperties,
      tenants: initialTenants,
      payments: initialPayments,
      maintenance: initialMaintenance,

      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // CRUD
      addProperty: (p) => set((s) => ({ properties: [p, ...s.properties] })),
      updateProperty: (p) => set((s) => ({ properties: s.properties.map((i) => i.id === p.id ? p : i) })),
      deleteProperty: (id) => set((s) => ({ properties: s.properties.filter((i) => i.id !== id) })),

      addTenant: (t) => set((s) => ({ tenants: [t, ...s.tenants] })),
      updateTenant: (t) => set((s) => ({ tenants: s.tenants.map((i) => i.id === t.id ? t : i) })),
      deleteTenant: (id) => set((s) => ({ tenants: s.tenants.filter((i) => i.id !== id) })),

      addPayment: (p) => set((s) => ({ payments: [p, ...s.payments] })),
      updatePayment: (p) => set((s) => ({ payments: s.payments.map((i) => i.id === p.id ? p : i) })),
      deletePayment: (id) => set((s) => ({ payments: s.payments.filter((i) => i.id !== id) })),

      addMaintenance: (m) => set((s) => ({ maintenance: [m, ...s.maintenance] })),
      updateMaintenance: (m) => set((s) => ({ maintenance: s.maintenance.map((i) => i.id === m.id ? m : i) })),
      deleteMaintenance: (id) => set((s) => ({ maintenance: s.maintenance.filter((i) => i.id !== id) })),
    }),
    {
      name: 'mogadishu-rental-storage',
    }
  )
);
