# DEEDFLOW — COMPLETE MASTER BLUEPRINT (PRODUCT, SKILLS, TEMPLATES & GTM)

## PART 1: EXECUTIVE PRODUCT SPECIFICATION & GAP AUDIT BRIEF
- **Product Name:** DeedFlow (`deedflow.in`)
- **Target Market:** Small-to-mid-size residential real estate builders, post-sales teams, real estate brokers, and local registration deed writers in India (starting in Bengaluru/Karnataka, scalable pan-India & UAE).
- **Core Value Proposition:** Turn buyer KYC photos (PAN, Passport, IDs) and master unit spreadsheets into zero-typo, print-ready `.docx` and `.pdf` legal documents in 15 seconds—preserving 100% of the builder's existing Word formatting or pre-printed PDF letterhead.
- **Entry Wedge (v1):** Car Parking Allotment Letters + Interactive Visual Basement Parking Slot Grid (prevents double-allotments).
- **High-Retention Expansion Modules:**
  1. **1-Click Home Loan Bank Kit (.ZIP):** Generates Car Parking Allotment + Builder Home Loan NOC + Unit Cost Sheet simultaneously from one verified buyer profile.
  2. **Master Unit Inventory Auto-Fill:** Upload project/flat schedule data once (`Tower`, `Flat No.`, `Floor`, `Carpet/SBA`, `UDS`, `North/South/East/West Boundaries`, `RERA No.`) so clerks select a flat from a dropdown.
  3. **Multi-Party & Entity Smart Grammar Engine:** Toggles between `Sole Individual`, `Joint Co-Buyers`, `NRI via GPA Holder`, and `Company/LLP/HUF`, dynamically adjusting singular/plural legal grammar (`Allottee` vs. `Allottees`, `his/her` vs. `their`).
  4. **Dual Template Engine:**
     - `.docx` Engine (`docxtemplater` + `pizzip`) with **Template Preflight Linter** (catches unclosed `{tags}` on upload).
     - Blank PDF / Scanned Image Overlay (`pdf-lib`) with interactive click-to-place `(X, Y)` coordinate mapper, whiteout box text replacement, and diagonal `"DRAFT — FOR VERIFICATION ONLY"` watermarked PDF export for WhatsApp buyer approval.
  5. **Draft v2 Revision History:** Saves verified JSON payloads (with sensitive Aadhaar identifiers strictly redacted) so operators can edit and regenerate v2 documents without re-uploading KYC images or burning extra OCR credits.
  6. **Maker-Checker Approval Link & QR Authenticity Footer:** Optional manager sign-off link and public verification QR code (`verify.deedflow.in/doc/[hash]`).

### Non-Negotiable Security & Engineering Invariants
1. **Zero-Retention KYC Privacy:** Uploaded ID images go into a private Supabase bucket (`kyc-temp`), are processed in memory by Gemini 2.5 Flash, and are **immediately deleted** in a `finally` block (backed by a 15-minute `pg_cron` failsafe sweep). Never store, log, or echo full 12-digit Aadhaar numbers—redact as `[Aadhaar Redacted]`.
2. **Deterministic Financials:** Never rely on LLMs for currency-to-words conversion. Route all monetary values through `src/lib/indianCurrencyToWords.ts` (`350000` -> `"Rupees Three Lakhs Fifty Thousand Only"`).
3. **Institutional Trust UI:** Inspired by Stripe & Linear (`#F8FAFC` canvas, `#FFFFFF` cards with `1px solid #E2E8F0` borders, `#0F172A` Obsidian primary buttons, `#1E3A8A` Royal Legal Blue focus states, `Plus Jakarta Sans` + `Source Serif 4` + `JetBrains Mono` fonts). Zero purple/pink AI gradients. Full responsiveness across `375px` mobile, `768px` tablet, and `1440px` desktop.

---

## PART 2: REMAINING ANTIGRAVITY SKILLS & DATABASE SEED SCRIPT

### Skill A: `.agents/skills/build-all/SKILL.md` (Master Orchestrator)
```markdown
---
name: build-all
description: Audits DEEDFLOW_MASTER_BLUEPRINT.md for edge-case gaps, unpacks all templates/seeds, builds the complete end-to-end Next.js application, and runs browser QA verification.
---

# Master End-to-End Execution Workflow
1. **Architecture & Gap Audit:** Review `DEEDFLOW_MASTER_BLUEPRINT.md` and list any missing edge cases (e.g., offline/network retry on batch ZIP generation, PDF multi-page coordinate mapping, mobile bottom-sheet ergonomics, RLS edge cases) and incorporate fixes directly into the implementation plan.
2. **Generate Sample `.docx` Templates:** Run `node scripts/generate-all-templates.mjs` to create:
   - `public/templates/car-parking-allotment.docx`
   - `public/templates/builder-home-loan-noc.docx`
   - `public/templates/unit-cost-sheet.docx`
3. **Scaffold & Build Full App:** Execute `/build-core`, `/build-parking-and-edge-cases`, `/wire-backend`, and `/add-billing` sequentially.
4. **Verify & Polish:** Execute `/qa-verify` across `375x812` mobile and `1440x900` desktop viewports and output a visual walkthrough of every screen.