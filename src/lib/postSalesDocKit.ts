import JSZip from "jszip";
import saveAs from "file-saver";
import { fillDocxTemplate } from "./docxEngine";
import { generateLegalPdf } from "./pdfEngine";
import { convertIndianCurrencyToWords, formatIndianCurrency } from "./indianCurrencyToWords";
import { generateLegalGrammar } from "./smartGrammar";
import { BuyerProfile, UnitInventory, ParkingSlot, ProjectMetadata } from "./types";

export interface UnitDossierInput {
  project: ProjectMetadata;
  unit: UnitInventory;
  slots: ParkingSlot[]; // Supports 1 or multiple slots (e.g., Tandem / Double)
  buyer: BuyerProfile;
  parkingFee?: number;
  bankName?: string;
  bankBranch?: string;
  isDraft?: boolean;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Builds the complete dictionary of replacement tokens used across all 5 legal templates.
 */
export function buildDossierTemplateData(input: UnitDossierInput) {
  const {
    project,
    unit,
    slots,
    buyer,
    parkingFee = 350000,
    bankName = "State Bank of India",
    bankBranch = "MG Road Branch, Bengaluru",
    isDraft = true,
  } = input;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const totalAmount = unit.basePrice + parkingFee;
  const grammar = generateLegalGrammar(buyer);

  // Multi-slot / Tandem formatting
  const slotNumbers = slots.length > 0 ? slots.map((s) => s.slotNumber).join(" & ") : "Unallocated";
  const slotLevels = slots.length > 0 ? Array.from(new Set(slots.map((s) => s.level))).join(" / ") : "Basement";
  const slotTypes = slots.length > 0 ? Array.from(new Set(slots.map((s) => s.slotType))).join(" + ") : "Standard Covered";

  // Square meters conversion for Kaveri 2.0 / RERA
  const carpetSqm = (unit.carpetAreaSqFt * 0.092903).toFixed(2);
  const sbaSqm = (unit.superBuiltUpAreaSqFt * 0.092903).toFixed(2);

  // Project master boundaries (defaulting to standard Bangalore layout if not explicitly set)
  const masterNorth = "Survey No. 34 (Road & Green Belt)";
  const masterSouth = "40-Feet Wide BBMP Main Road";
  const masterEast = "Private Property / Sy. No. 38";
  const masterWest = "Storm Water Drain (Raja Kaluve Buffer) / Sy. No. 33";

  return {
    company_name: project.legalName,
    company_cin: "L45201KA1995PLC018475",
    project_name: project.name,
    project_rera_no: project.reraNumber,
    sanction_plan_no: project.sanctionPlanNo || "BBMP/ADDL.DIR/JD-SOUTH/LP/0114/2018-19",
    location: project.location,
    taluk: project.taluk,
    district: project.district,
    survey_numbers: project.surveyNumbers,
    master_north: masterNorth,
    master_south: masterSouth,
    master_east: masterEast,
    master_west: masterWest,
    date_dd_mm_yyyy: dateStr,
    date_year: today.getFullYear().toString(),
    salutation: buyer.entityType === "company" ? "Messrs" : "Mr./Ms.",
    buyer_name: buyer.fullName,
    buyer_pan: buyer.panNumber,
    buyer_aadhaar_masked: buyer.aadhaarNumberMasked,
    buyer_address: buyer.address,
    allottee_noun: buyer.entityType === "joint" ? "Allottees" : buyer.entityType === "company" ? "Allottee Company" : "Allottee",
    legal_representation: grammar.representationClause,
    flat_no: unit.flatNumber,
    tower_name: unit.tower,
    floor_ordinal: `${unit.floorNumber}${getOrdinalSuffix(unit.floorNumber)}`,
    sba_sqft: unit.superBuiltUpAreaSqFt.toString(),
    sba_sqm: sbaSqm,
    carpet_sqft: unit.carpetAreaSqFt.toString(),
    carpet_sqm: carpetSqm,
    uds_sqft: unit.undividedShareLandSqFt.toString(),
    unit_north: unit.northBoundary || "Corridor / Internal Accessway",
    unit_south: unit.southBoundary || "External Facade / Open to Sky",
    unit_east: unit.eastBoundary || "Adjacent Flat / Service Duct",
    unit_west: unit.westBoundary || "Lift Lobby / Staircase",
    parking_slot_no: slotNumbers,
    parking_level: slotLevels,
    parking_type: slotTypes,
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
    possession_date: "31st December 2027",
    e_stamp_certificate_no: buyer.saleDeedEnrichment?.e_stamp_certificate_no || "IN-KA92847192847102U",
    stamp_duty_formatted: formatIndianCurrency(buyer.saleDeedEnrichment?.stamp_duty_amount || 729000),
    reg_fee_formatted: formatIndianCurrency(buyer.saleDeedEnrichment?.registration_fee_amount || 145800),
  };
}

/**
 * 1. Generates the Official Car Parking Allotment Letter (PDF & DOCX)
 */
export async function generateParkingLetter(input: UnitDossierInput) {
  const templateData = buildDossierTemplateData(input);
  const verificationHash = `DF-PARK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Fetch DOCX template
  const res = await fetch("/templates/car-parking-allotment.docx");
  const docxBuffer = await res.arrayBuffer();
  const filledDocx = fillDocxTemplate(docxBuffer, templateData);

  // Generate PDF
  const pdfBytes = await generateLegalPdf({
    title: `CAR PARKING ALLOTMENT LETTER — ${input.unit.flatNumber}`,
    isDraft: input.isDraft,
    verificationHash,
    contentParagraphs: [
      `Date: ${templateData.date_dd_mm_yyyy} | Ref: DF/PARK/${input.unit.flatNumber}/${templateData.date_year}`,
      `Allottee: ${input.buyer.fullName} (PAN: ${input.buyer.panNumber}, ID Ref: ${input.buyer.aadhaarNumberMasked})`,
      `Project: ${input.project.name} | RERA: ${input.project.reraNumber}`,
      `Sub: Allotment of Dedicated Car Parking Bay No. ${templateData.parking_slot_no} (${templateData.parking_level})`,
      `We confirm that for Apartment ${input.unit.flatNumber} (${input.unit.tower}), dedicated ${templateData.parking_type} Car Parking Bay No. ${templateData.parking_slot_no} in ${templateData.parking_level} has been allotted for agreed consideration of ${templateData.parking_fee_formatted} (${templateData.parking_fee_words}).`,
      `In compliance with Supreme Court legal precedents (Nahalchand Laloochand), this allotment is an exclusive right of use appurtenant to Unit ${input.unit.flatNumber} and shall not be transferred independently.`,
      `For ${input.project.legalName} — Authorized Signatory`,
    ],
  });

  return {
    docxBlob: new Blob([new Uint8Array(filledDocx)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
    pdfBlob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filenameBase: `Car_Parking_Allotment_${input.unit.flatNumber}`,
    verificationHash,
  };
}

/**
 * 2. Generates the Karnataka RERA Form N Agreement for Sale (PDF & DOCX)
 */
export async function generateReraSaleAgreement(input: UnitDossierInput) {
  const templateData = buildDossierTemplateData(input);
  const verificationHash = `DF-ATS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const res = await fetch("/templates/karnataka-rera-sale-agreement.docx");
  const docxBuffer = await res.arrayBuffer();
  const filledDocx = fillDocxTemplate(docxBuffer, templateData);

  const pdfBytes = await generateLegalPdf({
    title: `AGREEMENT FOR SALE (FORM N) — UNIT ${input.unit.flatNumber}`,
    isDraft: input.isDraft,
    verificationHash,
    contentParagraphs: [
      `Karnataka Real Estate Regulatory Authority (RERA) Form 'N'`,
      `Date: ${templateData.date_dd_mm_yyyy} | Project: ${input.project.name} (RERA: ${input.project.reraNumber})`,
      `Promoter: ${input.project.legalName} | CIN: ${templateData.company_cin}`,
      `Allottee: ${input.buyer.fullName} | PAN: ${input.buyer.panNumber} | ID Ref: ${input.buyer.aadhaarNumberMasked}`,
      `Unit: Flat No. ${input.unit.flatNumber}, ${templateData.floor_ordinal} Floor, ${input.unit.tower}`,
      `Carpet Area: ${templateData.carpet_sqft} sq.ft (${templateData.carpet_sqm} sq.m) | Super Built-up: ${templateData.sba_sqft} sq.ft`,
      `Undivided Share of Land (UDS): ${templateData.uds_sqft} sq.ft | Parking: Bay ${templateData.parking_slot_no} (${templateData.parking_level})`,
      `Total Sale Consideration: ${templateData.total_sale_price_formatted} (${templateData.total_sale_price_words})`,
      `Statutory Milestones: 10% Booking, 10% Agreement, 15% Plinth, 25% Slabs, 35% Finishing, 5% Handover.`,
      `Possession Commitment: On or before ${templateData.possession_date} with 5-year defect liability under RERA Sec 14(3).`,
      `For ${input.project.legalName} — Authorized Signatory`,
    ],
  });

  return {
    docxBlob: new Blob([new Uint8Array(filledDocx)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
    pdfBlob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filenameBase: `RERA_Agreement_For_Sale_${input.unit.flatNumber}`,
    verificationHash,
  };
}

/**
 * 3. Generates the Kaveri 2.0 Sub-Registrar Absolute Sale Deed Dossier (PDF & DOCX)
 */
export async function generateSaleDeed(input: UnitDossierInput) {
  const templateData = buildDossierTemplateData(input);
  const verificationHash = `DF-DEED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const res = await fetch("/templates/kaveri-sale-deed-dossier.docx");
  const docxBuffer = await res.arrayBuffer();
  const filledDocx = fillDocxTemplate(docxBuffer, templateData);

  const pdfBytes = await generateLegalPdf({
    title: `DEED OF ABSOLUTE SALE (KAVERI 2.0) — UNIT ${input.unit.flatNumber}`,
    isDraft: input.isDraft,
    verificationHash,
    contentParagraphs: [
      `Government of Karnataka — Department of Stamps & Registration (Kaveri 2.0)`,
      `e-Stamp Certificate No: ${templateData.e_stamp_certificate_no} | Date: ${templateData.date_dd_mm_yyyy}`,
      `Vendor: ${input.project.legalName} | Purchaser: ${input.buyer.fullName} (${input.buyer.panNumber})`,
      `Total Consideration Acknowledged: ${templateData.total_sale_price_formatted} (${templateData.total_sale_price_words})`,
      `Schedule 'A' (Master Land): ${input.project.surveyNumbers}, ${input.project.location}, ${input.project.taluk}`,
      `Schedule 'B' (Complex): ${input.project.name} multistoried residential complex`,
      `Schedule 'C' (Apartment): Flat ${input.unit.flatNumber}, ${templateData.floor_ordinal} Floor, ${input.unit.tower}. North: ${templateData.unit_north}, South: ${templateData.unit_south}, East: ${templateData.unit_east}, West: ${templateData.unit_west}`,
      `Schedule 'D' (UDS & Parking): UDS ${templateData.uds_sqft} sq.ft with exclusive Car Parking Bay ${templateData.parking_slot_no} in ${templateData.parking_level}`,
      `For ${input.project.legalName} — Authorized Signatory`,
    ],
  });

  return {
    docxBlob: new Blob([new Uint8Array(filledDocx)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
    pdfBlob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filenameBase: `Kaveri2_Sale_Deed_Dossier_${input.unit.flatNumber}`,
    verificationHash,
  };
}

/**
 * 4. Master 1-Click Post-Sales All-In-One ZIP Bundler
 * Compiles all 5 legal documents (DOCX + PDF) in a single organized ZIP package.
 */
export async function generateMasterPostSalesZip(input: UnitDossierInput) {
  const [parking, ats, deed] = await Promise.all([
    generateParkingLetter(input),
    generateReraSaleAgreement(input),
    generateSaleDeed(input),
  ]);

  const zip = new JSZip();
  const folderName = `PostSales_Dossier_Unit_${input.unit.flatNumber}_${input.buyer.fullName.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const folder = zip.folder(folderName) || zip;

  folder.file(`01_${parking.filenameBase}.docx`, parking.docxBlob);
  folder.file(`01_${parking.filenameBase}.pdf`, parking.pdfBlob);

  folder.file(`02_${ats.filenameBase}.docx`, ats.docxBlob);
  folder.file(`02_${ats.filenameBase}.pdf`, ats.pdfBlob);

  folder.file(`03_${deed.filenameBase}.docx`, deed.docxBlob);
  folder.file(`03_${deed.filenameBase}.pdf`, deed.pdfBlob);

  const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const filename = `${folderName}.zip`;

  return {
    zipBlob,
    filename,
    verificationHash: ats.verificationHash,
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}
