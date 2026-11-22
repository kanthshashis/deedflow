---
name: build-parking-and-edge-cases
description: Implements interactive visual basement parking grid, optimistic slot locking, dual template engine (docxtemplater + pdf-lib), 1-Click Bank Kit ZIP bundler, and mobile bottom sheet.
---

# Parking Grid, Dual Template Engine & Edge Cases (`/build-parking-and-edge-cases`)

Use this skill to implement the core interactive features and edge-case handling for DeedFlow.

## 1. Visual Basement Parking Grid (`src/components/parking/BasementGrid.tsx`)
- Multi-tier level navigation: `Basement 1 (Upper)` vs `Basement 2 (Lower)`.
- Slot Categories:
  - `Standard Covered` (Dark Slate)
  - `Compact / Small Car` (Cyan Slate)
  - `Tandem / Stacked` (Double Slot with dashed connector)
  - `Open / Surface` (Light Slate)
- Real-Time Slot Status:
  - `Available` (`#F1F5F9` background, `#475569` text, dashed hover border)
  - `Reserved / In-Progress` (`#FEF3C7` background, `#D97706` text)
  - `Allotted / Sold` (`#ECFDF5` background, `#059669` text, shows Flat No. e.g., "A-302")
  - `Blocked / Pillar / VIP` (`#F3F4F6` background, crossed out)
- Ergonomic Mobile Drawer (`SlotDrawer.tsx`): On `< 768px` viewports, selecting a slot slides up a smooth native-feeling bottom sheet showing slot specifications, dimensions, and 1-tap flat allotment.

## 2. Dual Template Engine (`src/lib/docxEngine.ts` & `src/lib/pdfEngine.ts`)

### A. Word `.docx` Engine (`docxtemplater` + `pizzip`)
- **Template Preflight Linter:** Scans raw `.docx` files on upload. Catches unclosed `{tags}`, broken tags fragmented across `<w:r>` runs, and mismatched loop blocks (`{#co_buyers}...{/co_buyers}`).
- Injects standard fields: `{buyer_name}`, `{pan_masked}`, `{flat_no}`, `{tower_name}`, `{sba_sqft}`, `{uds_sqft}`, `{parking_slot_no}`, `{parking_level}`, `{consideration_amount}`, `{consideration_amount_words}`, `{date_dd_mm_yyyy}`.

### B. Blank PDF Coordinate Mapper (`pdf-lib`)
- Allows builders to use pre-printed letterheads or government stamp papers.
- Interactive click-to-place `(X, Y)` coordinate mapper.
- Normalizes coordinates between browser screen pixels and native PDF point space (origin bottom-left, A4 595x842 pt, Legal 612x1008 pt).
- **Watermark Engine:** Automatically stamps unapproved draft exports with a high-contrast diagonal semi-transparent watermark: `DRAFT — FOR VERIFICATION ONLY — NOT A REGISTERED DOCUMENT`.

## 3. 1-Click Home Loan Bank Kit Bundler (`BankKitBundler.tsx`)
- Simultaneously generates:
  1. `Car_Parking_Allotment_Letter_[FlatNo].docx` + `.pdf`
  2. `Builder_Home_Loan_Tripartite_NOC_[FlatNo].docx` + `.pdf`
  3. `Unit_Cost_Payment_Schedule_[FlatNo].docx` + `.pdf`
- Bundles all files into a single `.zip` file using `JSZip` and triggers instant browser download with zero server storage overhead.
- Includes a 1-click button: **"Share Draft on WhatsApp"** opening `https://wa.me/?text=...` with pre-filled buyer message and verification link.
