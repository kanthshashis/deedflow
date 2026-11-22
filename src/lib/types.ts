import { z } from "zod";

export type UserRole = "super_admin" | "project_admin" | "project_operator";

export type EntityType = "sole" | "joint" | "nri_gpa" | "company";

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  organizationId?: string;
  projectId?: string;
  projectName?: string;
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
