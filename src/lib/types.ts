import { z } from "zod";

export type EntityType = "sole" | "joint" | "nri_gpa" | "company";

export interface BuyerProfile {
  fullName: string;
  panNumber: string;
  aadhaarNumberMasked: string; // e.g. "XXXXXXXX1234"
  email: string;
  phone: string;
  address: string;
  entityType: EntityType;
  // Joint buyer fields
  coBuyerName?: string;
  coBuyerPan?: string;
  coBuyerAadhaarMasked?: string;
  relationship?: string; // e.g., "Wife", "Husband", "Co-purchaser"
  // NRI GPA fields
  gpaHolderName?: string;
  gpaDocumentNumber?: string;
  // Corporate fields
  authorizedSignatoryName?: string;
  designation?: string;
  boardResolutionDate?: string;
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
  northBoundary: string;
  southBoundary: string;
  eastBoundary: string;
  westBoundary: string;
  basePrice: number;
  status: "available" | "booked" | "sold";
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  level: "Basement 1" | "Basement 2" | "Ground Surface" | "Stilt";
  slotType: "Standard Covered" | "Compact Covered" | "Tandem (Double)" | "Open Surface";
  status: "available" | "reserved" | "allotted" | "blocked";
  allottedUnitFlat?: string;
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
