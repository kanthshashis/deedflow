# DEEDFLOW — COMPLETE USE CASE & FEATURE SPECIFICATION (ANTIGRAVITY BUILD MASTER)

## 1. SYSTEM ROLES & ACCESS HIERARCHY

| Role ID | Role Title | Persona | Scope & Authority |
| :--- | :--- | :--- | :--- |
| **`super_admin`** | **DeedFlow Super-Admin** | Platform Owner (Shashi) | Global control across all builder workspaces. Creates builder projects, auto-seeds Tower/Floor/Unit & Basement Parking matrices, generates Project Admin credentials (`supabase.auth.admin`), monitors usage/quotas, and suspends/activates project access. |
| **`project_admin`** | **Project Admin** | Builder Project Head / Legal Lead | Full workspace control within assigned project. Bulk-adds initial owner/unit records, acts as mandatory **Approval Gatekeeper** for any update to existing database records, manages templates, runs Sale Deed enrichments, and exports final documents/kits. |
| **`project_operator`** | **Post-Sales / CRM Operator** | Builder Post-Sales Clerk | Drafts documents, uploads KYC IDs or photocopy register sheets, proposes parking/owner updates (all modifications automatically route to `pending_change_requests` for Project Admin approval). |

---

## 2. COMPLETE END-TO-END USE CASES (UC-01 TO UC-15)

### UC-01: Super-Admin Project Provisioning & Tower/Parking Matrix Generation
- **Actor:** `super_admin`
- **Route:** `/super-admin/provision`
- **Workflow:**
  1. Super-Admin enters Builder Legal Entity Name, Project Name, RERA Number, Office Address, and Site Location.
  2. Super-Admin configures the structural matrix: Towers (`A, B, C`), Floors per Tower (`10`), Flats per Floor (`4`), default areas (`SBA`, `Carpet`, `UDS`), Basement Levels (`B1, B2`), and Slots per Basement (`30`).
  3. System atomically creates the `projects` record, bulk-inserts all flat rows into `units` (`A-101` through `C-1004`), and bulk-inserts all parking slots into `parking_slots` (`B1-P01` through `B2-P30`, defaulting every 5th slot to `Covered EV-Ready`).

### UC-02: Super-Admin Credential Generation & WhatsApp Handover
- **Actor:** `super_admin`
- **Route:** `/super-admin/provision` & `/super-admin` (Global Command Center)
- **Workflow:**
  1. During project creation (or via "Add Admin" on any existing project), Super-Admin enters the Project Admin's Name and Email (with optional custom password or auto-generated strong password).
  2. Server API (`/api/super-admin/provision`) calls `supabase.auth.admin.createUser()` with `email_confirm: true`, creates the `profiles` row (`role = 'project_admin'`), and provisions the subscription quota.
  3. UI displays a **Credential Handover Card** with a 1-click **"Copy Credentials for WhatsApp"** button and direct `wa.me` share link.
  4. On `/super-admin`, Super-Admin monitors all active projects, unit counts, documents generated, pending approvals, and can toggle `status` (`active` / `suspended`) in 1 click.

### UC-03: Initial Bulk Owner & Document Ingestion (Direct Commit for New Records)
- **Actor:** `project_admin`
- **Route:** `/dashboard/governance`
- **Workflow:**
  1. Project Admin uploads an initial Excel/CSV sheet or batch of existing buyer records for unassigned flats (`Sole Individual`, `Joint Co-Buyers`, `NRI via GPA Holder`, or `Company / LLP / HUF`).
  2. System checks if the flat already has an assigned owner in `unit_owners`:
     - **If unassigned (New Record):** Inserts directly into `unit_owners` without friction.
     - **If already assigned (Existing Record):** Automatically routes the diff to `pending_change_requests` (see UC-04).
  3. **Smart Document Vault Auto-Classifier:** Project Admin can drag-and-drop up to 50 mixed PDFs/images (PAN cards, booking forms, old allotment letters, bank NOCs) at once; Gemini 2.5 Flash classifies each file by document type, detects the `flat_number`, and attaches it to that unit's digital vault.

### UC-04: Approval-Gated Database Updates & Side-by-Side Diff Review
- **Actor:** `project_admin` (Approver) & `project_operator` / `project_admin` (Proposer)
- **Route:** `/dashboard/approvals`
- **Workflow:**
  1. Any modification to an existing owner name, PAN, share percentage, parking slot assignment, or unit schedule—whether triggered via **manual edit**, **Excel bulk re-upload**, **Photocopy Register OCR**, or **Visual Parking Grid swap**—creates a row in `pending_change_requests` storing `old_data`, `new_data`, and `change_source`.
  2. Project Admin opens `/dashboard/approvals` and inspects a color-coded **Red (Old) vs. Green (New) Diff Table** per flat.
  3. Clicking **Approve & Commit** invokes the atomic PostgreSQL RPC `approve_change_request()`, updating the live table and writing an immutable snapshot to `audit_logs`.
  4. **1-Click Rollback ("Time Machine"):** If an approved bulk update needs reversal, Project Admin or Super-Admin can click **Rollback** on any `audit_logs` entry to restore `snapshot_before`.

### UC-05: Three-Way Car Parking Lot Allotment & Modification
- **Actor:** `project_admin` / `project_operator`
- **Routes:** `/dashboard/parking` & `/dashboard/governance`
- **Workflow (3 Synchronized Modes):**
  1. **Interactive Visual Basement Parking Grid:** Displays `Basement B1` and `Basement B2` slot tiles color-coded as **Available (`#059669` Emerald)**, **Reserved (`#D97706` Amber)**, or **Allotted (`#475569` Slate, locked with Flat No.)**. Clicking an available slot selects it (`#1E3A8A` Royal Blue ring) and auto-fills `parking_slot_number`, `parking_level`, and `parking_type` into the active draft. Swapping an already allotted slot stages an approval request.
  2. **Photocopy / Physical Register Vision OCR (`/api/ocr/register-sheet`):** Upload a smartphone photo or scan of a physical parking/allotment register sheet. Gemini 2.5 Flash extracts rows (`Flat No.`, `Slot No.`, `Basement Level`, `Owner Name`) into an editable staging grid; new allotments commit directly while changes to existing slots route to the Approval Queue.
  3. **Excel Bulk Sync (`.xlsx`):** Export current parking allocation sheet, edit in Excel, and re-upload to stage additions and approval-gated updates.

### UC-06: Split-Screen KYC Vision OCR & Zero-Retention Privacy Purge
- **Actor:** `project_admin` / `project_operator`
- **Route:** `/dashboard/draft/new`
- **Workflow:**
  1. User drops buyer ID images (PAN, Passport, Driving License) into the left-hand dropzone.
  2. Client uploads to private Supabase bucket `kyc-temp`; server route `/api/ocr/extract` runs Gemini 2.5 Flash structured JSON extraction with per-field confidence scores (`0.0 – 1.0`).
  3. **Strict Privacy Guarantee:** Sensitive national ID digits (e.g., Aadhaar) are strictly stripped/redacted (`[Aadhaar Redacted]`), and `supabase.storage.from('kyc-temp').remove(filePaths)` runs immediately inside a `finally` block (backed by a 15-minute `pg_cron` failsafe sweep).
  4. Right-hand verification form highlights fields `< 0.85` confidence with an Amber **Needs Check** pill alongside a zoomable/rotatable ID viewer.

### UC-07: Multi-Buyer, NRI GPA & Corporate Entity Smart Grammar Engine
- **Actor:** `project_admin` / `project_operator`
- **Route:** `/dashboard/draft/new`
- **Workflow:**
  1. User toggles **Buyer Structure**: `Sole Individual`, `Joint Co-Buyers (2+)`, `NRI via GPA Holder`, or `Company / LLP / HUF`.
  2. UI dynamically reveals relevant fields (Co-Buyer KYC + ownership share %, GPA Holder name + registration date/SRO, or Company CIN/GSTIN + Board Resolution date).
  3. `src/lib/legalGrammar.ts` automatically injects singular/plural legal tokens (`allottee_noun`, `pronoun_possessive`, `verb_have`) into the live A4 Serif Preview and `.docx` output.

### UC-08: Sale Deed Pre-Generation Enrichment (Single, Selected, or Bulk Flats)
- **Actor:** `project_admin`
- **Routes:** `/dashboard/draft/new` & `/dashboard/batch`
- **Workflow:**
  1. When generating a **Sale Deed** for 1 flat, multi-selected flats, or a full tower batch, the system validates mandatory Sale Deed fields stored in `unit_owners.sale_deed_enrichment`:
     - `e_stamp_certificate_no` & `e_stamp_date`
     - `stamp_duty_amount` & `registration_fee_amount`
     - `payment_utr_schedule` (table of Cheque/NEFT/RTGS UTR numbers, bank names, dates, and amounts)
     - `uds_sqft` (Undivided Share of Land) & `possession_date`
     - `witness_1_name_address` & `witness_2_name_address`
  2. Opens the **Sale Deed Enrichment Drawer/Modal** highlighting any selected flats with missing fields so the Project Admin can complete them inline or via a quick Excel patch before generating final `.docx`/`.pdf` Sale Deeds.

### UC-09: Dual Template Engine (`.docx` Preflight Linter + Blank PDF/Image Overlay Mapper)
- **Actor:** `project_admin`
- **Route:** `/dashboard/templates`
- **Workflow:**
  1. **`.docx` Upload + Preflight Linter:** Validates `{{tag}}` syntax on upload, flags broken single-brace tags, and displays matched variables.
  2. **Blank PDF / Scanned Letterhead Mapper (`pdf-lib`):** Renders pre-printed PDFs or scanned PNG/JPG letterheads on an interactive canvas. Admin clicks blank lines to pin `{{variables}}`, sets font size, and optionally adds whiteout patches (`coverOldText`) to replace sample text on scanned forms.

### UC-10: Deterministic Indian Currency-to-Words & Document Lock Protection
- **Actor:** System / `project_admin`
- **Workflow:**
  1. All monetary inputs (`350000`, `11200000`) pass through `src/lib/indianCurrencyToWords.ts` (`"Rupees Three Lakhs Fifty Thousand Only"`, `"Rupees One Crore Twelve Lakhs Only"`). Never uses LLMs for number conversion.
  2. Once a flat's Car Parking Allotment or Sale Deed is marked **`ISSUED` / `REGISTERED`**, `units.lock_status` locks core fields and displays a high-visibility warning if edited later (recommending an Addendum/Rectification Deed).

### UC-11: Pre-Print Watermarked Draft Sharing via WhatsApp
- **Actor:** `project_admin` / `project_operator`
- **Route:** `/dashboard/draft/new`
- **Workflow:**
  1. Clicking **Share Watermarked Draft via WhatsApp** stamps a diagonal `"DRAFT — FOR VERIFICATION ONLY"` watermark across every page (`pdf-lib`), downloads the review PDF, and opens `wa.me` with a pre-filled confirmation message to the buyer before printing on expensive stationery.

### UC-12: 1-Click Home Loan Bank Kit Bundle (`.ZIP`)
- **Actor:** `project_admin` / `project_operator`
- **Route:** `/dashboard/draft/new`
- **Workflow:**
  1. Clicking **Generate Home Loan Bank Kit (.ZIP)** compiles three formatted `.docx` documents simultaneously from one verified buyer + unit record via `jszip`:
     - `01_Car_Parking_Allotment_Letter.docx`
     - `02_Builder_Home_Loan_NOC.docx` (with Sanctioning Bank, Loan Amount & Mortgage Permission clauses)
     - `03_Unit_Cost_Sheet_Schedule.docx` (itemized cost breakdown in figures & deterministic words)

### UC-13: 1-Click Excel Batch Document Generation
- **Actor:** `project_admin`
- **Route:** `/dashboard/batch`
- **Workflow:**
  1. Upload an `.xlsx` booking sheet (or select pre-loaded flats from the database).
  2. System validates rows, converts amounts to Indian words, deducts quota atomically via `consume_document_quota(user_id, count)`, and downloads a single `.zip` archive of all generated `.docx`/`.pdf` letters.

### UC-14: Draft v2 Revision History & Unit Cancellation / Transfer Wizard
- **Actor:** `project_admin` / `project_operator`
- **Route:** `/dashboard`
- **Workflow:**
  1. **Draft v2 Regeneration:** Re-open any saved draft from `draft_history` (stored as redacted JSON) to fix a typo or update details without re-scanning KYC IDs.
  2. **Unit Transfer / Cancellation Wizard:** Archives outgoing buyer details, releases or reassigns the linked basement parking slot, and drafts a Cancellation or Nomination/Transfer Letter.

### UC-15: Razorpay Billing, Quota Metering & Public QR Verification
- **Actor:** `project_admin` / External Verifier
- **Workflow:**
  1. **Razorpay Billing:** Supports `Starter (₹1,499/mo — 40 docs)`, `Builder Growth (₹3,999/mo — 200 docs)`, and `Project Pass (₹12,999 one-time — 300 units / 12 mos)` with HMAC-SHA256 webhook signature verification (`/api/billing/webhook`) and atomic quota deduction.
  2. **Optional QR Verification Footer:** Generated documents can embed a subtle QR code linking to `/verify/[public_hash]` showing read-only authenticity confirmation (*"Verified Authentic Document issued by [Builder Name] for Unit A-402"*).

---

## 3. UI/UX & RESPONSIVE DESIGN INVARIANTS
- **Aesthetic ("Institutional Trust"):** `#F8FAFC` Slate canvas, `#FFFFFF` elevated cards (`1px solid #E2E8F0`), `#0F172A` Obsidian primary actions, `#1E3A8A` Royal Legal Blue focus accents. Zero purple/pink AI gradients.
- **Typography:** `Plus Jakarta Sans` (UI), `Source Serif 4` (live A4 legal document preview), `JetBrains Mono` (`tabular-nums` for PAN, parking slots, flat numbers, and `₹` figures).
- **Viewports:** Verified across **Desktop (`1440x900`)**, **Tablet (`768x1024`)**, and **Mobile (`375x812`)** with collapsible top ID drawer and fixed bottom mobile nav (`min-h-11` touch targets, zero horizontal overflow).