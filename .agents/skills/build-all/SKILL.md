---
name: build-all
description: Master orchestrator that executes the end-to-end build, unpacks templates, runs sub-build skills, and executes complete QA verification across mobile and desktop.
---

# Master End-to-End Build & Execution Skill (`/build-all`)

Use this skill to orchestrate the entire development, compilation, template unpacking, and verification pipeline for DeedFlow.

## Workflow Pipeline

### Stage 1: Template Generation & Database Assets
1. Execute `node scripts/generate-all-templates.mjs` to construct genuine, valid `.docx` binaries with proper styling and XML tags:
   - `public/templates/car-parking-allotment.docx`
   - `public/templates/builder-home-loan-noc.docx`
   - `public/templates/unit-cost-sheet.docx`
2. Validate that `scripts/seed-database.sql` has complete PostgreSQL schemas, atomic stored procedures (`allot_parking_slot`), and sample Bengaluru projects (e.g. "Sobha Royal Pavilion - Tower B").

### Stage 2: Sub-Skill Execution Order
Execute the specialized build skills in strict sequence:
1. `/build-core`: Sets up Next.js 15 App Router, TypeScript strict configuration, Tailwind CSS Institutional Trust theme (`#F8FAFC`, `#0F172A`, `#1E3A8A`), deterministic Indian currency converter (`indianCurrencyToWords.ts`), and smart legal grammar engine.
2. `/build-parking-and-edge-cases`: Implements the interactive visual basement parking grid (B1/B2, slot locking, mobile bottom-sheet), dual template engine (`docxtemplater` + `pdf-lib`), 1-Click Bank Kit (.ZIP), and watermarked draft preview.
3. `/wire-backend`: Hooks up in-memory Gemini 2.5 Flash KYC OCR route with Aadhaar masking, Supabase client with local-first demo fallback, and public QR verification endpoints (`/verify/[hash]`).
4. `/add-billing`: Implements the "Launch Partner Free Beta" banner and dormant Razorpay checkout plumbing ready for instant activation.

### Stage 3: Quality & Security Verification
1. Run `npm run typecheck` to ensure 0 TypeScript errors.
2. Run `npm run build` to confirm clean Next.js 15 production build.
3. Execute `/qa-verify` to validate responsive layouts across `375x812` mobile and `1440x900` desktop, confirm zero PII leaks, and verify `.docx` and `.pdf` document generation integrity.
