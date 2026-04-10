-- ==============================================================================
-- RENTAL MANAGEMENT SYSTEM - FULL DATABASE SCHEMA & SEED
-- ==============================================================================
-- Project: Mogadishu Rental SaaS
-- Optimized for: Mogadishu Districts & Somali Payment Methods (EVC Plus, e-Dahab)
-- Version: 1.1.0 (Consolidated)
-- ==============================================================================

-- 1. BASE CONFIGURATION
-- ==============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE TABLES
-- ==============================================================================

-- DISTRICTS TABLE
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    region TEXT DEFAULT 'Banaadir',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROFILES (Extending Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    phone_number TEXT UNIQUE,
    role TEXT DEFAULT 'landlord' CHECK (role IN ('admin', 'landlord', 'manager')),
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    address TEXT,
    -- Updated to the new 3-type system: Apartment, Villa, Normal House
    property_type TEXT CHECK (property_type IN ('Apartment', 'Villa', 'Normal House')),
    parent_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    rent_amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'SOS')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    kitchens INTEGER DEFAULT 0,
    -- New columns from migration
    building_number INTEGER,
    floor_area DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TENANTS
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    national_id TEXT,
    family_size INTEGER,
    reliability_score INTEGER DEFAULT 100,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LEASES
CREATE TABLE IF NOT EXISTS leases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent DECIMAL(12,2) NOT NULL,
    agreement_type TEXT DEFAULT 'verbal' CHECK (agreement_type IN ('verbal', 'written')),
    voice_note_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'terminated', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT CHECK (payment_method IN ('EVC Plus', 'Cash', 'Bank Transfer', 'e-Dahab')),
    payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'partial', 'overdue')),
    transaction_id TEXT, -- For mobile money transaction codes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MAINTENANCE REQUESTS
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    voice_desc_url TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'urgent', 'emergency')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'cancelled')),
    image_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SECURITY & RLS POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Polices (Optimized for Landlord isolation)
CREATE POLICY "Public districts view" ON districts FOR SELECT USING (true);
CREATE POLICY "Landlords manage own data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Landlords manage own properties" ON properties FOR ALL USING (landlord_id = auth.uid() OR landlord_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Landlords manage own tenants" ON tenants FOR ALL USING (landlord_id = auth.uid() OR landlord_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Landlords manage own leases" ON leases FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_id AND (properties.landlord_id = auth.uid() OR properties.landlord_id = '00000000-0000-0000-0000-000000000000')));
CREATE POLICY "Landlords manage own payments" ON payments FOR ALL 
    USING (EXISTS (SELECT 1 FROM leases JOIN properties ON leases.property_id = properties.id WHERE leases.id = lease_id AND (properties.landlord_id = auth.uid() OR properties.landlord_id = '00000000-0000-0000-0000-000000000000')));
CREATE POLICY "Landlords manage own maintenance" ON maintenance_requests FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_id AND (properties.landlord_id = auth.uid() OR properties.landlord_id = '00000000-0000-0000-0000-000000000000')));
CREATE POLICY "Landlords manage own activity logs" ON activity_logs FOR ALL USING (user_id = auth.uid() OR user_id = '00000000-0000-0000-0000-000000000000');

-- 4. SEED DATA
-- ==============================================================================

-- Seed Districts (Including new districts from migration)
INSERT INTO districts (name) VALUES 
('Hodan'), ('Wadajir'), ('Daynile'), ('Karaan'), ('Yaqshid'), 
('Hamar Weyne'), ('Hamar Jajab'), ('Waaberi'), ('Bondhere'), 
('Abdiaziz'), ('Shibis'), ('Boondheere'), ('Dharkenley'), 
('Kaxda'), ('Hawl Wadaag'), ('Shingani'), ('Warta Nabada'),
('Daarusalaam'), ('Garasbaaleey')
ON CONFLICT (name) DO NOTHING;

-- Seed Script (Robust Dynamic Version)
DO $$ 
DECLARE
    landlord_id UUID;
    hodan_id UUID;
    wadajir_id UUID;
    karaan_id UUID;
    prop1_id UUID;
    prop2_id UUID;
    tenant1_id UUID;
    tenant2_id UUID;
    lease1_id UUID;
BEGIN
    -- 1. Determine Landlord ID
    SELECT id INTO landlord_id FROM auth.users LIMIT 1;
    IF landlord_id IS NULL THEN
        landlord_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- 2. Ensure Profile exists
    INSERT INTO profiles (id, full_name, phone_number, role)
    VALUES (landlord_id, 'Ali Ahmed Global (Demo)', '+252 61 777 0000', 'admin')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- 3. Get District IDs
    SELECT id INTO hodan_id FROM districts WHERE name = 'Hodan';
    SELECT id INTO wadajir_id FROM districts WHERE name = 'Wadajir';
    SELECT id INTO karaan_id FROM districts WHERE name = 'Karaan';

    -- 4. Create Properties (Updated with migration fields)
    INSERT INTO properties (name, landlord_id, district_id, address, property_type, rent_amount, currency, status, images, video_url, bedrooms, bathrooms, kitchens, building_number, floor_area)
    VALUES 
    ('Hodan Suite A', landlord_id, hodan_id, 'Maka Al Mukarama St', 'Apartment', 450, 'USD', 'occupied', 
     '{"https://images.unsplash.com/photo-1545324418-f1d3c5b53571?q=80&w=1000", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000"}', 
     'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, 2, 1, 101, 120.50),
    ('Karaan Heights', landlord_id, karaan_id, 'Lido Beach Ave', 'Apartment', 350, 'USD', 'occupied', 
     '{"https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1000"}', NULL, 2, 1, 1, 202, 95.00),
    ('Wadajir Commercial', landlord_id, wadajir_id, 'Airport Rd', 'Normal House', 1200, 'USD', 'available', '{}', NULL, 0, 1, 0, 50, 250.00)
    ON CONFLICT DO NOTHING;

    -- Get Property IDs
    SELECT id INTO prop1_id FROM properties WHERE name = 'Hodan Suite A' LIMIT 1;
    SELECT id INTO prop2_id FROM properties WHERE name = 'Karaan Heights' LIMIT 1;

    -- 5. Create Tenants
    INSERT INTO tenants (landlord_id, full_name, phone_number, family_size, reliability_score)
    VALUES 
    (landlord_id, 'Mohamed Abdi', '+252 61 555 1122', 5, 98),
    (landlord_id, 'Fadumo Hirsi', '+252 61 444 3344', 3, 100)
    ON CONFLICT (phone_number) DO NOTHING;

    SELECT id INTO tenant1_id FROM tenants WHERE full_name = 'Mohamed Abdi' LIMIT 1;
    SELECT id INTO tenant2_id FROM tenants WHERE full_name = 'Fadumo Hirsi' LIMIT 1;

    -- 6. Create Leases
    IF prop1_id IS NOT NULL AND tenant1_id IS NOT NULL THEN
        INSERT INTO leases (property_id, tenant_id, start_date, monthly_rent, agreement_type, status)
        VALUES (prop1_id, tenant1_id, '2024-01-01', 450, 'written', 'active')
        ON CONFLICT DO NOTHING;
    END IF;

    IF prop2_id IS NOT NULL AND tenant2_id IS NOT NULL THEN
        INSERT INTO leases (property_id, tenant_id, start_date, monthly_rent, agreement_type, status)
        VALUES (prop2_id, tenant2_id, '2023-03-15', 350, 'verbal', 'active')
        ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO lease1_id FROM leases WHERE property_id = prop1_id LIMIT 1;

    -- 7. Create Payments
    IF lease1_id IS NOT NULL THEN
        INSERT INTO payments (lease_id, amount_paid, payment_date, payment_method, payment_status, transaction_id)
        VALUES 
        (lease1_id, 450, '2024-01-05', 'EVC Plus', 'paid', 'TX-99218'),
        (lease1_id, 450, '2024-02-04', 'EVC Plus', 'paid', 'TX-88122')
        ON CONFLICT DO NOTHING;
    END IF;

    -- 8. Create Maintenance Requests
    IF prop1_id IS NOT NULL AND tenant1_id IS NOT NULL THEN
        INSERT INTO maintenance_requests (property_id, tenant_id, title, description, priority, status)
        VALUES 
        (prop1_id, tenant1_id, 'Water Leak in Kitchen', 'Sink pipe is leaking heavily.', 'urgent', 'pending')
        ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- 5. VERIFICATION & NOTIFICATION
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
