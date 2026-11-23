import { UserRole } from "./types";

export type AuditScope = "global" | "project";
export type AuditSeverity = "info" | "warning" | "critical";
export type AuditCategory = "auth" | "security" | "compliance" | "document" | "parking" | "system" | "matrix";

export interface AuditRecord {
  id: string;
  scope: AuditScope;
  builderId?: string;
  builderName?: string;
  projectId?: string;
  projectName?: string;
  userId: string;
  userName: string;
  userRole: UserRole | string;
  action: string;
  category: AuditCategory;
  severity: AuditSeverity;
  target: string;
  timestamp: string;
  ipAddress: string;
  userAgent?: string;
  details?: Record<string, any>;
  beforeSnapshot?: Record<string, any>;
  afterSnapshot?: Record<string, any>;
}

const STORAGE_KEY_AUDIT = "deedflow_audit_trail_v2";

const SEED_AUDIT_TRAIL: AuditRecord[] = [
  {
    id: "aud_gl_001",
    scope: "global",
    builderId: "bld_sobha_01",
    builderName: "Sobha Limited",
    userId: "usr_sa_01",
    userName: "Vikramaditya Rao",
    userRole: "super_admin",
    action: "Provisioned Enterprise Builder Tenant & Project Licenses",
    category: "system",
    severity: "info",
    target: "Sobha Royal Pavilion (RERA: PRM/KA/RERA/1251/446/PR/190204/002348)",
    timestamp: "2026-11-23T15:30:00Z",
    ipAddress: "103.21.144.18 (Sobha Corporate HQ)",
    details: {
      allocatedTowers: ["A", "B", "C", "D"],
      totalUnits: 640,
      licenseTier: "Enterprise Unlimited",
    },
  },
  {
    id: "aud_gl_002",
    scope: "global",
    builderId: "bld_prestige_02",
    builderName: "Prestige Estates Projects Ltd",
    userId: "usr_sa_01",
    userName: "Vikramaditya Rao",
    userRole: "super_admin",
    action: "Configured Heterogeneous Floor Plate Matrix",
    category: "matrix",
    severity: "info",
    target: "Prestige Falcon City (Tower 1 vs Tower 2 Custom Carpet Areas)",
    timestamp: "2026-11-23T14:45:00Z",
    ipAddress: "103.21.144.18 (Sobha Corporate HQ)",
    details: {
      tower1Config: "3BHK Luxury (1850 sqft)",
      tower2Config: "2BHK Compact (1250 sqft)",
    },
  },
  {
    id: "aud_pr_003",
    scope: "project",
    builderId: "bld_sobha_01",
    builderName: "Sobha Limited",
    projectId: "proj_srp_01",
    projectName: "Sobha Royal Pavilion - Tower B",
    userId: "usr_lc_01",
    userName: "Advocate Krishnamurthy",
    userRole: "legal_counsel",
    action: "Approved Statutory ATS Form N Template v2.1",
    category: "compliance",
    severity: "info",
    target: "Karnataka RERA Form N Sale Agreement Draft",
    timestamp: "2026-11-23T13:10:00Z",
    ipAddress: "49.207.210.92 (High Court Chambers)",
    details: {
      verifiedClauses: ["Sec 13(2) 10% advance cap", "Sec 18 interest rate compliance"],
      hashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
  },
  {
    id: "aud_pr_004",
    scope: "project",
    builderId: "bld_sobha_01",
    builderName: "Sobha Limited",
    projectId: "proj_srp_01",
    projectName: "Sobha Royal Pavilion - Tower B",
    userId: "usr_pa_01",
    userName: "Aidan Morgan",
    userRole: "project_admin",
    action: "Reallocated Basement EV Parking Slot",
    category: "parking",
    severity: "warning",
    target: "Bay B1-042 -> Unit B-402 (Kantharaju M.)",
    timestamp: "2026-11-23T11:20:00Z",
    ipAddress: "103.21.144.18 (Site Office)",
    beforeSnapshot: { unitId: "B-204", parkingBay: "B1-042", evCharging: true },
    afterSnapshot: { unitId: "B-402", parkingBay: "B1-042", evCharging: true },
    details: { reason: "Buyer upgraded to EV fast charger package" },
  },
  {
    id: "aud_pr_005",
    scope: "project",
    builderId: "bld_sobha_01",
    builderName: "Sobha Limited",
    projectId: "proj_srp_01",
    projectName: "Sobha Royal Pavilion - Tower B",
    userId: "usr_po_01",
    userName: "Pooja Hegde",
    userRole: "project_operator",
    action: "Executed In-Memory KYC OCR Extraction & Aadhaar Masking",
    category: "document",
    severity: "info",
    target: "Unit B-101 (Buyer: Anand Narayanan)",
    timestamp: "2026-11-23T09:40:00Z",
    ipAddress: "103.21.144.18 (Site Office)",
    details: {
      ocrEngine: "Gemini 2.5 Flash",
      aadhaarMasked: "XXXXXXXX4826",
      panExtracted: "ABCDE****F",
      piiRetainedOnDisk: false,
    },
  },
  {
    id: "aud_gl_006",
    scope: "global",
    builderId: "bld_sobha_01",
    builderName: "Sobha Limited",
    userId: "usr_ba_01",
    userName: "Ramesh Kumar",
    userRole: "bank_auditor",
    action: "Empanelled Bank QR Code Verification & Loan NOC Check",
    category: "security",
    severity: "info",
    target: "SBI Project Master File (RERA Escrow 39281726482)",
    timestamp: "2026-11-22T16:15:00Z",
    ipAddress: "122.176.45.12 (SBI RACPC Bangalore)",
    details: {
      escrowAccountMatches: true,
      signatureHashVerified: true,
    },
  },
];

/**
 * Returns all audit events stored locally, falling back to seed data.
 */
export function getAllAuditRecords(): AuditRecord[] {
  if (typeof window === "undefined") {
    return SEED_AUDIT_TRAIL;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (raw) {
      const records: AuditRecord[] = JSON.parse(raw);
      if (Array.isArray(records) && records.length > 0) {
        return records;
      }
    }
    // Initialize with seed data
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(SEED_AUDIT_TRAIL));
  } catch {
    // Graceful fallback
  }

  return SEED_AUDIT_TRAIL;
}

/**
 * Records a new audit event into the ledger with automated timestamp and unique ID.
 */
export function recordAuditEvent(event: Omit<AuditRecord, "id" | "timestamp">): AuditRecord {
  const newRecord: AuditRecord = {
    ...event,
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = getAllAuditRecords();
      const updated = [newRecord, ...current].slice(0, 500); // keep last 500 records
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated));
      window.dispatchEvent(new Event("deedflow_audit_logged"));
    } catch (e) {
      console.warn("Failed to persist audit event:", e);
    }
  }

  return newRecord;
}

/**
 * Filters audit events by scope, builder, search term, and severity.
 */
export function filterAuditRecords(
  records: AuditRecord[],
  options: {
    scope?: AuditScope;
    builderId?: string;
    severity?: AuditSeverity;
    category?: AuditCategory;
    search?: string;
  }
): AuditRecord[] {
  return records.filter((r) => {
    if (options.scope && r.scope !== options.scope) return false;
    if (options.builderId && r.builderId !== options.builderId) return false;
    if (options.severity && r.severity !== options.severity) return false;
    if (options.category && r.category !== options.category) return false;
    if (options.search) {
      const q = options.search.toLowerCase();
      const match =
        r.action.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q) ||
        (r.builderName && r.builderName.toLowerCase().includes(q)) ||
        (r.projectName && r.projectName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

/**
 * Exports audit records to a CSV string.
 */
export function exportAuditRecordsCsv(records: AuditRecord[]): string {
  const headers = [
    "Event ID",
    "Scope",
    "Timestamp (UTC)",
    "Builder Name",
    "Project Name",
    "User Name",
    "User Role",
    "Action",
    "Category",
    "Severity",
    "Target / Entity",
    "IP Address",
  ];

  const rows = records.map((r) => [
    r.id,
    r.scope,
    r.timestamp,
    `"${(r.builderName || "").replace(/"/g, '""')}"`,
    `"${(r.projectName || "").replace(/"/g, '""')}"`,
    `"${r.userName.replace(/"/g, '""')}"`,
    r.userRole,
    `"${r.action.replace(/"/g, '""')}"`,
    r.category,
    r.severity,
    `"${r.target.replace(/"/g, '""')}"`,
    `"${r.ipAddress.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
