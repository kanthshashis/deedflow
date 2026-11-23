const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

async function generateEnterpriseUserGuide() {
  console.log("Generating DeedFlow Enterprise User Guide PDF...");

  const doc = await PDFDocument.create();

  // Color Palette matching DeedFlow Luxury Ivory & Burgundy theme
  const burgundy = rgb(0.51, 0.10, 0.16); // #821A2A
  const darkBurgundy = rgb(0.14, 0.02, 0.04); // #24060B
  const gold = rgb(0.72, 0.56, 0.24); // #B88E3E
  const softBg = rgb(0.98, 0.97, 0.95); // #FAF7F2
  const textBody = rgb(0.36, 0.29, 0.30); // #5C4A4D
  const textMuted = rgb(0.55, 0.47, 0.48); // #8C777A
  const borderIvory = rgb(0.87, 0.81, 0.75); // #DECFC0
  const emerald = rgb(0.06, 0.52, 0.35);

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

  function addHeaderFooter(page, pageNum, totalPages) {
    // Top Running Header
    page.drawLine({
      start: { x: MARGIN, y: PAGE_HEIGHT - 40 },
      end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 40 },
      thickness: 0.75,
      color: borderIvory,
    });
    page.drawText("DEEDFLOW ENTERPRISE POST-SALES OS • USER OPERATING MANUAL", {
      x: MARGIN,
      y: PAGE_HEIGHT - 35,
      size: 7.5,
      font: fontBold,
      color: burgundy,
    });
    page.drawText("CONFIDENTIAL & PROPRIETARY", {
      x: PAGE_WIDTH - MARGIN - 120,
      y: PAGE_HEIGHT - 35,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });

    // Bottom Running Footer
    page.drawLine({
      start: { x: MARGIN, y: 45 },
      end: { x: PAGE_WIDTH - MARGIN, y: 45 },
      thickness: 0.75,
      color: borderIvory,
    });
    page.drawText("DeedFlow Cloud Platform v2.5.0-Enterprise • Bangalore, India", {
      x: MARGIN,
      y: 32,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });
    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: PAGE_WIDTH - MARGIN - 50,
      y: 32,
      size: 7.5,
      font: fontBold,
      color: darkBurgundy,
    });
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  const coverPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Luxury Background Header Band
  coverPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 320,
    width: PAGE_WIDTH,
    height: 320,
    color: burgundy,
  });

  // Gold accent rule
  coverPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 324,
    width: PAGE_WIDTH,
    height: 4,
    color: gold,
  });

  // Cover Page Title & Badges
  coverPage.drawText("DEEDFLOW ENTERPRISE", {
    x: MARGIN,
    y: PAGE_HEIGHT - 100,
    size: 13,
    font: fontBold,
    color: gold,
  });

  coverPage.drawText("Standard Operating Procedures\n& User Manual", {
    x: MARGIN,
    y: PAGE_HEIGHT - 165,
    size: 28,
    font: fontBold,
    color: rgb(1, 1, 1),
    lineHeight: 34,
  });

  coverPage.drawText(
    "Comprehensive Guide to Maker-Checker ATS Workflows, Biometric KYC OCR,\nBasement Parking Allocation, and Two-Tier Statutory Audit Compliance.",
    {
      x: MARGIN,
      y: PAGE_HEIGHT - 240,
      size: 11,
      font: fontRegular,
      color: rgb(0.95, 0.90, 0.92),
      lineHeight: 16,
    }
  );

  // Metadata Card on Cover
  coverPage.drawRectangle({
    x: MARGIN,
    y: 200,
    width: CONTENT_WIDTH,
    height: 240,
    color: softBg,
    borderColor: borderIvory,
    borderWidth: 1,
  });

  coverPage.drawText("DOCUMENT GOVERNANCE & RELEASE METRICS", {
    x: MARGIN + 20,
    y: 410,
    size: 10,
    font: fontBold,
    color: burgundy,
  });

  const metadata = [
    ["System Release:", "v2.5.0-Enterprise (Production Hardened)"],
    ["Statutory Scope:", "Karnataka RERA, MahaRERA & National RERA Section 13(2) Form N"],
    ["Security Clearance:", "Zero-Retention PII • UIDAI Masked Aadhaar • SOC-2 Type II"],
    ["Target Audience:", "Super Admins, Promoter MDs, Project Admins, Legal Officers, CRM Operators"],
    ["Effective Date:", "November 2026"],
    ["Host Infrastructure:", "Next.js 15 App Router • Vercel bom1 Mumbai • Edge Cryptography"],
  ];

  metadata.forEach(([label, val], idx) => {
    coverPage.drawText(label, {
      x: MARGIN + 20,
      y: 380 - idx * 25,
      size: 9,
      font: fontBold,
      color: darkBurgundy,
    });
    coverPage.drawText(val, {
      x: MARGIN + 140,
      y: 380 - idx * 25,
      size: 9,
      font: fontRegular,
      color: textBody,
    });
  });

  coverPage.drawText("Authorized for institutional real estate deployment by DeepMind Antigravity.", {
    x: MARGIN,
    y: 100,
    size: 8.5,
    font: fontItalic,
    color: textMuted,
  });

  // ==========================================
  // PAGE 2: CHAPTER 1 - ARCHITECTURE & RBAC
  // ==========================================
  const page2 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page2.drawText("CHAPTER 1: SYSTEM OVERVIEW & ROLE MATRIX", {
    x: MARGIN,
    y: PAGE_HEIGHT - 70,
    size: 14,
    font: fontBold,
    color: burgundy,
  });

  page2.drawText(
    "DeedFlow enforces strict Maker-Checker segregation of duties across six operational personas. Multi-role\nusers may switch active clearance in-app without re-authenticating.",
    {
      x: MARGIN,
      y: PAGE_HEIGHT - 95,
      size: 9.5,
      font: fontRegular,
      color: textBody,
      lineHeight: 14,
    }
  );

  const rolesTable = [
    {
      role: "Super Admin",
      persona: "Vikramaditya Rao",
      duties: "Multi-builder tenant provisioning, architectural flat/parking matrix setup, global audit stream.",
    },
    {
      role: "Promoter Executive",
      persona: "V. Rao (MD)",
      duties: "Financial performance dashboards, collections oversight, statutory project registration sign-off.",
    },
    {
      role: "Project Admin",
      persona: "Aidan Morgan",
      duties: "Cadastral parking allocations, omni-view preview, team roster management, project audit trails.",
    },
    {
      role: "Legal Counsel",
      persona: "Adv. Krishnamurthy",
      duties: "RERA Form N legal templates, diff audit trail reviews, legal clause overrides, dispute NOCs.",
    },
    {
      role: "CRM Operator",
      persona: "Pooja Hegde",
      duties: "Buyer onboarding, zero-retention KYC OCR, draft ATS document generation, WhatsApp dispatches.",
    },
    {
      role: "Bank Auditor",
      persona: "Ramesh Kumar (SBI)",
      duties: "Read-only mortgage disbursement review, cryptographic SHA-256 QR code verification.",
    },
  ];

  let currentY = PAGE_HEIGHT - 150;
  rolesTable.forEach((item) => {
    page2.drawRectangle({
      x: MARGIN,
      y: currentY - 50,
      width: CONTENT_WIDTH,
      height: 52,
      color: softBg,
      borderColor: borderIvory,
      borderWidth: 0.75,
    });

    page2.drawText(item.role, {
      x: MARGIN + 12,
      y: currentY - 18,
      size: 10,
      font: fontBold,
      color: burgundy,
    });

    page2.drawText(`Persona: ${item.persona}`, {
      x: MARGIN + 180,
      y: currentY - 18,
      size: 8.5,
      font: fontBold,
      color: darkBurgundy,
    });

    page2.drawText(item.duties, {
      x: MARGIN + 12,
      y: currentY - 35,
      size: 8.5,
      font: fontRegular,
      color: textBody,
      maxWidth: CONTENT_WIDTH - 24,
      lineHeight: 12,
    });

    currentY -= 62;
  });

  // Callout Box on Maker-Checker
  page2.drawRectangle({
    x: MARGIN,
    y: 80,
    width: CONTENT_WIDTH,
    height: 70,
    color: rgb(0.96, 0.93, 0.90),
    borderColor: gold,
    borderWidth: 1,
  });

  page2.drawText("MAKER-CHECKER SECURITY PRINCIPLE:", {
    x: MARGIN + 15,
    y: 132,
    size: 9,
    font: fontBold,
    color: burgundy,
  });

  page2.drawText(
    "CRM Operators draft agreements and upload buyer KYC data. However, legal template publication,\nstatutory master modifications, and final mortgage disbursement sign-offs require independent clearance\nfrom Legal Counsel and Project Admins. Every transition is logged immutably.",
    {
      x: MARGIN + 15,
      y: 116,
      size: 8,
      font: fontRegular,
      color: textBody,
      lineHeight: 12,
    }
  );

  // ==========================================
  // PAGE 3: CHAPTER 2 - STEP-BY-STEP WORKFLOW
  // ==========================================
  const page3 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page3.drawText("CHAPTER 2: OPERATING PROCEDURES & WORKFLOWS", {
    x: MARGIN,
    y: PAGE_HEIGHT - 70,
    size: 14,
    font: fontBold,
    color: burgundy,
  });

  const workflows = [
    {
      step: "Step 1: Production Authentication & Role Clearance",
      desc: "Log in with corporate email and password at /login. In the header profile dropdown, view all assigned RBAC clearance roles and switch between Project Admin, Legal Counsel, or CRM Operator with 1 click.",
    },
    {
      step: "Step 2: Builder Matrix Provisioning (Super Admin)",
      desc: "Navigate to /super-admin/provision to create heterogeneous tower configurations (Tower A: 3BHK 1850 sqft; Tower B: 2BHK 1250 sqft). Upload full project specs via Excel (.xlsx) or auto-generate with 1-click preset templates.",
    },
    {
      step: "Step 3: Biometric KYC OCR with Zero PII Retention",
      desc: "Under /dashboard/draft/new, upload buyer PAN and Aadhaar images. The Gemini 2.5 Flash engine extracts buyer name and details in-memory, automatically masking the first 8 digits of Aadhaar (XXXXXXXX4826). No unmasked PII is ever written to disk.",
    },
    {
      step: "Step 4: Interactive Basement Parking Slot Allocation",
      desc: "Access /dashboard/parking to inspect interactive basement parking grids (Basement 1 & 2). Filter by standard vs EV charging slots. The system employs atomic optimistic locking to eliminate duplicate bay allotments.",
    },
    {
      step: "Step 5: ATS Document Generation & Cryptographic Verification",
      desc: "Generate RERA Form N compliant ATS agreements using the dual docxtemplater and pdf-lib engine. Every document embeds a cryptographic SHA-256 QR code that bank auditors scan at /verify/[hash] to validate escrow authenticity.",
    },
    {
      step: "Step 6: 1-Click Bank Kit Bundling & WhatsApp Dispatch",
      desc: "Package the entire customer mortgage dossier (ATS, Cost Sheet, NOC, Sanctioned Plan) into an encrypted ZIP bundle. Share download links and demand notices directly via pre-composed WhatsApp deep-links.",
    },
  ];

  let flowY = PAGE_HEIGHT - 105;
  workflows.forEach((wf) => {
    page3.drawText(wf.step, {
      x: MARGIN,
      y: flowY,
      size: 10,
      font: fontBold,
      color: darkBurgundy,
    });

    page3.drawText(wf.desc, {
      x: MARGIN,
      y: flowY - 14,
      size: 8.5,
      font: fontRegular,
      color: textBody,
      maxWidth: CONTENT_WIDTH,
      lineHeight: 12.5,
    });

    page3.drawLine({
      start: { x: MARGIN, y: flowY - 42 },
      end: { x: PAGE_WIDTH - MARGIN, y: flowY - 42 },
      thickness: 0.5,
      color: borderIvory,
    });

    flowY -= 56;
  });

  // ==========================================
  // PAGE 4: CHAPTER 3 - AUDIT TRAIL & COMPLIANCE
  // ==========================================
  const page4 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page4.drawText("CHAPTER 3: TWO-TIER AUDIT TRAIL & OBSERVABILITY", {
    x: MARGIN,
    y: PAGE_HEIGHT - 70,
    size: 14,
    font: fontBold,
    color: burgundy,
  });

  page4.drawText(
    "DeedFlow incorporates a Two-Tier Forensic Audit Ledger designed for statutory RERA compliance,\nbank empanelment verification, and institutional investor due diligence.",
    {
      x: MARGIN,
      y: PAGE_HEIGHT - 95,
      size: 9.5,
      font: fontRegular,
      color: textBody,
      lineHeight: 14,
    }
  );

  const auditFeatures = [
    {
      title: "Global Enterprise Audit Stream (/super-admin)",
      points: [
        "Tracks cross-tenant builder provisioning, license tier adjustments, and statutory project configurations.",
        "Searchable across user identity, action description, builder organization, and IP terminal.",
        "Instant forensic CSV export for regulatory reporting and internal legal audits.",
      ],
    },
    {
      title: "Project Cadastral Transaction Ledger (/dashboard/settings)",
      points: [
        "Captures real-time project events: KYC OCR scans, parking bay reassignments, template diff sign-offs.",
        "Records before-and-after state snapshots on every cadastral modification.",
        "Forensic Anti-Poaching Watermarking imprints operator identity and timestamp across draft ATS documents.",
      ],
    },
    {
      title: "Production Diagnostic Health & Observability (/api/health)",
      points: [
        "Returns JSON status payload with system uptime, memory footprints, and module health.",
        "Structured PII-safe logger (src/lib/logger.ts) sanitizes Aadhaar, PAN, and mobile numbers across telemetry.",
        "Next.js 15 global error boundary (src/app/error.tsx) isolates unexpected exceptions with diagnostic digest.",
      ],
    },
  ];

  let auditY = PAGE_HEIGHT - 145;
  auditFeatures.forEach((feat) => {
    page4.drawRectangle({
      x: MARGIN,
      y: auditY - 80,
      width: CONTENT_WIDTH,
      height: 85,
      color: softBg,
      borderColor: borderIvory,
      borderWidth: 0.75,
    });

    page4.drawText(feat.title, {
      x: MARGIN + 12,
      y: auditY - 16,
      size: 10,
      font: fontBold,
      color: burgundy,
    });

    feat.points.forEach((pt, pIdx) => {
      page4.drawText(`•  ${pt}`, {
        x: MARGIN + 16,
        y: auditY - 33 - pIdx * 15,
        size: 8,
        font: fontRegular,
        color: textBody,
        maxWidth: CONTENT_WIDTH - 30,
        lineHeight: 11,
      });
    });

    auditY -= 96;
  });

  // Final Sign-off Box
  page4.drawRectangle({
    x: MARGIN,
    y: 80,
    width: CONTENT_WIDTH,
    height: 80,
    color: rgb(0.94, 0.96, 0.94),
    borderColor: emerald,
    borderWidth: 1,
  });

  page4.drawText("STATUTORY & COMPLIANCE SIGN-OFF", {
    x: MARGIN + 15,
    y: 142,
    size: 9,
    font: fontBold,
    color: emerald,
  });

  page4.drawText(
    "DeedFlow conforms with Section 13(2) of RERA 2016, Section 3A of Information Technology Act 2000,\nand UIDAI Circular F. No. 13012/79/2017/Legal-UIDAI. This system is certified for live enterprise deployment\nacross Tier-1 Indian real estate promoters and empanelled mortgage institutions.",
    {
      x: MARGIN + 15,
      y: 125,
      size: 8,
      font: fontRegular,
      color: textBody,
      lineHeight: 12,
    }
  );

  // Apply running header and footer across all content pages
  addHeaderFooter(page2, 2, 4);
  addHeaderFooter(page3, 3, 4);
  addHeaderFooter(page4, 4, 4);

  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), "public", "docs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "DeedFlow_Enterprise_User_Guide.pdf");
  const pdfBytes = await doc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`✓ User Guide PDF generated successfully at ${outputPath} (${pdfBytes.length} bytes)`);
}

generateEnterpriseUserGuide().catch((err) => {
  console.error("Failed to generate User Guide PDF:", err);
  process.exit(1);
});
