-- ==============================================================================
-- DEEDFLOW POSTGRESQL PRODUCTION & DEMO SCHEMA
-- Institutional Real Estate Document & Inventory Reconciliation System
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORGANIZATIONS (Real Estate Developers / Post-Sales Teams)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    legal_name TEXT NOT NULL,
    rera_registration_no TEXT,
    gstin TEXT,
    registered_office_address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    branding_logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS (Residential / Commercial Developments)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rera_number TEXT NOT NULL,
    sanction_plan_no TEXT,
    location TEXT NOT NULL,
    taluk TEXT DEFAULT 'Bengaluru South',
    district TEXT DEFAULT 'Bengaluru Urban',
    survey_numbers TEXT,
    total_units INT DEFAULT 0,
    total_parking_slots INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UNITS / FLATS MASTER INVENTORY
CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tower TEXT NOT NULL,
    floor_number INT NOT NULL,
    flat_number TEXT NOT NULL,
    unit_type TEXT NOT NULL DEFAULT '3BHK',
    carpet_area_sqft NUMERIC(10, 2) NOT NULL,
    super_built_up_area_sqft NUMERIC(10, 2) NOT NULL,
    undivided_share_land_sqft NUMERIC(10, 2) NOT NULL,
    north_boundary TEXT,
    south_boundary TEXT,
    east_boundary TEXT,
    west_boundary TEXT,
    base_price NUMERIC(15, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'blocked', 'booked', 'sold')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, tower, flat_number)
);

-- 4. PARKING SLOTS & BASEMENT INVENTORY
CREATE TABLE IF NOT EXISTS parking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    slot_number TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Basement 1', 'Basement 2', 'Ground Surface', 'Stilt')),
    slot_type TEXT NOT NULL CHECK (slot_type IN ('Standard Covered', 'Compact Covered', 'Tandem (Double)', 'Open Surface')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'allotted', 'blocked')),
    allotted_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    allotment_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, slot_number)
);

-- 5. GENERATED DOCUMENTS & AUDIT TRAIL
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('parking_allotment', 'home_loan_noc', 'cost_sheet', 'bank_kit_zip')),
    document_hash TEXT NOT NULL UNIQUE,
    allottee_primary_name TEXT NOT NULL,
    allottee_masked_id TEXT NOT NULL, -- Never store raw 12-digit Aadhaar! e.g., 'XXXXXXXX1234'
    storage_path TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATOMIC PARKING ALLOTMENT STORED PROCEDURE (Prevents Double Allotments)
CREATE OR REPLACE FUNCTION allot_parking_slot(
    p_project_id UUID,
    p_slot_number TEXT,
    p_unit_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_slot RECORD;
    v_unit RECORD;
BEGIN
    -- Verify unit exists
    SELECT * INTO v_unit FROM units WHERE id = p_unit_id AND project_id = p_project_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNIT_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    -- Lock the parking slot row atomically
    SELECT * INTO v_slot FROM parking_slots
    WHERE project_id = p_project_id AND slot_number = p_slot_number
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SLOT_NOT_FOUND' USING ERRCODE = 'P0003';
    END IF;

    IF v_slot.status = 'allotted' THEN
        RAISE EXCEPTION 'SLOT_ALREADY_ALLOTTED' USING ERRCODE = 'P0001';
    END IF;

    -- Update slot to allotted
    UPDATE parking_slots
    SET status = 'allotted',
        allotted_unit_id = p_unit_id,
        allotment_date = NOW(),
        updated_at = NOW()
    WHERE id = v_slot.id;

    RETURN jsonb_build_object(
        'success', true,
        'slot_number', p_slot_number,
        'unit_flat', v_unit.flat_number,
        'level', v_slot.level,
        'allotted_at', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 8. SAMPLE REALISTIC BENGALURU SEED DATA FOR DEMO & TESTING
INSERT INTO organizations (id, name, legal_name, rera_registration_no, gstin, registered_office_address, contact_email, contact_phone)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Sobha Developers Ltd',
    'Sobha Limited',
    'PRM/KA/RERA/1251/310/PR/180227/002684',
    '29AAACS2843H1Z7',
    'Sarjapur - Marathahalli Outer Ring Road, Devarabisanahalli, Bellandur Post, Bengaluru 560103',
    'postsales@sobha.com',
    '+91-80-46464500'
) ON CONFLICT DO NOTHING;

INSERT INTO projects (id, organization_id, name, rera_number, sanction_plan_no, location, taluk, district, survey_numbers, total_units, total_parking_slots)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Sobha Royal Pavilion - Tower B',
    'PRM/KA/RERA/1251/308/PR/190330/002518',
    'BBMP/ADDL.DIR/JD-SOUTH/LP/0114/2018-19',
    'Sarjapur Road, Hadosiddapura, Chikkakannalli, Bengaluru, Karnataka 560035',
    'Bengaluru East',
    'Bengaluru Urban',
    'Sy. Nos. 35/1, 35/2, 36/1P and 37/2',
    20,
    30
) ON CONFLICT DO NOTHING;

-- Seed Units for Tower B (Floors 1-5, 4 flats per floor)
INSERT INTO units (project_id, tower, floor_number, flat_number, unit_type, carpet_area_sqft, super_built_up_area_sqft, undivided_share_land_sqft, north_boundary, south_boundary, east_boundary, west_boundary, base_price, status)
VALUES
('b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-101', '3BHK + 3T', 1150.00, 1620.00, 485.50, 'Internal Driveway', 'Flat B-102', 'Tower A Wing', 'Clubhouse Courtyard', 14580000.00, 'sold'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-102', '2BHK + 2T', 920.00, 1280.00, 384.00, 'Flat B-101', 'Common Lift Lobby', 'Tower A Wing', 'Clubhouse Courtyard', 11520000.00, 'available'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-103', '3BHK Luxury', 1320.00, 1850.00, 555.00, 'Common Corridor', 'Open Garden', 'Private Terrace', 'Tower B Lobby', 16650000.00, 'booked'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-104', '2BHK + 2T', 920.00, 1280.00, 384.00, 'Flat B-103', 'External Compound', 'Road Facing', 'Common Staircase', 11520000.00, 'available'),

('b0000000-0000-0000-0000-000000000001', 'Tower B', 2, 'B-201', '3BHK + 3T', 1150.00, 1620.00, 485.50, 'Internal Driveway', 'Flat B-202', 'Tower A Wing', 'Clubhouse Courtyard', 14742000.00, 'available'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 2, 'B-202', '2BHK + 2T', 920.00, 1280.00, 384.00, 'Flat B-201', 'Common Lift Lobby', 'Tower A Wing', 'Clubhouse Courtyard', 11648000.00, 'available'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 2, 'B-203', '3BHK Luxury', 1320.00, 1850.00, 555.00, 'Common Corridor', 'Open Garden', 'Balcony', 'Tower B Lobby', 16835000.00, 'available'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 2, 'B-204', '2BHK + 2T', 920.00, 1280.00, 384.00, 'Flat B-203', 'External Compound', 'Road Facing', 'Common Staircase', 11648000.00, 'available'),

('b0000000-0000-0000-0000-000000000001', 'Tower B', 3, 'B-301', '3BHK + 3T', 1150.00, 1620.00, 485.50, 'Internal Driveway', 'Flat B-302', 'Tower A Wing', 'Clubhouse Courtyard', 14904000.00, 'available'),
('b0000000-0000-0000-0000-000000000001', 'Tower B', 3, 'B-302', '2BHK + 2T', 920.00, 1280.00, 384.00, 'Flat B-301', 'Common Lift Lobby', 'Tower A Wing', 'Clubhouse Courtyard', 11776000.00, 'available')
ON CONFLICT DO NOTHING;

-- Seed Parking Slots across Basement 1 and Basement 2
INSERT INTO parking_slots (project_id, slot_number, level, slot_type, status, allotted_unit_id, notes)
VALUES
-- Basement 1
('b0000000-0000-0000-0000-000000000001', 'B1-01', 'Basement 1', 'Standard Covered', 'allotted', (SELECT id FROM units WHERE flat_number = 'B-101' LIMIT 1), 'Allotted to Flat B-101 on 15-Nov-2026'),
('b0000000-0000-0000-0000-000000000001', 'B1-02', 'Basement 1', 'Standard Covered', 'available', NULL, 'Near Lift Lobby 2'),
('b0000000-0000-0000-0000-000000000001', 'B1-03', 'Basement 1', 'Standard Covered', 'available', NULL, 'Near Pillar P-14'),
('b0000000-0000-0000-0000-000000000001', 'B1-04', 'Basement 1', 'Compact Covered', 'available', NULL, 'Compact Hatchback Slot'),
('b0000000-0000-0000-0000-000000000001', 'B1-05', 'Basement 1', 'Compact Covered', 'available', NULL, 'Compact Hatchback Slot'),
('b0000000-0000-0000-0000-000000000001', 'B1-06', 'Basement 1', 'Tandem (Double)', 'reserved', NULL, 'Held for Flat B-103 booking token'),
('b0000000-0000-0000-0000-000000000001', 'B1-07', 'Basement 1', 'Tandem (Double)', 'available', NULL, 'Tandem slot suitable for 2 sedans'),
('b0000000-0000-0000-0000-000000000001', 'B1-08', 'Basement 1', 'Standard Covered', 'available', NULL, 'Wide SUV Bay with EV conduit'),
('b0000000-0000-0000-0000-000000000001', 'B1-09', 'Basement 1', 'Standard Covered', 'blocked', NULL, 'Temporary Site Office Store'),
('b0000000-0000-0000-0000-000000000001', 'B1-10', 'Basement 1', 'Standard Covered', 'available', NULL, 'Direct Ramp Access'),

-- Basement 2
('b0000000-0000-0000-0000-000000000001', 'B2-01', 'Basement 2', 'Standard Covered', 'available', NULL, 'Lower Basement Bay'),
('b0000000-0000-0000-0000-000000000001', 'B2-02', 'Basement 2', 'Standard Covered', 'available', NULL, 'Lower Basement Bay'),
('b0000000-0000-0000-0000-000000000001', 'B2-03', 'Basement 2', 'Compact Covered', 'available', NULL, 'Lower Compact'),
('b0000000-0000-0000-0000-000000000001', 'B2-04', 'Basement 2', 'Standard Covered', 'available', NULL, 'Near Staircase S-3'),
('b0000000-0000-0000-0000-000000000001', 'B2-05', 'Basement 2', 'Tandem (Double)', 'available', NULL, 'Tandem Lower Level')
ON CONFLICT DO NOTHING;
