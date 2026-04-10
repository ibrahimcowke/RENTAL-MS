import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number?: string;
  role: 'admin' | 'landlord' | 'manager';
  avatar_url?: string;
  bio?: string;
}

export type AppTheme = 'ocean' | 'midnight' | 'rose' | 'desert' | 'arctic' | 'forest' | 'slate';

interface Property {
  id: string;
  name: string;
  district: string;
  district_id?: string;
  address: string;
  property_type: 'Apartment' | 'Villa' | 'Normal House';
  building_number?: number; // Apartment only: 1, 2, 3, 5
  rent_amount: number;
  currency: 'USD' | 'SOS';
  status: 'available' | 'occupied' | 'maintenance';
  images: string[];
  video_url?: string;
  bedrooms: number;   // Apartment sections only
  bathrooms: number;  // Apartment sections only
  kitchens: number;   // Apartment sections only
  floor_area?: number; // Villa / Normal House sections
  parent_id?: string;
  description?: string;
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
  description?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  read: boolean;
}

interface AppState {
  user: UserProfile | null;
  language: 'so' | 'en';
  currency: 'USD' | 'SOS';
  isDarkMode: boolean;
  isLoading: boolean;
  theme: AppTheme;
  
  // Data
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];
  notifications: AppNotification[];
  allProfiles: UserProfile[];

  // Actions
  setUser: (user: UserProfile | null) => void;
  setLanguage: (lang: 'so' | 'en') => void;
  setCurrency: (cur: 'USD' | 'SOS') => void;
  setTheme: (theme: AppTheme) => void;
  toggleDarkMode: () => void;
  fetchData: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Notification Actions
  addNotification: (n: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;

  // CRUD Actions
  addProperty: (p: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (p: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  addTenant: (t: Omit<Tenant, 'id'>) => Promise<void>;
  updateTenant: (t: Tenant) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;

  addPayment: (p: Omit<Payment, 'id'>) => Promise<void>;
  updatePayment: (p: Payment) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;

  addMaintenance: (m: Omit<MaintenanceRequest, 'id'>) => Promise<void>;
  updateMaintenance: (m: MaintenanceRequest) => Promise<void>;
  deleteMaintenance: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'so',
      currency: 'USD',
      isDarkMode: false,
      isLoading: false,
      theme: 'ocean' as AppTheme,
      
      properties: [],
      tenants: [],
      payments: [],
      maintenance: [],
      notifications: [],
      allProfiles: [],

      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => document.documentElement.classList.remove('theme-transition'), 400);
      },
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      fetchProfiles: async () => {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        set({ allProfiles: data || [] });
      },

      updateProfile: async (updates) => {
        const { user } = useStore.getState();
        if (!user) return;
        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
        if (error) throw error;
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updates } : null,
          allProfiles: state.allProfiles.map(p => p.id === user.id ? { ...p, ...updates } : p)
        }));
        toast.success('Profile updated');
      },

      addNotification: (n) => set((state) => ({
        notifications: [
          {
            ...n,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
            read: false,
          },
          ...state.notifications,
        ].slice(0, 20), // Keep last 20
      })),

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),

      clearNotifications: () => set({ notifications: [] }),

      fetchData: async () => {
        set({ isLoading: true });
        try {
          const [props, dits, tens, pays, mains] = await Promise.all([
            supabase.from('properties').select('*').order('created_at', { ascending: false }),
            supabase.from('districts').select('*'),
            supabase.from('tenants').select('*').order('created_at', { ascending: false }),
            supabase.from('payments').select('*').order('created_at', { ascending: false }),
            supabase.from('maintenance_requests').select('*').order('created_at', { ascending: false }),
          ]);

          const districtMap = (dits.data || []).reduce((acc: any, d: any) => {
            acc[d.id] = d.name;
            return acc;
          }, {});

          const mappedProperties = (props.data || []).map(p => ({
            ...p,
            district: districtMap[p.district_id] || 'Unknown',
            rent_amount: p.rent_amount || 0,
            images: p.images || [],
            video_url: p.video_url || '',
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            kitchens: p.kitchens || 0,
            floor_area: p.floor_area || null,
            building_number: p.building_number || null,
            parent_id: p.parent_id || null
          }));

          const mappedPayments = pays.data?.map(p => ({
            id: p.id,
            tenant: 'Lease ID: ' + p.lease_id,
            amount: p.amount_paid,
            date: p.payment_date,
            method: p.payment_method,
            status: p.payment_status
          })) || [];

          set({ 
            properties: mappedProperties, 
            tenants: tens.data?.map(t => ({ 
              id: t.id, 
              name: t.full_name, 
              phone: t.phone_number, 
              familySize: t.family_size, 
              reliability: t.reliability_score, 
              status: 'Active' 
            })) || [],
            payments: mappedPayments,
            maintenance: mains.data || [] 
          });

          // Generate auto-notifications for premium feel
          const newNotifications: any[] = [];
          
          // Check for overdue payments
          mappedPayments.filter(p => p.status === 'overdue').forEach(p => {
             newNotifications.push({
                title: 'Payment Overdue',
                message: `Payment of $${p.amount} is overdue for ${p.tenant}`,
                type: 'error'
             });
          });

          // Check for urgent maintenance
          mains.data?.filter(m => m.priority === 'urgent' || m.priority === 'emergency').forEach(m => {
             newNotifications.push({
                title: 'Emergency Maintenance',
                message: `Urgent request: ${m.title} at ${m.property}`,
                type: 'warning'
             });
          });

          if (newNotifications.length > 0) {
            set((state) => ({
              notifications: [
                ...newNotifications.map(n => ({
                  ...n,
                  id: Math.random().toString(36).substring(7),
                  date: new Date().toISOString(),
                  read: false
                })),
                ...state.notifications
              ].filter((v, i, a) => a.findIndex(t => (t.message === v.message)) === i).slice(0, 20)
            }));
          }

        } catch (error) {
          console.error('Fetch error:', error);
          toast.error('Failed to load data from server');
        } finally {
          set({ isLoading: false });
        }
      },

      // CRUD - PROPERTIES
      addProperty: async (p) => {
        const { data, error } = await supabase.from('properties').insert([p]).select();
        if (error) throw error;
        set((s) => ({ properties: [data[0], ...s.properties] }));
        toast.success('Property added successfully');
      },
      updateProperty: async (p) => {
        const { error } = await supabase.from('properties').update(p).eq('id', p.id);
        if (error) throw error;
        set((s) => ({ properties: s.properties.map((i) => i.id === p.id ? p : i) }));
        toast.success('Property updated');
      },
      deleteProperty: async (id) => {
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) throw error;
        set((s) => ({ properties: s.properties.filter((i) => i.id !== id) }));
        toast.success('Property deleted');
      },

      // CRUD - TENANTS (Mapping for simplicity in prototype)
      addTenant: async (t) => {
        const payload = { full_name: t.name, phone_number: t.phone, family_size: t.familySize, reliability_score: t.reliability };
        const { data, error } = await supabase.from('tenants').insert([payload]).select();
        if (error) throw error;
        const newT = { id: data[0].id, name: data[0].full_name, phone: data[0].phone_number, familySize: data[0].family_size, reliability: data[0].reliability_score, status: 'Active' };
        set((s) => ({ tenants: [newT, ...s.tenants] }));
        toast.success('Tenant added');
      },
      updateTenant: async (t) => {
        const payload = { full_name: t.name, phone_number: t.phone, family_size: t.familySize, reliability_score: t.reliability };
        const { error } = await supabase.from('tenants').update(payload).eq('id', t.id);
        if (error) throw error;
        set((s) => ({ tenants: s.tenants.map((i) => i.id === t.id ? t : i) }));
        toast.success('Tenant profile updated');
      },
      deleteTenant: async (id) => {
        const { error } = await supabase.from('tenants').delete().eq('id', id);
        if (error) throw error;
        set((s) => ({ tenants: s.tenants.filter((i) => i.id !== id) }));
        toast.success('Tenant removed');
      },

      // CRUD - PAYMENTS
      addPayment: async (p) => {
        // Simplified: missing lease mapping but demonstrating the pattern
        set((s) => ({ payments: [{...p, id: Math.random().toString()}, ...s.payments] }));
        toast.success('Payment recorded locally');
      },
      updatePayment: async (p) => {
        set((s) => ({ payments: s.payments.map((i) => i.id === p.id ? p : i) }));
      },
      deletePayment: async (id) => {
        set((s) => ({ payments: s.payments.filter((i) => i.id !== id) }));
      },

      // CRUD - MAINTENANCE
      addMaintenance: async (m) => {
        const { data, error } = await supabase.from('maintenance_requests').insert([m]).select();
        if (error) throw error;
        set((s) => ({ maintenance: [data[0], ...s.maintenance] }));
        toast.success('Request sent');
      },
      updateMaintenance: async (m) => {
        const { error } = await supabase.from('maintenance_requests').update(m).eq('id', m.id);
        if (error) throw error;
        set((s) => ({ maintenance: s.maintenance.map((i) => i.id === m.id ? m : i) }));
      },
      deleteMaintenance: async (id) => {
        const { error } = await supabase.from('maintenance_requests').delete().eq('id', id);
        if (error) throw error;
        set((s) => ({ maintenance: s.maintenance.filter((i) => i.id !== id) }));
      },
    }),
    {
      name: 'mogadishu-rental-storage',
    }
  )
);
