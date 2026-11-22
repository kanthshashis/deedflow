# DEEDFLOW V2 ENTERPRISE ARCHITECTURE MASTER BLUEPRINT
**Next-Generation Real Estate Post-Sales Document, Inventory & Title Intelligence Suite**

---

## 1. Executive Summary & Non-Negotiable Invariants

- **Product Identity:** DeedFlow Enterprise (`deedflow.in`)
- **Primary Audience:** Institutional Developers (Sobha, Prestige, Brigade, Godrej, Puravankara), Tier-1/Tier-2 Builders, Project Sales Directors, and Legal Post-Sales Teams.
- **Core Mission:** Eliminate clerical double-allocation, unmasked Aadhaar liabilities, and manual copy-paste errors in multi-crore property conveyancing. Transform raw buyer KYC images, unit schedules, and architectural basement parking drawings into audit-grade, bank-compliant `.docx` and `.pdf` legal dossiers in 15 seconds.
- **Protected Surface:**
  - **Landing Page (`src/app/page.tsx` & components):** Strictly preserved with Royal White Ivory (`#FAF7F2`), Imperial Burgundy (`#4A0E17`), Champagne Gold (`#B88E3E`), and glossy glass physics.
- **Enterprise Authenticated App Identity:**
  - Institutional Trust UI: `#F8FAFC` slate canvas, `#FFFFFF` crisp cards with `1px solid #E2E8F0` borders, `#0F172A` Obsidian primary buttons, `#1E3A8A` Royal Blue accents, and strict type safety (zero `any`).

---

## 2. Three-Tier Role-Based Access Control (RBAC)

1. **`super_admin` (DeedFlow Global Platform Operator):**
   - Access: `/super-admin` Command Center.
   - Capabilities: Global project provisioning, 1-click Tower/Floor/Flat + Basement matrix generation, project activation/suspension, project admin credential issuance with 1-click WhatsApp copy cards.
2. **`project_admin` (Builder Project General Manager / Sales Head):**
   - Access: `/dashboard/*` with full governance and approval authority.
   - Capabilities: Review and approve/reject change requests in `/dashboard/approvals`, 1-click database rollbacks, manage template preflight linters, issue batches of Sale Deeds and Bank Kits.
3. **`project_operator` (Site Office Executive / CRM Clerk):**
   - Access: `/dashboard/*` with change-queue gating.
   - Capabilities: Run KYC OCR scans, associate buyer data, select units, click parking slots, generate drafts. **Any modification to existing master data triggers a Red/Green diff in `/dashboard/approvals` rather than mutating live tables directly.**

---

## 3. Database Architecture & Schema Specification (`supabase/migrations/20261122_deedflow_v2_reset.sql`)

### A. Core Relational Entities
- **`organizations`:** Builder corporate legal entity, GSTIN, RERA registration, registered address, authorized signatories.
- **`projects`:** Specific real estate project/phase, BBMP/BMRDA sanction plan number, survey numbers, taluk, district, total units, total parking bays, status (`active` / `suspended`).
- **`profiles`:** User profile tied to `auth.users(id)` with `role` (`super_admin`, `project_admin`, `project_operator`), `organization_id`, and `project_id`.
- **`units`:** Master unit schedule with `tower`, `floor_number`, `flat_number`, `unit_type`, `carpet_area_sqft`, `super_built_up_area_sqft`, `undivided_share_land_sqft`, `uds_percentage`, boundary limits (North/South/East/West), `base_price`, `status` (`available`, `blocked`, `booked`, `sold`), and `is_locked`.
- **`unit_owners`:** Allottee profile linked to `units(id)`:
  - `entity_type`: `sole`, `joint`, `nri_gpa`, `company`.
  - `primary_owner`: Full name, PAN, masked Aadhaar (`XXXXXXXX1234`), phone, email, address.
  - `co_owners`: Secondary buyer profiles & relationship.
  - `gpa_details`: Attorney name, GPA deed registration number, sub-registrar office.
  - `company_details`: Corporate name, CIN, board resolution date, authorized signatory.
  - `sale_deed_enrichment` (JSONB): Statutory pre-generation details.
- **`parking_slots`:** Basement inventory with `slot_number`, `level` (`Basement 1`, `Basement 2`, `Ground Surface`, `Stilt`), `slot_type` (`Standard Covered`, `Compact Covered`, `Tandem (Double)`, `Open Surface`), `status` (`available`, `reserved`, `allotted`, `blocked`), `allotted_unit_id`, `allotment_date`.
- **`templates`:** Document templates (`docx`, `pdf_overlay`) with dynamic tag schemas and coordinate maps.

### B. Enterprise Governance & Diff Queue
- **`pending_change_requests`:**
  - `id UUID PRIMARY KEY`, `project_id UUID`, `requested_by UUID`, `entity_type` (`unit`, `owner`, `parking_slot`), `entity_id UUID`, `action` (`create`, `update`, `delete`, `swap`), `old_data JSONB`, `new_data JSONB`, `diff_summary JSONB`, `status` (`pending`, `approved`, `rejected`), `reviewed_by UUID`, `review_notes TEXT`, `created_at`, `reviewed_at`.
- **`audit_logs`:**
  - `id UUID PRIMARY KEY`, `project_id UUID`, `change_request_id UUID`, `entity_type TEXT`, `entity_id UUID`, `snapshot_before JSONB`, `snapshot_after JSONB`, `applied_by UUID`, `applied_at TIMESTAMPTZ`, `can_rollback BOOLEAN`, `rolled_back_at TIMESTAMPTZ`.

### C. Stored Procedures & Atomic RPCs
- **`approve_change_request(p_change_request_id UUID, p_admin_id UUID)`:**
  - Acquires row lock `FOR UPDATE` on target entity.
  - Writes before-and-after snapshots into `audit_logs`.
  - Updates target table with `new_data`.
  - Marks change request as `approved`.
- **`rollback_audit_log(p_audit_log_id UUID, p_admin_id UUID)`:**
  - Atomically restores `snapshot_before` to target table and records reversal in audit logs.
- **`allot_parking_slot(p_project_id UUID, p_slot_number TEXT, p_unit_id UUID)`:**
  - Row-lock atomic allocation preventing simultaneous double-claims.
- **`consume_document_quota(p_user_id UUID, p_count INT)`:**
  - Verifies and decrements available document generation credits.

---

## 4. Statutory Sale Deed Pre-Generation Enrichment Schema

Before synthesizing a formal Sale Deed, the system mandates completion of:
1. **`e_stamp_certificate_no`**: 16-character alphanumeric state treasury certificate.
2. **`e_stamp_date`**: Issuance date preceding deed execution.
3. **`stamp_duty_amount`**: 5% state stamp duty + 1% cess + 1% registration fees.
4. **`payment_utr_schedule`**: Array of bank disbursements (Milestone, Tranche Amount, Bank Name, UTR Number, Date).
5. **`uds_sqft` & `uds_percentage`**: Undivided share in land mathematically reconciled with sanctioned drawings.
6. **`possession_date`**: Key handover deadline.
7. **`witness_1` & `witness_2`**: Full legal name, parent's name, age, address, and government photo ID number.

---

## 5. Screen & Feature Architecture

1. **Authentication & Role Redirect (`/login`):**
   - Institutional sign-in with instant demo role switcher (`Super Admin`, `Project Admin`, `Site Operator`).
   - Route guard redirecting to `/super-admin` or `/dashboard`.
2. **Super Admin Command Center (`/super-admin` & `/super-admin/provision`):**
   - Project inventory matrix builder (Towers, Floors, Flat numbers, Parking bay numbering).
   - Project Admin Credential generator with 1-click WhatsApp copy card.
   - Global project oversight table with active/suspended toggle.
3. **Executive Dashboard (`/dashboard`):**
   - Real-time project KPIs, inventory health, pending approval alerts, and recent documents.
4. **Governance & Approval Queue (`/dashboard/approvals` & `/dashboard/governance`):**
   - Visual Before/After red/green diff inspector.
   - 1-click Approve and Reject actions.
   - Audit trail tab with 1-click snapshot rollback.
   - Smart Document Vault auto-classifier (Gemini 2.5 Flash).
5. **Interactive CAD Parking Studio (`/dashboard/parking`):**
   - Interactive SVG/Canvas multi-level basement grid (`B1` / `B2`).
   - Slot drawer with instant locking or change-request escalation.
6. **Split-Screen Verification Studio (`/dashboard/draft/new`):**
   - Left: Zero-retention zoomable ID viewer with Aadhaar masking.
   - Center: Buyer intake form with Smart Grammar toggles and deterministic currency words.
   - Right: Live A4 Serif preview, watermark toggle, WhatsApp draft share, and 1-Click Bank Kit ZIP.
7. **Batch Generator & Sale Deed Enrichment Modal (`/dashboard/batch`):**
   - Multi-unit selection with 7-point statutory pre-flight modal.
   - Bulk export of Bank Kits and Sale Deeds.
8. **Template Manager (`/dashboard/templates`):**
   - `.docx` preflight linter and PDF coordinate mapper.
9. **Billing & Subscriptions (`/api/billing/*`):**
   - Razorpay integration for credit top-ups.
