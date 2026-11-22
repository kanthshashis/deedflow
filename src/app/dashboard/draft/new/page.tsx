"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Download,
  FileArchive,
  Car,
  Building,
  Sparkles,
  Users,
  Eye,
  FileText,
  Lock,
} from "lucide-react";
import { MOCK_UNITS, MOCK_PARKING_SLOTS, MOCK_PROJECT, SAMPLE_BUYER } from "@/lib/mockData";
import { BuyerProfile, UnitInventory, ParkingSlot, EntityType, KycExtractionResult } from "@/lib/types";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";
import { generateBankKitZip, triggerDownload } from "@/lib/bankKit";

function VerificationStudioContent() {
  const searchParams = useSearchParams();
  const initialSlotNumber = searchParams.get("slot") || "B1-02";
  const initialSlot = MOCK_PARKING_SLOTS.find((s) => s.slotNumber === initialSlotNumber) || MOCK_PARKING_SLOTS[1];

  // State
  const [buyer, setBuyer] = useState<BuyerProfile>(SAMPLE_BUYER);
  const [selectedUnit, setSelectedUnit] = useState<UnitInventory>(MOCK_UNITS[0]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot>(initialSlot);
  const [parkingFee, setParkingFee] = useState(350000);
  const [bankName, setBankName] = useState("State Bank of India");
  const [bankBranch, setBankBranch] = useState("Sarjapur Road Branch, Bengaluru");

  // Document Preview Settings
  const [isWatermarkActive, setIsWatermarkActive] = useState(true);
  const [activeTab, setActiveTab] = useState<"parking" | "noc" | "cost">("parking");
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(0.96);
  const [notification, setNotification] = useState<string | null>(null);

  // KYC OCR Simulation
  const handleKycFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setNotification("Gemini 2.5 Flash running in-memory KYC OCR... ID image auto-purged from RAM.");

    setTimeout(() => {
      setOcrConfidence(0.96);
      setBuyer((prev) => ({
        ...prev,
        fullName: "Kantharaju Mariyappa",
        panNumber: "ABCDE1234F",
        aadhaarNumberMasked: "XXXXXXXX4826", // Always masked!
        address: "#402, 7th Main, Indiranagar, Bengaluru 560038",
      }));
      setNotification("KYC verified: PAN & Masked Aadhaar populated with 96% confidence.");
      setTimeout(() => setNotification(null), 5000);
    }, 900);
  };

  // Smart Grammar Tokens
  const isJoint = buyer.entityType === "joint";
  const isNri = buyer.entityType === "nri_gpa";
  const isCompany = buyer.entityType === "company";

  const allotteeNoun = isJoint ? "Allottees" : isCompany ? "Allottee Company" : "Allottee";
  const pronounPossessive = isJoint ? "their" : "his/her";
  const totalConsideration = selectedUnit.basePrice + parkingFee;

  // 1-Click Bank Kit ZIP Generation
  const handleGenerateBankKit = async () => {
    setIsGeneratingZip(true);
    try {
      const [parkingRes, nocRes, costRes] = await Promise.all([
        fetch("/templates/car-parking-allotment.docx"),
        fetch("/templates/builder-home-loan-noc.docx"),
        fetch("/templates/unit-cost-sheet.docx"),
      ]);

      const [parkingDocxBuffer, nocDocxBuffer, costSheetDocxBuffer] = await Promise.all([
        parkingRes.arrayBuffer(),
        nocRes.arrayBuffer(),
        costRes.arrayBuffer(),
      ]);

      const result = await generateBankKitZip(
        {
          project: MOCK_PROJECT,
          unit: selectedUnit,
          slot: selectedSlot,
          buyer,
          parkingFee,
          bankName,
          bankBranch,
          isDraft: isWatermarkActive,
        },
        {
          parkingDocxBuffer,
          nocDocxBuffer,
          costSheetDocxBuffer,
        }
      );

      triggerDownload(result.zipBlob, result.filename);
      setNotification("Bank Kit ZIP generated & downloaded (3 .docx documents bundled).");
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      alert(`Bank Kit generation error: ${err.message || String(err)}`);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*DeedFlow Watermarked Draft Review*\n\n` +
      `Dear ${buyer.fullName},\n` +
      `Please review your draft *Car Parking Allotment & Bank NOC* for *Flat ${selectedUnit.flatNumber}* (${selectedUnit.tower}) at ${MOCK_PROJECT.name}.\n\n` +
      `• Dedicated Bay: ${selectedSlot.slotNumber} (${selectedSlot.level})\n` +
      `• Total Consideration: ${formatIndianCurrency(totalConsideration)}\n\n` +
      `Kindly verify spelling of your name and PAN (${buyer.panNumber}) before we print on stamp paper.\n\n` +
      `Verification Link: http://localhost:3000/verify/sample-hash`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E] animate-pulse" />
            <span>Document Studio (UC-06 to UC-12)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Split-Screen Verification Studio
          </h1>
          <p className="text-xs text-[#5C4A4D] mt-0.5">
            Zero-retention KYC OCR, Multi-Party Smart Grammar, live A4 Serif legal preview &amp; 1-Click Bank Kit ZIP.
          </p>
        </div>

        {notification && (
          <div className="p-3 bg-[#FFFDFB] border border-[#DECFC0] text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* 3-COLUMN SPLIT SCREEN WORKSTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* PANEL 1: KYC VISION OCR & DROPZONE (Left 3.5 Cols) */}
        <div className="lg:col-span-4 glossy-card bg-[#FFFDFB] p-5 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#7D1826] font-serif">
              <ShieldCheck className="w-4 h-4 text-[#7D1826]" />
              <span>KYC OCR &amp; Privacy Shield</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF9EE] text-[#B88E3E] font-semibold border border-[#F2E4C4]">
              Zero Retention
            </span>
          </div>

          <label className="border-2 border-dashed border-[#DECFC0] hover:border-[#7D1826] p-5 rounded-xl text-center space-y-2 bg-[#FAF7F2] transition-colors block cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleKycFile}
            />
            <Upload className="w-7 h-7 text-[#8C777A] mx-auto" />
            <p className="text-xs font-bold text-[#24060B]">Drop Buyer ID (PAN / Passport)</p>
            <p className="text-[10px] text-[#5C4A4D]">Auto-masked Aadhaar • In-memory OCR</p>
          </label>

          {/* Extracted Identification Profile */}
          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8C777A] uppercase text-[10px] font-mono">Extracted Identification</span>
              {ocrConfidence && (
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {(ocrConfidence * 100).toFixed(0)}% Confidence
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-2 font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-[#5C4A4D] block uppercase font-sans font-semibold">Full Name:</span>
                <input
                  type="text"
                  value={buyer.fullName}
                  onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
                  className="w-full bg-white px-2 py-1 rounded border border-[#DECFC0] font-bold text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div>
                <span className="text-[10px] text-[#5C4A4D] block uppercase font-sans font-semibold">PAN Number:</span>
                <input
                  type="text"
                  value={buyer.panNumber}
                  onChange={(e) => setBuyer({ ...buyer, panNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-white px-2 py-1 rounded border border-[#DECFC0] font-bold text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div>
                <span className="text-[10px] text-[#5C4A4D] block uppercase font-sans font-semibold">UIDAI Aadhaar (Masked):</span>
                <div className="px-2 py-1 rounded bg-[#F8F2EC] border border-[#DECFC0] text-[#24060B] font-bold flex items-center justify-between">
                  <span>{buyer.aadhaarNumberMasked}</span>
                  <span className="text-[9px] text-[#B88E3E] bg-[#FFF9EE] border border-[#F2E4C4] px-1.5 py-0.5 rounded font-sans font-semibold">Masked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: BUYER STRUCTURE, SMART GRAMMAR & UNIT ASSOCIATION (Middle 4 Cols) */}
        <div className="lg:col-span-4 glossy-card bg-[#FFFDFB] p-5 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#7D1826] font-serif">
              <Users className="w-4 h-4 text-[#B88E3E]" />
              <span>Smart Legal Grammar &amp; Unit</span>
            </div>
          </div>

          {/* Buyer Structure Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#5C4A4D] mb-1.5">
              Buyer Legal Entity Type:
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8F2EC] rounded-xl text-xs border border-[#E8DFD3]">
              <button
                type="button"
                onClick={() => setBuyer({ ...buyer, entityType: "sole" })}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  buyer.entityType === "sole" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
                }`}
              >
                Sole Individual
              </button>
              <button
                type="button"
                onClick={() => setBuyer({ ...buyer, entityType: "joint" })}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  buyer.entityType === "joint" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
                }`}
              >
                Joint Co-Buyers
              </button>
              <button
                type="button"
                onClick={() => setBuyer({ ...buyer, entityType: "nri_gpa" })}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  buyer.entityType === "nri_gpa" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
                }`}
              >
                NRI via GPA
              </button>
              <button
                type="button"
                onClick={() => setBuyer({ ...buyer, entityType: "company" })}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  buyer.entityType === "company" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
                }`}
              >
                Corporate / LLP
              </button>
            </div>
          </div>

          {/* Unit Inventory Selector */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block font-bold text-[#5C4A4D] mb-1">Assigned Apartment / Flat:</label>
              <select
                value={selectedUnit.id}
                onChange={(e) => {
                  const unit = MOCK_UNITS.find((u) => u.id === e.target.value);
                  if (unit) setSelectedUnit(unit);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-bold text-[#24060B] bg-white focus:outline-none focus:border-[#4A0E17]"
              >
                {MOCK_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    Flat {u.flatNumber} ({u.tower}) • {u.unitType} • SBA {u.superBuiltUpAreaSqFt} sq.ft
                  </option>
                ))}
              </select>
            </div>

            {/* Parking Slot Association */}
            <div>
              <label className="block font-bold text-[#5C4A4D] mb-1">Dedicated Parking Bay:</label>
              <select
                value={selectedSlot.id}
                onChange={(e) => {
                  const slot = MOCK_PARKING_SLOTS.find((s) => s.id === e.target.value);
                  if (slot) setSelectedSlot(slot);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-bold text-[#24060B] bg-white focus:outline-none focus:border-[#4A0E17]"
              >
                {MOCK_PARKING_SLOTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    Slot {s.slotNumber} ({s.level} • {s.slotType})
                  </option>
                ))}
              </select>
            </div>

            {/* Financial Consideration */}
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#5C4A4D]">Flat Base Consideration:</span>
                <span className="font-mono font-bold text-[#24060B]">{formatIndianCurrency(selectedUnit.basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C4A4D]">Parking Space Fee:</span>
                <span className="font-mono font-bold text-[#24060B]">{formatIndianCurrency(parkingFee)}</span>
              </div>
              <div className="border-t border-[#DECFC0] pt-1.5 flex justify-between font-bold text-[#24060B]">
                <span>Total Consideration:</span>
                <span className="font-mono text-[#7D1826] font-bold">{formatIndianCurrency(totalConsideration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: LIVE A4 SERIF PREVIEW & BANK KIT BUNDLER (Right 4 Cols) */}
        <div className="lg:col-span-4 glossy-card bg-[#FFFDFB] p-5 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#7D1826] font-serif">
              <FileText className="w-4 h-4 text-[#7D1826]" />
              <span>Live Legal Deed Preview</span>
            </div>
            {/* Watermark Toggle */}
            <button
              onClick={() => setIsWatermarkActive(!isWatermarkActive)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                isWatermarkActive
                  ? "bg-[#FFF9EE] text-[#B88E3E] border-[#F2E4C4]"
                  : "bg-[#F8F2EC] text-[#5C4A4D] border-[#DECFC0]"
              }`}
            >
              Watermark: {isWatermarkActive ? "ON (DRAFT)" : "OFF (FINAL)"}
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center space-x-1 p-1 bg-[#F8F2EC] border border-[#DECFC0] rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("parking")}
              className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${
                activeTab === "parking" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
              }`}
            >
              Parking Deed
            </button>
            <button
              onClick={() => setActiveTab("noc")}
              className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${
                activeTab === "noc" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
              }`}
            >
              Bank NOC
            </button>
            <button
              onClick={() => setActiveTab("cost")}
              className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${
                activeTab === "cost" ? "bg-[#4A0E17] text-white shadow-xs font-bold" : "text-[#5C4A4D] hover:text-[#24060B]"
              }`}
            >
              Cost Sheet
            </button>
          </div>

          {/* Live A4 Serif Document Card */}
          <div className="relative p-5 rounded-xl bg-[#FFFDFB] border border-[#DECFC0] shadow-inner font-serif text-[11px] leading-relaxed text-[#24060B] select-none overflow-hidden min-h-[320px]">
            {isWatermarkActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="text-3xl sm:text-4xl font-sans font-black text-[#7D1826]/10 uppercase rotate-[-30deg] tracking-widest">
                  DRAFT — FOR VERIFICATION
                </span>
              </div>
            )}

            {/* Letterhead */}
            <div className="text-center border-b border-[#DECFC0] pb-2 mb-3">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#24060B]">
                {MOCK_PROJECT.legalName}
              </h4>
              <p className="font-mono text-[9px] text-[#8C777A]">
                Project: {MOCK_PROJECT.name} • RERA: {MOCK_PROJECT.reraNumber}
              </p>
            </div>

            {activeTab === "parking" && (
              <div className="space-y-2">
                <div className="text-center font-bold font-sans text-xs underline text-[#7D1826]">
                  CAR PARKING ALLOTMENT LETTER
                </div>
                <p>
                  To, <br />
                  <strong>{buyer.fullName}</strong> ({allotteeNoun}) <br />
                  <span className="font-mono text-[10px] text-[#5C4A4D]">PAN: {buyer.panNumber} • UIDAI: {buyer.aadhaarNumberMasked}</span>
                </p>
                <p>
                  We hereby confirm that for Apartment <strong>{selectedUnit.flatNumber}</strong> ({selectedUnit.tower}),
                  having a Super Built-Up Area of {selectedUnit.superBuiltUpAreaSqFt} sq.ft, we have allotted dedicated{" "}
                  <strong>Bay No. {selectedSlot.slotNumber}</strong> in {selectedSlot.level}.
                </p>
                <p>
                  Agreed consideration: <strong>{formatIndianCurrency(parkingFee)}</strong>.
                </p>
              </div>
            )}

            {activeTab === "noc" && (
              <div className="space-y-2">
                <div className="text-center font-bold font-sans text-xs underline text-[#7D1826]">
                  BUILDER HOME LOAN NOC &amp; TRIPARTITE PERMISSION
                </div>
                <p>
                  To: The Branch Manager, {bankName}, {bankBranch}.
                </p>
                <p>
                  We confirm permission to create a mortgage in favor of {bankName} for Flat <strong>{selectedUnit.flatNumber}</strong> in the name of <strong>{buyer.fullName}</strong>.
                </p>
              </div>
            )}

            {activeTab === "cost" && (
              <div className="space-y-2">
                <div className="text-center font-bold font-sans text-xs underline text-[#7D1826]">
                  STATUTORY UNIT COST BREAKDOWN
                </div>
                <p>
                  Apartment Consideration: {formatIndianCurrency(selectedUnit.basePrice)} <br />
                  Car Parking Space: {formatIndianCurrency(parkingFee)} <br />
                  <strong>Total Value: {formatIndianCurrency(totalConsideration)}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons: 1-Click Bank Kit ZIP & WhatsApp */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleGenerateBankKit}
              disabled={isGeneratingZip}
              className="w-full py-2.5 px-4 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileArchive className="w-4 h-4 text-[#D4B989]" />
              <span>{isGeneratingZip ? "Compiling 3 Documents into .ZIP..." : "1-Click Bank Kit Bundle (.ZIP)"}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2 px-4 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-emerald-700" />
              <span>Share Watermarked Draft on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificationStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#8C777A] font-mono">Loading Verification Studio...</div>}>
      <VerificationStudioContent />
    </Suspense>
  );
}
