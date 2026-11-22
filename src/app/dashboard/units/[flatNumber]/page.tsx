"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  MOCK_UNITS,
  MOCK_PARKING_SLOTS,
  MOCK_PROJECT,
  SAMPLE_BUYER,
} from "@/lib/mockData";
import {
  UnitInventory,
  ParkingSlot,
  BuyerProfile,
  EntityType,
} from "@/lib/types";
import { formatIndianCurrency, convertIndianCurrencyToWords } from "@/lib/indianCurrencyToWords";
import {
  generateParkingLetter,
  generateReraSaleAgreement,
  generateSaleDeed,
  generateMasterPostSalesZip,
  downloadBlob,
  UnitDossierInput,
} from "@/lib/postSalesDocKit";
import {
  Building2,
  Car,
  FileText,
  FileCheck2,
  FileCode2,
  Share2,
  Download,
  CheckCircle2,
  ArrowLeft,
  Users,
  ShieldCheck,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Loader2,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import clsx from "clsx";

export default function UnitDossierPage({
  params,
}: {
  params: Promise<{ flatNumber: string }>;
}) {
  const resolvedParams = use(params);
  const flatNumber = decodeURIComponent(resolvedParams.flatNumber);

  // Find unit or fallback
  const initialUnit =
    MOCK_UNITS.find((u) => u.flatNumber.toLowerCase() === flatNumber.toLowerCase()) ||
    MOCK_UNITS[0];

  const [unit, setUnit] = useState<UnitInventory>(initialUnit);

  // Buyer state
  const [buyer, setBuyer] = useState<BuyerProfile>({
    ...SAMPLE_BUYER,
    fullName: initialUnit.allottee?.fullName || SAMPLE_BUYER.fullName,
    panNumber: initialUnit.allottee?.panNumber || SAMPLE_BUYER.panNumber,
    address: initialUnit.allottee?.address || SAMPLE_BUYER.address,
  });

  // Multi-Parking Slot state (Single or Tandem)
  const initialAssignedSlot =
    MOCK_PARKING_SLOTS.find((s) => s.allottedUnitFlat === unit.flatNumber) ||
    MOCK_PARKING_SLOTS[1];

  const [selectedSlots, setSelectedSlots] = useState<ParkingSlot[]>([initialAssignedSlot]);
  const [parkingFee, setParkingFee] = useState<number>(350000);

  // Generation status state
  const [activeGeneratingDoc, setActiveGeneratingDoc] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    type: "parking" | "ats" | "deed";
    content: string[];
  } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Calculations
  const totalConsideration = unit.basePrice + parkingFee;
  const isJoint = buyer.entityType === "joint";

  // Build input for document generator
  const getDossierInput = (): UnitDossierInput => ({
    project: MOCK_PROJECT,
    unit,
    slots: selectedSlots,
    buyer,
    parkingFee,
    bankName: "State Bank of India",
    bankBranch: "Sarjapur Road Branch, Bengaluru",
    isDraft: true,
  });

  // Action: Generate & Download Parking Letter
  const handleDownloadParking = async (format: "pdf" | "docx") => {
    try {
      setActiveGeneratingDoc("parking");
      const result = await generateParkingLetter(getDossierInput());
      if (format === "pdf") {
        downloadBlob(result.pdfBlob, `${result.filenameBase}.pdf`);
      } else {
        downloadBlob(result.docxBlob, `${result.filenameBase}.docx`);
      }
      setNotification(`Downloaded ${format.toUpperCase()} for Parking Allotment (Bay ${selectedSlots.map(s => s.slotNumber).join(", ")})`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(`Generation failed: ${err.message || String(err)}`);
    } finally {
      setActiveGeneratingDoc(null);
    }
  };

  // Action: Generate & Download RERA Agreement for Sale (ATS)
  const handleDownloadAts = async (format: "pdf" | "docx") => {
    try {
      setActiveGeneratingDoc("ats");
      const result = await generateReraSaleAgreement(getDossierInput());
      if (format === "pdf") {
        downloadBlob(result.pdfBlob, `${result.filenameBase}.pdf`);
      } else {
        downloadBlob(result.docxBlob, `${result.filenameBase}.docx`);
      }
      setNotification(`Downloaded ${format.toUpperCase()} for Karnataka RERA Agreement for Sale (ATS)`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(`Generation failed: ${err.message || String(err)}`);
    } finally {
      setActiveGeneratingDoc(null);
    }
  };

  // Action: Generate & Download Sale Deed
  const handleDownloadSaleDeed = async (format: "pdf" | "docx") => {
    try {
      setActiveGeneratingDoc("deed");
      const result = await generateSaleDeed(getDossierInput());
      if (format === "pdf") {
        downloadBlob(result.pdfBlob, `${result.filenameBase}.pdf`);
      } else {
        downloadBlob(result.docxBlob, `${result.filenameBase}.docx`);
      }
      setNotification(`Downloaded ${format.toUpperCase()} for Kaveri 2.0 Sale Deed Dossier`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(`Generation failed: ${err.message || String(err)}`);
    } finally {
      setActiveGeneratingDoc(null);
    }
  };

  // Action: 1-Click Master ZIP (All Documents in both DOCX + PDF)
  const handleDownloadMasterZip = async () => {
    try {
      setActiveGeneratingDoc("zip");
      const result = await generateMasterPostSalesZip(getDossierInput());
      downloadBlob(result.zipBlob, result.filename);
      setNotification(`Downloaded Complete Post-Sales Package (.ZIP) with all DOCX + PDF contracts!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(`ZIP compilation failed: ${err.message || String(err)}`);
    } finally {
      setActiveGeneratingDoc(null);
    }
  };

  // Action: WhatsApp Direct Share
  const handleWhatsAppShare = (docType: "parking" | "ats" | "deed" | "all") => {
    const docLabels = {
      parking: `Car Parking Allotment Letter (Bay ${selectedSlots.map(s => s.slotNumber).join(", ")})`,
      ats: "Karnataka RERA Agreement for Sale (ATS)",
      deed: "Kaveri 2.0 Absolute Sale Deed Draft",
      all: "Complete Post-Sales Document Dossier",
    };

    const text = encodeURIComponent(
      `Dear ${buyer.fullName},\n\nGreetings from ${MOCK_PROJECT.name} Post-Sales Office.\n\nYour official ${docLabels[docType]} for Flat ${unit.flatNumber} (${unit.tower}) has been prepared for your review.\n\n• Unit: Flat ${unit.flatNumber} (${unit.unitType})\n• Car Parking: Bay ${selectedSlots.map(s => s.slotNumber).join(", ")}\n• Consideration: ${formatIndianCurrency(totalConsideration)}\n\nPlease verify and let us know if any corrections are needed.\n\nWarm regards,\nPost-Sales Operations Team\n${MOCK_PROJECT.name}`
    );

    const cleanPhone = buyer.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // Toggle Tandem / Second Parking Slot
  const handleToggleSecondSlot = () => {
    if (selectedSlots.length > 1) {
      setSelectedSlots([selectedSlots[0]]);
      setParkingFee(350000);
    } else {
      const secondSlot = MOCK_PARKING_SLOTS.find(
        (s) => s.status === "available" && s.id !== selectedSlots[0].id
      ) || MOCK_PARKING_SLOTS[2];
      setSelectedSlots([...selectedSlots, secondSlot]);
      setParkingFee(650000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#8C777A]">
        <Link
          href="/dashboard/inventory"
          className="hover:text-[#7D1826] flex items-center space-x-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Unit Dossiers</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#24060B]">{unit.flatNumber}</span>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="bg-[#FFF9EE] border border-[#F2E4C4] text-[#821A2A] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[#8C777A] hover:text-[#24060B] text-xs font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Unit Header Card */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#F0E8DD] pb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 rounded-md bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8] font-mono text-xs font-bold">
                {unit.flatNumber}
              </span>
              <span className="text-xs font-medium text-[#5C4A4D]">• {unit.tower}</span>
              <span className="text-xs font-medium text-[#5C4A4D]">• Floor {unit.floorNumber}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE DOSSIER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1.5">
              {unit.unitType} — {unit.superBuiltUpAreaSqFt} sq.ft
            </h1>
            <p className="text-xs text-[#5C4A4D] mt-1">
              RERA Carpet Area: <span className="font-semibold text-[#24060B]">{unit.carpetAreaSqFt} sq.ft</span> • Undivided Share (UDS): <span className="font-semibold text-[#24060B]">{unit.undividedShareLandSqFt} sq.ft</span>
            </p>
          </div>

          {/* Master 1-Click Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={handleDownloadMasterZip}
              disabled={activeGeneratingDoc === "zip"}
              className="px-5 py-3 glossy-btn-burgundy hover:brightness-105 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              {activeGeneratingDoc === "zip" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4B989]" />
                  <span>Compiling ZIP Dossier...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#D4B989]" />
                  <span>Download Complete Dossier (.ZIP)</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleWhatsAppShare("all")}
              className="px-4 py-3 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 4 Financial & Cadastral Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]/80">
            <span className="text-[10px] font-mono text-[#8C777A] uppercase tracking-wider block">Base Apartment Price</span>
            <span className="text-sm sm:text-base font-bold font-serif text-[#24060B] block mt-0.5">
              {formatIndianCurrency(unit.basePrice)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]/80">
            <span className="text-[10px] font-mono text-[#8C777A] uppercase tracking-wider block">Dedicated Car Parking</span>
            <span className="text-sm sm:text-base font-bold font-serif text-[#24060B] block mt-0.5">
              {formatIndianCurrency(parkingFee)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]/80">
            <span className="text-[10px] font-mono text-[#8C777A] uppercase tracking-wider block">Total Agreed Consideration</span>
            <span className="text-sm sm:text-base font-bold font-serif text-[#821A2A] block mt-0.5">
              {formatIndianCurrency(totalConsideration)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]/80">
            <span className="text-[10px] font-mono text-[#8C777A] uppercase tracking-wider block">Allotted Parking Bay</span>
            <span className="text-sm sm:text-base font-bold font-mono text-[#24060B] block mt-0.5">
              {selectedSlots.map((s) => s.slotNumber).join(" & ")}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Operational Grid: Buyer Details & Parking Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Buyer KYC & Allottee Profile */}
        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#821A2A]" />
              <h2 className="text-sm font-bold font-serif text-[#24060B]">Buyer KYC &amp; Representation</h2>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-[#5C4A4D]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>KYC Verified</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Primary Allottee Full Name</label>
              <input
                type="text"
                value={buyer.fullName}
                onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-medium focus:outline-none focus:border-[#821A2A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">PAN Card Number</label>
                <input
                  type="text"
                  value={buyer.panNumber}
                  onChange={(e) => setBuyer({ ...buyer, panNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-mono font-medium focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Aadhaar (Redacted/Masked)</label>
                <input
                  type="text"
                  value={buyer.aadhaarNumberMasked}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#F5EFE8] text-[#5C4A4D] font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Phone (WhatsApp)</label>
                <input
                  type="text"
                  value={buyer.phone}
                  onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Entity Type</label>
                <select
                  value={buyer.entityType}
                  onChange={(e) => setBuyer({ ...buyer, entityType: e.target.value as EntityType })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-medium focus:outline-none focus:border-[#821A2A]"
                >
                  <option value="sole">Individual (Sole Allottee)</option>
                  <option value="joint">Joint Allottees (Husband &amp; Wife)</option>
                  <option value="nri_gpa">NRI via Power of Attorney (GPA)</option>
                  <option value="company">Corporate / Pvt Ltd Entity</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Permanent Residential Address</label>
              <textarea
                rows={2}
                value={buyer.address}
                onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Parking Bay Assignment & Tandem Multi-Slot Setup */}
        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-[#821A2A]" />
              <h2 className="text-sm font-bold font-serif text-[#24060B]">Dedicated Parking Allocation</h2>
            </div>
            <button
              onClick={handleToggleSecondSlot}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FAF0F2] text-[#821A2A] hover:bg-[#F2E0E4] border border-[#E8C4C8] transition-colors cursor-pointer"
            >
              {selectedSlots.length > 1 ? "Remove 2nd Slot" : "+ Add Tandem / 2nd Bay"}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Slot 1 */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#24060B]">Primary Bay: {selectedSlots[0].slotNumber}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FFF9EE] text-[#B88E3E] border border-[#F2E4C4]">
                  {selectedSlots[0].level}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5C4A4D]">
                <div>Type: <span className="font-medium text-[#24060B]">{selectedSlots[0].slotType}</span></div>
                <div>Status: <span className="font-semibold text-emerald-700">Locked to {unit.flatNumber}</span></div>
              </div>
            </div>

            {/* Slot 2 (if Tandem enabled) */}
            {selectedSlots.length > 1 && (
              <div className="p-3.5 rounded-xl bg-[#FFF9EE] border border-[#F2E4C4] space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#821A2A]">Secondary / Tandem Bay: {selectedSlots[1].slotNumber}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8]">
                    {selectedSlots[1].level}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5C4A4D]">
                  <div>Type: <span className="font-medium text-[#24060B]">Tandem (Double) Stacked</span></div>
                  <div>Fee Added: <span className="font-semibold text-[#821A2A]">+₹3,00,000</span></div>
                </div>
              </div>
            )}

            <div className="pt-2 text-[11px] text-[#5C4A4D] bg-[#FAF7F2] p-3 rounded-lg border border-[#DECFC0]/60">
              <span className="font-semibold text-[#24060B]">Supreme Court Shield:</span> Both bays are appurtenant to Unit {unit.flatNumber} with explicit non-severable covenants in accordance with RERA and the <em>Nahalchand Laloochand</em> judgment.
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Core Document Execution Cards (The Heart-Winning Section!) */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#821A2A] uppercase">
            <span className="w-3 h-[2px] bg-[#821A2A] rounded-full" />
            <span>Post-Sales Document Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Generate Contracts &amp; Deeds (2 Clicks)
          </h2>
          <p className="text-xs text-[#5C4A4D]">
            Official print-ready locked PDFs + 100% editable Word (.docx) templates for buyer &amp; advocate review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Car Parking Allotment Letter */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#821A2A]/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] border border-[#E8C4C8] flex items-center justify-center text-[#821A2A]">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Ready
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[#24060B]">
                Car Parking Allotment Letter
              </h3>
              <p className="text-xs text-[#5C4A4D] leading-relaxed">
                Appurtenant bay {selectedSlots.map(s => s.slotNumber).join(" & ")}, dimensions, boundaries, and builder seal.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F0E8DD]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadParking("pdf")}
                  disabled={activeGeneratingDoc === "parking"}
                  className="px-3 py-2 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D4B989]" />
                  <span>PDF Draft</span>
                </button>
                <button
                  onClick={() => handleDownloadParking("docx")}
                  disabled={activeGeneratingDoc === "parking"}
                  className="px-3 py-2 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Word (.docx)</span>
                </button>
              </div>

              <button
                onClick={() => handleWhatsAppShare("parking")}
                className="w-full py-2 bg-[#FAF7F2] hover:bg-[#F2EBE1] text-[#24060B] border border-[#DECFC0] text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Card 2: Karnataka RERA Agreement for Sale (ATS) */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#821A2A]/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#FFF9EE] border border-[#F2E4C4] flex items-center justify-center text-[#B88E3E]">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Form 'N'
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[#24060B]">
                RERA Agreement for Sale (ATS)
              </h3>
              <p className="text-xs text-[#5C4A4D] leading-relaxed">
                Karnataka Form N model: UDS {unit.undividedShareLandSqFt} sq.ft, 6-stage payment milestones, Sec 14(3) defect liability.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F0E8DD]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadAts("pdf")}
                  disabled={activeGeneratingDoc === "ats"}
                  className="px-3 py-2 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D4B989]" />
                  <span>PDF Draft</span>
                </button>
                <button
                  onClick={() => handleDownloadAts("docx")}
                  disabled={activeGeneratingDoc === "ats"}
                  className="px-3 py-2 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Word (.docx)</span>
                </button>
              </div>

              <button
                onClick={() => handleWhatsAppShare("ats")}
                className="w-full py-2 bg-[#FAF7F2] hover:bg-[#F2EBE1] text-[#24060B] border border-[#DECFC0] text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Card 3: Kaveri 2.0 Sub-Registrar Sale Deed */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#821A2A]/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] border border-[#E8C4C8] flex items-center justify-center text-[#821A2A]">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Kaveri 2.0
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[#24060B]">
                Kaveri 2.0 Sale Deed Dossier
              </h3>
              <p className="text-xs text-[#5C4A4D] leading-relaxed">
                Schedules A (Land), B (Building), C (Apartment boundaries), D (UDS &amp; Bay). e-Stamp ready for registration day.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F0E8DD]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadSaleDeed("pdf")}
                  disabled={activeGeneratingDoc === "deed"}
                  className="px-3 py-2 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D4B989]" />
                  <span>PDF Draft</span>
                </button>
                <button
                  onClick={() => handleDownloadSaleDeed("docx")}
                  disabled={activeGeneratingDoc === "deed"}
                  className="px-3 py-2 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Word (.docx)</span>
                </button>
              </div>

              <button
                onClick={() => handleWhatsAppShare("deed")}
                className="w-full py-2 bg-[#FAF7F2] hover:bg-[#F2EBE1] text-[#24060B] border border-[#DECFC0] text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
