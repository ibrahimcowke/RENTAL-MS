-- MOGADISHU RENTAL MANAGEMENT SYSTEM SCHEMA
-- Optimized for Mogadishu Districts & Somali Payment Methods

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DISTRICTS TABLE
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    region TEXT DEFAULT 'Banaadir',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Districts
INSERT INTO districts (name) VALUES 
('Hodan'), ('Wadajir'), ('Daynile'), ('Karaan'), ('Yaqshid'), 
('Hamar Weyne'), ('Hamar Jajab'), ('Waaberi'), ('Bondhere'), 
('Abdiaziz'), ('Shibis'), ('Boondheere'), ('Dharkenley'), 
('Kaxda'), ('Hawl Wadaag'), ('Shingani'), ('Warta Nabada')
ON CONFLICT (name) DO NOTHING;

-- 2. PROFILES (Extending Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT UNIQUE,
    role TEXT DEFAULT 'landlord' CHECK (role IN ('admin', 'landlord', 'manager')),
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    district_id UUID REFERENCES districts(id),
    address TEXT,
    property_type TEXT CHECK (property_type IN ('House', 'Apartment', 'Room', 'Shop')),
    rent_amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'SOS')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    images TEXT[] DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TENANTS
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

-- 5. LEASES
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

-- 6. PAYMENTS
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

-- 7. MAINTENANCE REQUESTS
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

-- 8. ANALYTICS / AUDIT LOG (Internal)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can see and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Districts: Everyone authenticated can view
CREATE POLICY "Districts are viewable by everyone" ON districts FOR SELECT TO authenticated USING (true);

-- Properties: Landlords can manage their own properties
CREATE POLICY "Landlords can manage own properties" ON properties 
    USING (landlord_id = auth.uid())
    WITH CHECK (landlord_id = auth.uid());

-- Tenants: Landlords can manage their own tenants
CREATE POLICY "Landlords can manage own tenants" ON tenants 
    USING (landlord_id = auth.uid())
    WITH CHECK (landlord_id = auth.uid());

-- Leases: Tied to landlord through property
CREATE POLICY "Landlords can manage own leases" ON leases 
    USING (EXISTS (
        SELECT 1 FROM properties WHERE properties.id = property_id AND properties.landlord_id = auth.uid()
    ));

-- Payments: Tied to landlord through lease
CREATE POLICY "Landlords can manage own payments" ON payments 
    USING (EXISTS (
        SELECT 1 FROM leases 
        JOIN properties ON leases.property_id = properties.id
        WHERE leases.id = lease_id AND properties.landlord_id = auth.uid()
    ));

-- Maintenance: Landlords can manage own maintenance
CREATE POLICY "Landlords can manage own maintenance" ON maintenance_requests 
    USING (EXISTS (
        SELECT 1 FROM properties WHERE properties.id = property_id AND properties.landlord_id = auth.uid()
    ));
