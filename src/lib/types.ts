import { z } from "zod";

export type UserRole =
  | "super_admin"
  | "promoter_executive"
  | "project_admin"
  | "legal_counsel"
  | "project_operator"
  | "bank_auditor";

export type PermissionAction =
  | "view_revenue_kpis"
  | "manage_inventory"
  | "allot_parking"
  | "stage_swap_diff"
  | "approve_diff_queue"
  | "generate_documents"
  | "manage_templates"
  | "rollback_templates"
  | "invite_team_members"
  | "view_audit_stream"
  | "configure_statutory_profile";

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  switch (action) {
    case "view_revenue_kpis":
      return ["super_admin", "promoter_executive", "project_admin"].includes(role);
    case "manage_inventory":
      return ["super_admin", "project_admin"].includes(role);
    case "allot_parking":
      return ["super_admin", "project_admin", "project_operator"].includes(role);
    case "stage_swap_diff":
      return ["super_admin", "project_admin", "project_operator"].includes(role);
    case "approve_diff_queue":
      return ["super_admin", "project_admin"].includes(role);
    case "generate_documents":
      return ["super_admin", "project_admin", "legal_counsel", "project_operator"].includes(role);
    case "manage_templates":
      return ["super_admin", "legal_counsel"].includes(role);
    case "rollback_templates":
      return ["super_admin", "legal_counsel"].includes(role);
    case "invite_team_members":
      return ["super_admin", "project_admin"].includes(role);
    case "view_audit_stream":
      return ["super_admin", "promoter_executive", "project_admin", "legal_counsel"].includes(role);
    case "configure_statutory_profile":
      return ["super_admin", "project_admin"].includes(role);
    default:
      return false;
  }
}

export type EntityType = "sole" | "joint" | "nri_gpa" | "company";

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  avatarUrl?: string;
  organizationId?: string;
  organizationName?: string;
  projectId?: string;
  projectName?: string;
  status?: "active" | "suspended";
  lastLogin?: string;
  twoFactorEnabled?: boolean;
}

export interface PaymentUtrRecord {
  milestone: string;
  amount: number;
  bankName: string;
  utrNumber: string;
  date: string;
}

export interface WitnessProfile {
  name: string;
  age: number;
  address: string;
  idNumber: string; // DL, PAN, or Passport
}

export interface SaleDeedEnrichment {
  e_stamp_certificate_no: string;
  e_stamp_date: string;
  stamp_duty_amount: number;
  registration_fee_amount: number;
  payment_utr_schedule: PaymentUtrRecord[];
  uds_sqft: number;
  possession_date: string;
  witness_1_name_address: string;
  witness_2_name_address: string;
}

export interface CoBuyerProfile {
  fullName: string;
  panNumber: string;
  aadhaarMasked: string;
  relationship: string;
  sharePercentage: number;
  phone?: string;
  email?: string;
}

export interface BuyerProfile {
  fullName: string;
  panNumber: string;
  aadhaarNumberMasked: string; // e.g. "XXXXXXXX4826"
  email: string;
  phone: string;
  address: string;
  entityType: EntityType;
  // Joint buyer fields
  coBuyers?: CoBuyerProfile[];
  // Legacy support for single co-buyer
  coBuyerName?: string;
  coBuyerPan?: string;
  coBuyerAadhaarMasked?: string;
  relationship?: string;
  // NRI GPA fields
  gpaHolderName?: string;
  gpaDocumentNumber?: string;
  gpaRegistrationDate?: string;
  gpaSroOffice?: string;
  // Corporate fields
  companyName?: string;
  cin?: string;
  gstin?: string;
  authorizedSignatoryName?: string;
  designation?: string;
  boardResolutionDate?: string;
  // Statutory Sale Deed Enrichment
  saleDeedEnrichment?: SaleDeedEnrichment;
}

export interface UnitInventory {
  id: string;
  tower: string;
  flatNumber: string;
  floorNumber: number;
  unitType: string;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  undividedShareLandSqFt: number;
  udsPercentage?: number;
  northBoundary: string;
  southBoundary: string;
  eastBoundary: string;
  westBoundary: string;
  basePrice: number;
  status: "available" | "blocked" | "booked" | "sold";
  isLocked?: boolean;
  lockReason?: string;
  allottee?: BuyerProfile;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  level: "Basement 1" | "Basement 2" | "Ground Surface" | "Stilt";
  slotType: "Standard Covered" | "Compact Covered" | "Tandem (Double)" | "Open Surface" | "Covered EV-Ready";
  status: "available" | "reserved" | "allotted" | "blocked";
  allottedUnitFlat?: string;
  allottedUnitId?: string;
  allotmentDate?: string;
  notes?: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  legalName: string;
  reraNumber: string;
  sanctionPlanNo: string;
  location: string;
  taluk: string;
  district: string;
  surveyNumbers: string;
  totalUnits: number;
  totalParkingSlots: number;
  status: "active" | "suspended";
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  requestedBy: string;
  requestedByRole: UserRole;
  entityType: "unit" | "unit_owner" | "parking_slot";
  entityId: string;
  flatNumber: string;
  action: "create" | "update" | "delete" | "swap";
  changeSource: "manual_edit" | "excel_sync" | "register_vision_ocr" | "parking_grid_swap";
  oldData: Record<string, any>;
  newData: Record<string, any>;
  diffSummary: {
    field: string;
    label: string;
    oldValue: string | number;
    newValue: string | number;
  }[];
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface AuditLog {
  id: string;
  projectId: string;
  changeRequestId?: string;
  entityType: string;
  entityId: string;
  flatNumber: string;
  action: string;
  snapshotBefore: Record<string, any>;
  snapshotAfter: Record<string, any>;
  appliedBy: string;
  appliedAt: string;
  canRollback: boolean;
  rolledBackAt?: string;
}

export const KycExtractionSchema = z.object({
  fullName: z.string().default(""),
  documentType: z.enum(["PAN", "AADHAAR", "PASSPORT", "VOTER_ID", "UNKNOWN"]).default("UNKNOWN"),
  idNumber: z.string().default(""),
  fatherName: z.string().nullable().default(null),
  dateOfBirth: z.string().nullable().default(null),
  address: z.string().nullable().default(null),
  confidenceScore: z.number().min(0).max(1).default(0.95),
});

export type KycExtractionResult = z.infer<typeof KycExtractionSchema>;
