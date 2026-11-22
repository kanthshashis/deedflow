-- ==============================================================================
-- DEEDFLOW V2 ENTERPRISE MASTER DATABASE MIGRATION
-- Idempotent PostgreSQL DDL, Security RLS & Stored Procedures
-- Covering UC-01 through UC-15
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORGANIZATIONS (Real Estate Developers / Corporate Entities)
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
    taluk TEXT DEFAULT 'Bengaluru East',
    district TEXT DEFAULT 'Bengaluru Urban',
    survey_numbers TEXT,
    total_units INT DEFAULT 0,
    total_parking_slots INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER PROFILES & THREE-TIER RBAC
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'project_admin', 'project_operator')),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UNITS (Master Flat & Inventory Schedule)
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
    uds_percentage NUMERIC(6, 4) DEFAULT 0.0000,
    north_boundary TEXT,
    south_boundary TEXT,
    east_boundary TEXT,
    west_boundary TEXT,
    base_price NUMERIC(15, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'blocked', 'booked', 'sold')),
    is_locked BOOLEAN DEFAULT FALSE, -- Locked once final deed issued
    lock_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, tower, flat_number)
);

-- 5. UNIT OWNERS & SALE DEED ENRICHMENT
CREATE TABLE IF NOT EXISTS unit_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL DEFAULT 'sole' CHECK (entity_type IN ('sole', 'joint', 'nri_gpa', 'company')),
    primary_owner JSONB NOT NULL, -- { fullName, panNumber, aadhaarMasked, phone, email, address }
    co_owners JSONB DEFAULT '[]'::jsonb, -- Array of co-buyers with relationship & share %
    gpa_details JSONB, -- { gpaHolderName, gpaNumber, registrationDate, sroOffice }
    company_details JSONB, -- { companyName, cin, gstin, boardResolutionDate, authorizedSignatory }
    sale_deed_enrichment JSONB DEFAULT '{}'::jsonb, -- Statutory 7-point validation payload
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (unit_id)
);

-- 6. PARKING SLOTS & BASEMENT INVENTORY
CREATE TABLE IF NOT EXISTS parking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    slot_number TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Basement 1', 'Basement 2', 'Ground Surface', 'Stilt')),
    slot_type TEXT NOT NULL CHECK (slot_type IN ('Standard Covered', 'Compact Covered', 'Tandem (Double)', 'Open Surface', 'Covered EV-Ready')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'allotted', 'blocked')),
    allotted_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    allotment_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, slot_number)
);

-- 7. TEMPLATES (.docx & PDF Coordinate Maps)
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('docx', 'pdf_overlay')),
    storage_path TEXT NOT NULL,
    tags_schema JSONB DEFAULT '[]'::jsonb,
    coordinate_map JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PENDING CHANGE REQUESTS (Maker-Checker Diff Queue)
CREATE TABLE IF NOT EXISTS pending_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('unit', 'unit_owner', 'parking_slot')),
    entity_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'swap')),
    change_source TEXT NOT NULL CHECK (change_source IN ('manual_edit', 'excel_sync', 'register_vision_ocr', 'parking_grid_swap')),
    old_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    new_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    diff_summary JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 9. AUDIT LOGS (Immutable History & Time-Machine 1-Click Rollback)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    change_request_id UUID REFERENCES pending_change_requests(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    snapshot_before JSONB NOT NULL,
    snapshot_after JSONB NOT NULL,
    applied_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    can_rollback BOOLEAN DEFAULT TRUE,
    rolled_back_at TIMESTAMPTZ,
    rolled_back_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- 10. DRAFT HISTORY (Redacted V2 Versioning)
CREATE TABLE IF NOT EXISTS draft_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('parking_allotment', 'home_loan_noc', 'cost_sheet', 'sale_deed', 'bank_kit_zip')),
    version INT NOT NULL DEFAULT 1,
    redacted_payload JSONB NOT NULL, -- Sensitive numbers permanently masked
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. USER SUBSCRIPTIONS & METERING
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL DEFAULT 'starter' CHECK (plan_id IN ('starter', 'growth', 'project_pass')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled')),
    credits_total INT NOT NULL DEFAULT 40,
    credits_used INT NOT NULL DEFAULT 0,
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STORED PROCEDURE: ATOMIC APPROVAL OF CHANGE REQUEST
CREATE OR REPLACE FUNCTION approve_change_request(
    p_change_request_id UUID,
    p_admin_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_req RECORD;
    v_unit RECORD;
    v_slot RECORD;
    v_owner RECORD;
    v_before JSONB;
BEGIN
    SELECT * INTO v_req FROM pending_change_requests
    WHERE id = p_change_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'REQUEST_NOT_FOUND_OR_PROCESSED' USING ERRCODE = 'P0004';
    END IF;

    -- Apply change according to entity_type
    IF v_req.entity_type = 'parking_slot' THEN
        SELECT * INTO v_slot FROM parking_slots WHERE id = v_req.entity_id FOR UPDATE;
        v_before := to_jsonb(v_slot);

        UPDATE parking_slots
        SET status = COALESCE(v_req.new_data->>'status', status),
            allotted_unit_id = CASE
                WHEN v_req.new_data ? 'allotted_unit_id' THEN (v_req.new_data->>'allotted_unit_id')::UUID
                ELSE allotted_unit_id
            END,
            allotment_date = CASE
                WHEN v_req.new_data->>'status' = 'allotted' THEN NOW()
                ELSE allotment_date
            END,
            notes = COALESCE(v_req.new_data->>'notes', notes),
            updated_at = NOW()
        WHERE id = v_slot.id;

    ELSIF v_req.entity_type = 'unit_owner' THEN
        SELECT * INTO v_owner FROM unit_owners WHERE id = v_req.entity_id FOR UPDATE;
        v_before := to_jsonb(v_owner);

        UPDATE unit_owners
        SET entity_type = COALESCE(v_req.new_data->>'entity_type', entity_type),
            primary_owner = COALESCE(v_req.new_data->'primary_owner', primary_owner),
            co_owners = COALESCE(v_req.new_data->'co_owners', co_owners),
            sale_deed_enrichment = COALESCE(v_req.new_data->'sale_deed_enrichment', sale_deed_enrichment),
            updated_at = NOW()
        WHERE id = v_owner.id;

    ELSIF v_req.entity_type = 'unit' THEN
        SELECT * INTO v_unit FROM units WHERE id = v_req.entity_id FOR UPDATE;
        v_before := to_jsonb(v_unit);

        UPDATE units
        SET base_price = COALESCE((v_req.new_data->>'base_price')::NUMERIC, base_price),
            status = COALESCE(v_req.new_data->>'status', status),
            is_locked = COALESCE((v_req.new_data->>'is_locked')::BOOLEAN, is_locked),
            updated_at = NOW()
        WHERE id = v_unit.id;
    END IF;

    -- Create audit log
    INSERT INTO audit_logs (
        project_id,
        change_request_id,
        entity_type,
        entity_id,
        action,
        snapshot_before,
        snapshot_after,
        applied_by,
        applied_at
    ) VALUES (
        v_req.project_id,
        v_req.id,
        v_req.entity_type,
        v_req.entity_id,
        v_req.action,
        v_before,
        v_req.new_data,
        p_admin_id,
        NOW()
    );

    -- Mark request as approved
    UPDATE pending_change_requests
    SET status = 'approved',
        reviewed_by = p_admin_id,
        reviewed_at = NOW()
    WHERE id = v_req.id;

    RETURN jsonb_build_object(
        'success', true,
        'change_request_id', p_change_request_id,
        'status', 'approved'
    );
END;
$$ LANGUAGE plpgsql;

-- 13. STORED PROCEDURE: TIME-MACHINE ROLLBACK OF AUDIT LOG
CREATE OR REPLACE FUNCTION rollback_audit_log(
    p_audit_log_id UUID,
    p_admin_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_log RECORD;
BEGIN
    SELECT * INTO v_log FROM audit_logs
    WHERE id = p_audit_log_id AND can_rollback = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'CANNOT_ROLLBACK_LOG' USING ERRCODE = 'P0005';
    END IF;

    IF v_log.entity_type = 'parking_slot' THEN
        UPDATE parking_slots
        SET status = (v_log.snapshot_before->>'status'),
            allotted_unit_id = (v_log.snapshot_before->>'allotted_unit_id')::UUID,
            notes = (v_log.snapshot_before->>'notes'),
            updated_at = NOW()
        WHERE id = v_log.entity_id;

    ELSIF v_log.entity_type = 'unit_owner' THEN
        UPDATE unit_owners
        SET entity_type = (v_log.snapshot_before->>'entity_type'),
            primary_owner = (v_log.snapshot_before->'primary_owner'),
            co_owners = (v_log.snapshot_before->'co_owners'),
            sale_deed_enrichment = (v_log.snapshot_before->'sale_deed_enrichment'),
            updated_at = NOW()
        WHERE id = v_log.entity_id;

    ELSIF v_log.entity_type = 'unit' THEN
        UPDATE units
        SET base_price = (v_log.snapshot_before->>'base_price')::NUMERIC,
            status = (v_log.snapshot_before->>'status'),
            is_locked = (v_log.snapshot_before->>'is_locked')::BOOLEAN,
            updated_at = NOW()
        WHERE id = v_log.entity_id;
    END IF;

    UPDATE audit_logs
    SET can_rollback = FALSE,
        rolled_back_at = NOW(),
        rolled_back_by = p_admin_id
    WHERE id = v_log.id;

    RETURN jsonb_build_object(
        'success', true,
        'rolled_back_log_id', p_audit_log_id
    );
END;
$$ LANGUAGE plpgsql;

-- 14. STORED PROCEDURE: ATOMIC PARKING ALLOTMENT
CREATE OR REPLACE FUNCTION allot_parking_slot(
    p_project_id UUID,
    p_slot_number TEXT,
    p_unit_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_slot RECORD;
    v_unit RECORD;
BEGIN
    SELECT * INTO v_unit FROM units WHERE id = p_unit_id AND project_id = p_project_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNIT_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    SELECT * INTO v_slot FROM parking_slots
    WHERE project_id = p_project_id AND slot_number = p_slot_number
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SLOT_NOT_FOUND' USING ERRCODE = 'P0003';
    END IF;

    IF v_slot.status = 'allotted' THEN
        RAISE EXCEPTION 'SLOT_ALREADY_ALLOTTED' USING ERRCODE = 'P0001';
    END IF;

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

-- 15. STORED PROCEDURE: CONSUME DOCUMENT QUOTA
CREATE OR REPLACE FUNCTION consume_document_quota(
    p_user_id UUID,
    p_count INT
) RETURNS JSONB AS $$
DECLARE
    v_sub RECORD;
BEGIN
    SELECT * INTO v_sub FROM user_subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    FOR UPDATE;

    IF NOT FOUND THEN
        -- Allow demo usage if subscription row not seeded
        RETURN jsonb_build_object('success', true, 'remaining', 999);
    END IF;

    IF (v_sub.credits_used + p_count) > v_sub.credits_total THEN
        RAISE EXCEPTION 'QUOTA_EXCEEDED' USING ERRCODE = 'P0006';
    END IF;

    UPDATE user_subscriptions
    SET credits_used = credits_used + p_count,
        updated_at = NOW()
    WHERE id = v_sub.id;

    RETURN jsonb_build_object(
        'success', true,
        'consumed', p_count,
        'remaining', v_sub.credits_total - (v_sub.credits_used + p_count)
    );
END;
$$ LANGUAGE plpgsql;

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 17. SEED DATA (Sobha Royal Pavilion - Institutional Master Reference)
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

INSERT INTO projects (id, organization_id, name, rera_number, sanction_plan_no, location, taluk, district, survey_numbers, total_units, total_parking_slots, status)
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
    30,
    'active'
) ON CONFLICT DO NOTHING;

-- Seed Units
INSERT INTO units (id, project_id, tower, floor_number, flat_number, unit_type, carpet_area_sqft, super_built_up_area_sqft, undivided_share_land_sqft, uds_percentage, north_boundary, south_boundary, east_boundary, west_boundary, base_price, status)
VALUES
('c0000000-0000-0000-0000-000000000101', 'b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-101', '3BHK + 3T', 1150.00, 1620.00, 485.50, 0.0524, 'Internal Driveway', 'Flat B-102', 'Tower A Wing', 'Clubhouse Courtyard', 14580000.00, 'sold'),
('c0000000-0000-0000-0000-000000000102', 'b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-102', '2BHK + 2T', 920.00, 1280.00, 384.00, 0.0414, 'Flat B-101', 'Common Lift Lobby', 'Tower A Wing', 'Clubhouse Courtyard', 11520000.00, 'available'),
('c0000000-0000-0000-0000-000000000103', 'b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-103', '3BHK Luxury', 1320.00, 1850.00, 555.00, 0.0598, 'Common Corridor', 'Open Garden', 'Private Terrace', 'Tower B Lobby', 16650000.00, 'booked'),
('c0000000-0000-0000-0000-000000000104', 'b0000000-0000-0000-0000-000000000001', 'Tower B', 1, 'B-104', '2BHK + 2T', 920.00, 1280.00, 384.00, 0.0414, 'Flat B-103', 'External Compound', 'Road Facing', 'Common Staircase', 11520000.00, 'available'),
('c0000000-0000-0000-0000-000000000201', 'b0000000-0000-0000-0000-000000000001', 'Tower B', 2, 'B-201', '3BHK + 3T', 1150.00, 1620.00, 485.50, 0.0524, 'Internal Driveway', 'Flat B-202', 'Tower A Wing', 'Clubhouse Courtyard', 14742000.00, 'available'),
('c0000000-0000-0000-0000-000000000302', 'b0000000-0000-0000-0000-000000000001', 'Tower B', 3, 'B-302', '2BHK + 2T', 920.00, 1280.00, 384.00, 0.0414, 'Flat B-301', 'Common Lift Lobby', 'Tower A Wing', 'Clubhouse Courtyard', 11776000.00, 'available')
ON CONFLICT DO NOTHING;

-- Seed Parking Slots
INSERT INTO parking_slots (project_id, slot_number, level, slot_type, status, allotted_unit_id, notes)
VALUES
('b0000000-0000-0000-0000-000000000001', 'B1-01', 'Basement 1', 'Standard Covered', 'allotted', 'c0000000-0000-0000-0000-000000000101', 'Allotted to Flat B-101'),
('b0000000-0000-0000-0000-000000000001', 'B1-02', 'Basement 1', 'Standard Covered', 'available', NULL, 'Near Lift Lobby 2'),
('b0000000-0000-0000-0000-000000000001', 'B1-03', 'Basement 1', 'Covered EV-Ready', 'available', NULL, 'EV charging provision'),
('b0000000-0000-0000-0000-000000000001', 'B1-04', 'Basement 1', 'Compact Covered', 'available', NULL, 'Hatchback Bay'),
('b0000000-0000-0000-0000-000000000001', 'B1-05', 'Basement 1', 'Compact Covered', 'available', NULL, 'Hatchback Bay'),
('b0000000-0000-0000-0000-000000000001', 'B1-06', 'Basement 1', 'Tandem (Double)', 'reserved', NULL, 'Held for Flat B-103 token'),
('b0000000-0000-0000-0000-000000000001', 'B2-01', 'Basement 2', 'Standard Covered', 'available', NULL, 'Lower level ramp access'),
('b0000000-0000-0000-0000-000000000001', 'B2-02', 'Basement 2', 'Covered EV-Ready', 'available', NULL, 'Lower level EV bay')
ON CONFLICT DO NOTHING;

-- Seed Unit Owners with Sale Deed Enrichment
INSERT INTO unit_owners (unit_id, project_id, entity_type, primary_owner, sale_deed_enrichment)
VALUES (
    'c0000000-0000-0000-0000-000000000101',
    'b0000000-0000-0000-0000-000000000001',
    'sole',
    '{"fullName": "Kantharaju Mariyappa", "panNumber": "ABCDE1234F", "aadhaarMasked": "XXXXXXXX4826", "phone": "+91 98450 12345", "email": "kantharaju@example.com", "address": "#402, 7th Main, Indiranagar, Bengaluru 560038"}'::jsonb,
    '{
        "e_stamp_certificate_no": "IN-KA92847192847102U",
        "e_stamp_date": "2026-11-15",
        "stamp_duty_amount": 729000,
        "registration_fee_amount": 145800,
        "payment_utr_schedule": [
            {"milestone": "Token Booking", "amount": 500000, "bankName": "HDFC Bank", "utrNumber": "HDFCR520261101001", "date": "2026-11-01"},
            {"milestone": "Agreement (20%)", "amount": 2416000, "bankName": "HDFC Bank", "utrNumber": "HDFCR520261108002", "date": "2026-11-08"},
            {"milestone": "Plinth Level", "amount": 1458000, "bankName": "State Bank of India", "utrNumber": "SBIN004026111003", "date": "2026-11-10"}
        ],
        "uds_sqft": 485.50,
        "possession_date": "2027-03-31",
        "witness_1_name_address": "Ramesh Kumar, #12, 1st Cross, HSR Layout Sector 2, Bengaluru (DL: KA-01-2018-00912)",
        "witness_2_name_address": "Suresh Babu, #88, 4th Block, Koramangala, Bengaluru (PAN: BPKPB9912A)"
    }'::jsonb
) ON CONFLICT DO NOTHING;
