import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  profiles: {
    id: string;
    full_name: string;
    phone_number: string;
    role: 'admin' | 'landlord' | 'manager';
    avatar_url?: string;
  };
  districts: {
    id: string;
    name: string;
    region: string;
  };
  properties: {
    id: string;
    landlord_id: string;
    name: string;
    district_id: string;
    address: string;
    property_type: 'House' | 'Apartment' | 'Room' | 'Shop';
    rent_amount: number;
    currency: 'USD' | 'SOS';
    status: 'available' | 'occupied' | 'maintenance';
    images: string[];
  };
  // Add other types as needed
};
