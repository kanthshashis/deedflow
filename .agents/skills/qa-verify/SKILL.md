---
name: qa-verify
description: Comprehensive verification suite testing Next.js compilation, TypeScript strict mode, multi-viewport responsiveness (375px, 768px, 1440px), document generation integrity, and zero PII leak audit.
---

# Quality Assurance & Security Verification Skill (`/qa-verify`)

Use this skill to audit and verify that DeedFlow is 100% bug-free, responsive, and secure before concluding any build step.

## Verification Checklist

### 1. Build & Compilation Audits
- Run `npm run typecheck` or `npx tsc --noEmit` $\to$ Must return 0 errors.
- Run `npm run build` $\to$ All static and server-rendered routes must compile cleanly.

### 2. Multi-Viewport Layout Integrity
- **Mobile (`375px x 812px` - iPhone):**
  - Header displays compact logo, project selector, and hamburger or bottom bar.
  - Parking slot grid displays horizontal scroll or compact cards; tapping a slot smoothly triggers `SlotDrawer` bottom sheet.
  - KYC file upload dropzone accepts camera roll photos without overflow.
  - 1-Click Bank Kit displays full-width "Share to WhatsApp" action.
- **Tablet (`768px x 1024px` - iPad):**
  - 2-column layout for KYC extracted fields and flat selector.
  - Parking grid renders 6 to 8 columns of basement bays cleanly.
- **Desktop (`1440px x 900px`):**
  - Full institutional dashboard with left navigation sidebar.
  - Side-by-side split screen: Left form controls, right live document preview with zoom and page controls.

### 3. Document Generation Integrity
- Trigger `.docx` generation with sample payload:
  - Verify that `{buyer_name}`, `{flat_no}`, `{parking_slot_no}`, and `{consideration_amount_words}` are correctly replaced with zero leftover `{brackets}`.
- Trigger `.pdf` generation:
  - Verify that the diagonal watermark `DRAFT — FOR VERIFICATION ONLY` appears distinctly in red semi-transparent font.
  - Verify that coordinates match letterhead margins.
- Trigger 1-Click Bank Kit ZIP:
  - Verify that the resulting `.zip` opens without corruption and contains all 3 documents.

### 4. PII & Security Leak Audit
- Verify client bundles do not contain `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `RAZORPAY_KEY_SECRET`.
- Verify that Aadhaar inputs never output raw 12 digits in the UI, state, or console logs.
