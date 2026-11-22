import JSZip from "jszip";
import saveAs from "file-saver";
import { fillDocxTemplate } from "./docxEngine";
import { generateLegalPdf } from "./pdfEngine";
import { convertIndianCurrencyToWords, formatIndianCurrency } from "./indianCurrencyToWords";
import { generateLegalGrammar } from "./smartGrammar";
import { BuyerProfile, UnitInventory, ParkingSlot, ProjectMetadata } from "./types";

export interface BankKitBundleInput {
  project: ProjectMetadata;
  unit: UnitInventory;
  slot: ParkingSlot;
  buyer: BuyerProfile;
  parkingFee?: number;
  bankName?: string;
  bankBranch?: string;
  isDraft?: boolean;
}

/**
 * Client & Server 1-Click Bank Kit Bundler.
 * Packages:
 * 1. Car Parking Allotment (.docx + .pdf)
 * 2. Builder Home Loan Tripartite NOC (.docx + .pdf)
 * 3. Official Unit Cost Sheet (.docx + .pdf)
 * into a single high-compression .ZIP file.
 */
export async function generateBankKitZip(
  input: BankKitBundleInput,
  rawTemplates: {
    parkingDocxBuffer: ArrayBuffer | Buffer;
    nocDocxBuffer: ArrayBuffer | Buffer;
    costSheetDocxBuffer: ArrayBuffer | Buffer;
  }
): Promise<{ zipBlob: Blob; verificationHash: string; filename: string }> {
  const { project, unit, slot, buyer, parkingFee = 350000, bankName = "State Bank of India", bankBranch = "MG Road Branch, Bengaluru", isDraft = true } = input;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const verificationHash = `DF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const grammar = generateLegalGrammar(buyer);
  const totalAmount = unit.basePrice + parkingFee;

  const templateData = {
    company_name: project.legalName,
    company_cin: "L45201KA1995PLC018475",
    project_name: project.name,
    project_rera_no: project.reraNumber,
    date_dd_mm_yyyy: dateStr,
    date_year: today.getFullYear().toString(),
    salutation: buyer.entityType === "company" ? "Messrs" : "Mr./Ms.",
    buyer_name: buyer.fullName,
    buyer_pan: buyer.panNumber,
    buyer_aadhaar_masked: buyer.aadhaarNumberMasked,
    buyer_address: buyer.address,
    flat_no: unit.flatNumber,
    tower_name: unit.tower,
    floor_ordinal: `${unit.floorNumber}${getOrdinalSuffix(unit.floorNumber)}`,
    sba_sqft: unit.superBuiltUpAreaSqFt.toString(),
    carpet_sqft: unit.carpetAreaSqFt.toString(),
    uds_sqft: unit.undividedShareLandSqFt.toString(),
    parking_slot_no: slot.slotNumber,
    parking_level: slot.level,
    parking_type: slot.slotType,
    parking_fee_formatted: formatIndianCurrency(parkingFee),
    parking_fee_words: convertIndianCurrencyToWords(parkingFee),
    base_price_formatted: formatIndianCurrency(unit.basePrice),
    total_sale_price_formatted: formatIndianCurrency(totalAmount),
    total_sale_price_words: convertIndianCurrencyToWords(totalAmount),
    amount_received_formatted: formatIndianCurrency(totalAmount * 0.2),
    amount_received_words: convertIndianCurrencyToWords(totalAmount * 0.2),
    balance_amount_formatted: formatIndianCurrency(totalAmount * 0.8),
    balance_amount_words: convertIndianCurrencyToWords(totalAmount * 0.8),
    bank_name: bankName,
    bank_branch_address: bankBranch,
    rera_bank_account_no: "918020034827101",
    rera_bank_ifsc: "SBIN0004120",
    rera_bank_name: "State Bank of India (RERA Master Account)",
    token_amount_formatted: formatIndianCurrency(totalAmount * 0.1),
    agreement_milestone_formatted: formatIndianCurrency(totalAmount * 0.1),
    plinth_milestone_formatted: formatIndianCurrency(totalAmount * 0.15),
    slab_milestone_formatted: formatIndianCurrency(totalAmount * 0.25),
    finishing_milestone_formatted: formatIndianCurrency(totalAmount * 0.35),
    possession_milestone_formatted: formatIndianCurrency(totalAmount * 0.05),
    infra_charges_formatted: formatIndianCurrency(250000),
    gst_amount_formatted: formatIndianCurrency(totalAmount * 0.05),
    agreement_date: dateStr,
    legal_representation: grammar.representationClause,
  };

  // Generate 3 .docx files
  const parkingDocx = fillDocxTemplate(rawTemplates.parkingDocxBuffer, templateData);
  const nocDocx = fillDocxTemplate(rawTemplates.nocDocxBuffer, templateData);
  const costSheetDocx = fillDocxTemplate(rawTemplates.costSheetDocxBuffer, templateData);

  // Generate 3 watermarked .pdf files
  const parkingPdf = await generateLegalPdf({
    title: `CAR PARKING ALLOTMENT LETTER — ${unit.flatNumber}`,
    isDraft,
    verificationHash,
    contentParagraphs: [
      `Date: ${dateStr} | Ref: DF/PARK/${unit.flatNumber}/${today.getFullYear()}`,
      `Allottee: ${buyer.fullName} (PAN: ${buyer.panNumber}, ID Ref: ${buyer.aadhaarNumberMasked})`,
      `Project: ${project.name} | RERA: ${project.reraNumber}`,
      `Sub: Allotment of Dedicated Car Parking Bay No. ${slot.slotNumber} (${slot.level})`,
      `We are pleased to confirm that for Apartment ${unit.flatNumber} (${unit.tower}), dedicated ${slot.slotType} Car Parking Bay No. ${slot.slotNumber} has been allotted for agreed consideration of ${formatIndianCurrency(parkingFee)} (${convertIndianCurrencyToWords(parkingFee)}).`,
      `This allotment is strictly appurtenant to Unit ${unit.flatNumber} and cannot be transferred independently.`,
      `For ${project.legalName} — Authorized Signatory`,
    ],
  });

  const nocPdf = await generateLegalPdf({
    title: `BUILDER HOME LOAN TRIPARTITE NOC — ${unit.flatNumber}`,
    isDraft,
    verificationHash,
    contentParagraphs: [
      `To: The Branch Manager, ${bankName}, ${bankBranch}`,
      `Date: ${dateStr}`,
      `Sub: NOC for Home Loan in favor of ${buyer.fullName} for Flat No. ${unit.flatNumber}, ${project.name}`,
      `1. We confirm allotment of Flat ${unit.flatNumber} (${unit.superBuiltUpAreaSqFt} sq.ft) with Parking Bay ${slot.slotNumber} for total sale consideration of ${formatIndianCurrency(totalAmount)} (${convertIndianCurrencyToWords(totalAmount)}).`,
      `2. Received till date: ${formatIndianCurrency(totalAmount * 0.2)}. Balance to be disbursed: ${formatIndianCurrency(totalAmount * 0.8)}.`,
      `3. We confirm NO OBJECTION to mortgage of said flat to ${bankName}.`,
      `4. Direct disbursement to RERA Master Account: 918020034827101 (IFSC: SBIN0004120).`,
      `For ${project.legalName} — Authorized Signatory`,
    ],
  });

  const costSheetPdf = await generateLegalPdf({
    title: `OFFICIAL UNIT COST SHEET — ${unit.flatNumber}`,
    isDraft,
    verificationHash,
    contentParagraphs: [
      `Buyer: ${buyer.fullName} | Unit: ${unit.flatNumber} | Tower: ${unit.tower}`,
      `Carpet Area: ${unit.carpetAreaSqFt} sq.ft | Super Built-up: ${unit.superBuiltUpAreaSqFt} sq.ft | Parking: ${slot.slotNumber}`,
      `1. Basic Consideration: ${formatIndianCurrency(unit.basePrice)}`,
      `2. Dedicated Parking Bay: ${formatIndianCurrency(parkingFee)}`,
      `3. Infrastructure Charges: ${formatIndianCurrency(250000)}`,
      `4. Applicable GST (5%): ${formatIndianCurrency(totalAmount * 0.05)}`,
      `TOTAL SALE VALUE: ${formatIndianCurrency(totalAmount)} (${convertIndianCurrencyToWords(totalAmount)})`,
      `Milestones: 10% Booking, 10% Agreement, 15% Plinth, 25% Slabs, 35% Finishing, 5% Possession.`,
      `For ${project.legalName} — Authorized Signatory`,
    ],
  });

  // Bundle into ZIP using JSZip
  const zip = new JSZip();
  const folderName = `BankKit_${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_Unit_${unit.flatNumber}`;
  const folder = zip.folder(folderName) || zip;

  folder.file(`01_Car_Parking_Allotment_${unit.flatNumber}.docx`, parkingDocx);
  folder.file(`01_Car_Parking_Allotment_${unit.flatNumber}.pdf`, parkingPdf);

  folder.file(`02_Builder_Home_Loan_NOC_${unit.flatNumber}.docx`, nocDocx);
  folder.file(`02_Builder_Home_Loan_NOC_${unit.flatNumber}.pdf`, nocPdf);

  folder.file(`03_Unit_Cost_Payment_Schedule_${unit.flatNumber}.docx`, costSheetDocx);
  folder.file(`03_Unit_Cost_Payment_Schedule_${unit.flatNumber}.pdf`, costSheetPdf);

  const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const filename = `${folderName}.zip`;

  return { zipBlob, verificationHash, filename };
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function triggerDownload(blob: Blob, filename: string) {
  saveAs(blob, filename);
}
