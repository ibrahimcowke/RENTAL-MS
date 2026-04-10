-- ==============================================================================
-- RENTAL MANAGEMENT SYSTEM - PROPERTY TYPE MIGRATION
-- ==============================================================================
-- Run this in your Supabase SQL Editor to:
--   1. Add new districts: Daarusalaam, Garasbaaleey
--   2. Add building_number and floor_area columns to properties table
-- ==============================================================================

-- 1. Add new district columns to properties if needed
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS building_number INTEGER;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_area DECIMAL(10,2);

-- 2. Migrate existing property_type values to the new 3-type system
-- Old: Complex, Building, House, Apartment, Villa, Room, Shop
-- New: Apartment, Villa, Normal House
UPDATE public.properties SET property_type = 'Apartment' WHERE property_type IN ('Building', 'Apartment', 'Room', 'Complex');
UPDATE public.properties SET property_type = 'Normal House' WHERE property_type IN ('House', 'Shop');
-- 'Villa' stays as 'Villa'

-- 3. Add new districts
INSERT INTO public.districts (name) VALUES ('Daarusalaam')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.districts (name) VALUES ('Garasbaaleey')
ON CONFLICT (name) DO NOTHING;

-- 4. Verify
SELECT name FROM public.districts ORDER BY name;
SELECT id, name, property_type, building_number, floor_area FROM public.properties LIMIT 10;

-- Done
NOTIFY pgrst, 'reload schema';
