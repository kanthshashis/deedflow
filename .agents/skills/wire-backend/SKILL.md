---
name: wire-backend
description: Hooks up in-memory Gemini 2.5 Flash KYC OCR route with Aadhaar masking, Supabase PostgreSQL schemas, atomic slot allotment RPC, and local-first fallback mode.
---

# Backend Plumbing, Zero-Retention OCR & Database Skill (`/wire-backend`)

Use this skill to implement the server routes, database schemas, and data pipelines for DeedFlow.

## 1. Zero-Retention Gemini 2.5 Flash KYC Parser (`src/app/api/ocr/kyc/route.ts`)
- Accepts multipart form data or base64 image (PAN Card, Aadhaar Card, Passport).
- Calls Gemini 2.5 Flash via `@google/genai` with strict JSON schema:
  - `fullName`: String (Exact spelling as printed)
  - `documentType`: `PAN` | `AADHAAR` | `PASSPORT` | `VOTER_ID`
  - `idNumber`: String (Auto-masked if Aadhaar: `XXXXXXXX1234`)
  - `fatherName`: String or null
  - `dateOfBirth`: `YYYY-MM-DD` or null
  - `address`: String or null
- **Strict Invariant:** Image bytes are processed in memory and never persisted to permanent disk. In a `finally` block, references are dereferenced.
- Never returns or logs full 12-digit Aadhaar numbers.

## 2. PostgreSQL Schema & Atomic Slot Allocation (`scripts/seed-database.sql`)
- Tables:
  - `organizations` (Builder company, GSTIN, RERA registration, brand logo)
  - `projects` (Project name, location, total units, sanction plan approval number)
  - `units` (Tower, flat number, floor, carpet area, SBA, UDS, boundaries)
  - `parking_slots` (Project ID, slot number, basement level, slot type, status: `available` | `reserved` | `allotted`, allotted unit ID)
  - `documents` (Doc type, hash, metadata, redacted buyer payload)
- **Atomic Locking Procedure:**
  ```sql
  CREATE OR REPLACE FUNCTION allot_parking_slot(
    p_project_id UUID,
    p_slot_number TEXT,
    p_unit_id UUID
  ) RETURNS JSONB AS $$
  DECLARE
    v_slot RECORD;
  BEGIN
    SELECT * INTO v_slot FROM parking_slots
    WHERE project_id = p_project_id AND slot_number = p_slot_number
    FOR UPDATE;

    IF v_slot.status = 'allotted' THEN
      RAISE EXCEPTION 'SLOT_ALREADY_ALLOTTED' USING ERRCODE = 'P0001';
    END IF;

    UPDATE parking_slots
    SET status = 'allotted', allotted_unit_id = p_unit_id, updated_at = NOW()
    WHERE id = v_slot.id;

    RETURN jsonb_build_object('success', true, 'slot_number', p_slot_number);
  END;
  $$ LANGUAGE plpgsql;
  ```

## 3. Local-First Standalone Demo Fallback
- If `NEXT_PUBLIC_SUPABASE_URL` is unconfigured or network is offline:
  - App transparently falls back to `src/lib/mockData.ts` and browser `localStorage`.
  - Enables instant, zero-friction demonstration in builder site offices without requiring Wi-Fi login or live database connectivity.
