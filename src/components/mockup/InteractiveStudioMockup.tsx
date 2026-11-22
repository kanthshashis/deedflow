"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building,
  Share2,
  Download,
  ChevronRight,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";

interface ProjectPreset {
  id: string;
  projectName: string;
  developerName: string;
  reraNumber: string;
  location: string;
  buyerName: string;
  panNumber: string;
  aadhaarMasked: string;
  flatNumber: string;
  tower: string;
  unitType: string;
  sbaSqFt: number;
  udsSqFt: number;
  carpetSqFt: number;
  basePrice: number;
  bayNumber: string;
  bayLevel: string;
  bayType: string;
  parkingFee: number;
  entityType: "sole" | "joint" | "nri_gpa";
}

const PRESETS: ProjectPreset[] = [
  {
    id: "sobha",
    projectName: "Sobha Royal Pavilion",
    developerName: "Sobha Limited",
    reraNumber: "PRM/KA/RERA/1251/308/PR/190330/002518",
    location: "Sarjapur Road, Hadosiddapura, Bengaluru",
    buyerName: "Kantharaju Mariyappa",
    panNumber: "ABCDE1234F",
    aadhaarMasked: "XXXX-XXXX-9481",
    flatNumber: "B-402",
    tower: "Tower B (Duke Wing)",
    unitType: "3 BHK Royal",
    sbaSqFt: 1850,
    udsSqFt: 462,
    carpetSqFt: 1380,
    basePrice: 18500000,
    bayNumber: "B1-042",
    bayLevel: "Basement 1 (Upper)",
    bayType: "Covered Stilt",
    parkingFee: 450000,
    entityType: "sole",
  },
  {
    id: "prestige",
    projectName: "Prestige Falcon City",
    developerName: "Prestige Estates Projects Ltd",
    reraNumber: "PRM/KA/RERA/1251/310/PR/170915/000284",
    location: "Kanakapura Road, Anjanadri Layout, Bengaluru",
    buyerName: "Rajesh Kumar & Priya Sharma",
    panNumber: "FGHIJ5678K",
    aadhaarMasked: "XXXX-XXXX-3829",
    flatNumber: "C-1204",
    tower: "Tower C (Falcon Crest)",
    unitType: "3.5 BHK Luxury",
    sbaSqFt: 2140,
    udsSqFt: 535,
    carpetSqFt: 1610,
    basePrice: 22800000,
    bayNumber: "B2-118",
    bayLevel: "Basement 2 (Lower)",
    bayType: "Tandem Mechanical",
    parkingFee: 650000,
    entityType: "joint",
  },
  {
    id: "brigade",
    projectName: "Brigade Cornerstone Utopia",
    developerName: "Brigade Enterprises Limited",
    reraNumber: "PRM/KA/RERA/1251/308/PR/181122/002176",
    location: "Varthur Road, Whitefield, Bengaluru",
    buyerName: "Vikramaditya Rao (Rep by GPA Holder)",
    panNumber: "KLMNO9012P",
    aadhaarMasked: "XXXX-XXXX-7140",
    flatNumber: "H-801",
    tower: "Halcyon Block",
    unitType: "4 BHK Penthouse",
    sbaSqFt: 2980,
    udsSqFt: 745,
    carpetSqFt: 2280,
    basePrice: 34500000,
    bayNumber: "B1-005",
    bayLevel: "Basement 1 (Upper)",
    bayType: "Basement Covered",
    parkingFee: 500000,
    entityType: "nri_gpa",
  },
];

interface InteractiveStudioMockupProps {
  theme?: string;
}

export function InteractiveStudioMockup({}: InteractiveStudioMockupProps) {
  const [activePreset, setActivePreset] = useState<ProjectPreset>(PRESETS[0]);
  const [activeTab, setActiveTab] = useState<"parking" | "noc" | "cost">("parking");
  const [showShareModal, setShowShareModal] = useState(false);

  const totalConsideration = activePreset.basePrice + activePreset.parkingFee;

  const handlePresetChange = (preset: ProjectPreset) => {
    setActivePreset(preset);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 font-sans">
      {/* Top Project Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl border border-[#DECFC0] bg-[#FFFDFB] shadow-2xs spring-snap">
        <div className="flex items-center space-x-2 text-xs font-semibold px-2">
          <Building className="w-4 h-4 text-[#821A2A]" />
          <span className="text-[#24060B] font-bold">
            Active Builder Project:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.map((p) => {
            const isSelected = activePreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-medium spring-snap flex items-center space-x-1.5 transition-all cursor-pointer",
                  isSelected
                    ? "bg-[#821A2A] text-white font-bold shadow-xs border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                )}
              >
                <span>{p.projectName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Split Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 5 COLS: Data Intake */}
        <div className="lg:col-span-5 rounded-2xl border p-6 space-y-5 spring-snap glossy-card border-[#DECFC0]">
          <div className="border-b border-[#E8DFD3] pb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold flex items-center space-x-1 text-[#821A2A]">
                <Zap className="w-3 h-3 text-[#B88E3E]" />
                <span>Deterministic Legal Intake</span>
              </div>
              <h3 className="text-base font-bold mt-0.5 text-[#24060B]">
                {activePreset.developerName}
              </h3>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border border-[#DFD1B8] bg-[#F7F1E6] text-[#8C6D2D] flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>UIDAI Masked</span>
            </span>
          </div>

          {/* Buyer Information Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#5C4A4D]">
                Allottee Profile
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#DFD1B8] bg-[#F7F1E6] text-[#8C6D2D] font-semibold">
                {activePreset.entityType === "sole" && "Sole Buyer"}
                {activePreset.entityType === "joint" && "Joint Co-Buyers"}
                {activePreset.entityType === "nri_gpa" && "NRI via GPA"}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#DECFC0] bg-white/80 space-y-2.5 text-xs shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5C4A4D]">Allottee Name:</span>
                <span className="font-semibold text-[#24060B]">{activePreset.buyerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C4A4D]">PAN Number:</span>
                <span className="font-mono font-semibold text-[#24060B]">{activePreset.panNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C4A4D]">UIDAI Reference:</span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B]">
                  {activePreset.aadhaarMasked} (Masked)
                </span>
              </div>
            </div>
          </div>

          {/* Unit & Parking Association */}
          <div className="space-y-3">
            <span className="font-bold uppercase tracking-wider text-[11px] block text-[#5C4A4D]">
              Inventory &amp; Bay Association
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl border border-[#DECFC0] bg-white/80 space-y-1 shadow-2xs">
                <span className="text-[10px] uppercase font-mono block text-[#8C777A]">Assigned Unit:</span>
                <div className="font-bold text-sm text-[#24060B]">Flat {activePreset.flatNumber}</div>
                <div className="text-[10px] font-mono text-[#5C4A4D]">
                  {activePreset.tower} • {activePreset.sbaSqFt} sq.ft
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#DECFC0] bg-[#FBF2F3] space-y-1 shadow-2xs">
                <span className="text-[10px] font-semibold uppercase font-mono block text-[#821A2A]">Dedicated Bay:</span>
                <div className="font-bold text-sm text-[#821A2A]">{activePreset.bayNumber}</div>
                <div className="text-[10px] font-mono text-[#821A2A]">
                  {activePreset.bayLevel} • {activePreset.bayType}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#DECFC0] bg-white/80 text-xs flex items-center justify-between shadow-2xs">
              <span className="text-[#5C4A4D]">Total Agreed Value:</span>
              <span className="font-mono font-bold text-sm text-[#24060B]">
                {formatIndianCurrency(totalConsideration)}
              </span>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full py-2.5 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center space-x-2 spring-snap cursor-pointer glossy-btn-burgundy text-[#FAF7F2]"
          >
            <Share2 className="w-4 h-4 text-[#E5C178]" />
            <span>Simulate WhatsApp Review Dispatch</span>
          </button>
        </div>

        {/* RIGHT 7 COLS: The Legal Deed Sheet Preview */}
        <div className="lg:col-span-7 rounded-2xl border p-6 sm:p-8 space-y-5 spring-snap glossy-card border-[#DECFC0]">
          {/* Document Tab Switcher */}
          <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-4">
            <div className="flex items-center space-x-1.5 p-1 rounded-xl text-xs font-semibold border border-[#DECFC0] bg-[#FFFDFB] shadow-2xs">
              <button
                onClick={() => setActiveTab("parking")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeTab === "parking"
                    ? "bg-[#821A2A] text-white shadow-xs font-bold border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                )}
              >
                1. Parking Deed
              </button>
              <button
                onClick={() => setActiveTab("noc")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeTab === "noc"
                    ? "bg-[#821A2A] text-white shadow-xs font-bold border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                )}
              >
                2. Builder Bank NOC
              </button>
              <button
                onClick={() => setActiveTab("cost")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeTab === "cost"
                    ? "bg-[#821A2A] text-white shadow-xs font-bold border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                )}
              >
                3. Cost Schedule
              </button>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#DFD1B8] bg-[#F7F1E6] text-[#8C6D2D] font-semibold hidden sm:inline">
              ✓ 100% Word Preserved
            </span>
          </div>

          {/* Legal Document Sheet */}
          <div className="relative rounded-xl border border-[#E8DFD3] bg-[#FFFDFB] text-[#24060B] p-6 sm:p-7 select-none overflow-hidden text-xs leading-relaxed spring-snap shadow-xs">
            {/* Developer Letterhead */}
            <div className="text-center border-b border-[#E8DFD3] pb-4 mb-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-[#24060B]">
                {activePreset.developerName}
              </h4>
              <p className="font-mono text-[10px] mt-0.5 text-[#5C4A4D]">
                RERA Reg No: {activePreset.reraNumber} • Project: {activePreset.projectName}
              </p>
              <p className="font-mono text-[9px] text-[#8C777A]">
                Registered Site Office: {activePreset.location}
              </p>
            </div>

            {/* Document Content Based on Active Tab */}
            {activeTab === "parking" && (
              <div className="space-y-3 font-sans">
                <div className="text-center font-bold text-xs underline text-[#24060B]">
                  ALLOTMENT LETTER FOR EXCLUSIVE CAR PARKING SPACE
                </div>

                <div className="font-mono text-[10px] flex justify-between text-[#8C777A]">
                  <span>Ref: DF/PARK/{activePreset.flatNumber}/2026</span>
                  <span>Date: 22-Nov-2026</span>
                </div>

                <p className="text-[11px] leading-relaxed">
                  To, <br />
                  <strong className="text-[#24060B]">{activePreset.buyerName}</strong> <br />
                  <span className="font-mono text-[10px] text-[#5C4A4D]">
                    PAN: {activePreset.panNumber} • UIDAI Ref: {activePreset.aadhaarMasked}
                  </span>
                </p>

                <p className="text-[11px] leading-relaxed">
                  <strong>Subject:</strong> Allotment of Dedicated Car Parking Bay No.{" "}
                  <strong className="font-mono px-1.5 py-0.5 rounded border border-[#DFD1B8] bg-[#F7F1E6] text-[#821A2A]">
                    {activePreset.bayNumber}
                  </strong>{" "}
                  in {activePreset.bayLevel} at &apos;{activePreset.projectName}&apos;.
                </p>

                <p className="text-[11px] leading-relaxed">
                  We confirm that for Apartment/Flat No. <strong>{activePreset.flatNumber}</strong> ({activePreset.tower}),
                  having a Super Built-Up Area of {activePreset.sbaSqFt} sq.ft and Undivided Share (UDS) of {activePreset.udsSqFt} sq.ft,
                  we have allotted the exclusive, perpetual right to use dedicated{" "}
                  <strong>{activePreset.bayType} Bay No. {activePreset.bayNumber}</strong> in {activePreset.bayLevel}.
                </p>

                <p className="text-[11px] leading-relaxed">
                  Agreed consideration of <strong>{formatIndianCurrency(activePreset.parkingFee)}</strong> has been duly accounted for in your master schedule.
                </p>

                <div className="pt-4 flex justify-between items-end text-[10px] border-t border-[#E8DFD3] text-[#5C4A4D]">
                  <div>
                    <span className="block font-semibold text-[#24060B]">For {activePreset.developerName}</span>
                    <span className="block text-[9px] mt-1 text-[#8C777A]">Authorized Legal Signatory</span>
                  </div>
                  <div className="text-right font-mono text-[9px] font-semibold text-[#821A2A]">
                    SHA-256: 7F28...D491 (QR Verified)
                  </div>
                </div>
              </div>
            )}

            {activeTab === "noc" && (
              <div className="space-y-3 font-sans">
                <div className="text-center font-bold text-xs underline text-[#24060B]">
                  NO OBJECTION CERTIFICATE / PERMISSION TO MORTGAGE
                </div>

                <p className="text-[11px] leading-relaxed">
                  To: The Branch Manager, State Bank of India / HDFC Bank Limited.
                </p>

                <p className="text-[11px] leading-relaxed">
                  <strong>Sub:</strong> NOC for Home Loan sanction &amp; mortgage in favor of{" "}
                  <strong>{activePreset.buyerName}</strong> for Flat No. {activePreset.flatNumber}, {activePreset.projectName}.
                </p>

                <p className="text-[11px] leading-relaxed">
                  1. We confirm allotment of Flat {activePreset.flatNumber} with dedicated Bay {activePreset.bayNumber} for total consideration of{" "}
                  <strong>{formatIndianCurrency(totalConsideration)}</strong>.
                </p>

                <p className="text-[11px] leading-relaxed">
                  2. We confirm NO OBJECTION to the allottee mortgaging their title and interest in favor of the bank.
                </p>

                <p className="text-[11px] leading-relaxed">
                  3. All disbursement funds must be remitted directly to RERA Master Account No. 918020034827101 (IFSC: SBIN0004120).
                </p>

                <div className="pt-4 flex justify-between items-end text-[10px] border-t border-[#E8DFD3] text-[#5C4A4D]">
                  <div>
                    <span className="block font-semibold text-[#24060B]">For {activePreset.developerName}</span>
                    <span className="block text-[9px] mt-1 text-[#8C777A]">Authorized Signatory</span>
                  </div>
                  <div className="text-right font-mono text-[9px] text-[#821A2A] font-semibold">
                    Bank Empanelled Schedule
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cost" && (
              <div className="space-y-3 font-sans">
                <div className="text-center font-bold text-xs underline text-[#24060B]">
                  OFFICIAL UNIT COST SHEET &amp; RERA MILESTONE SCHEDULE
                </div>

                <div className="p-3 rounded-xl font-mono text-[10px] grid grid-cols-2 gap-2 border border-[#DECFC0] bg-[#FAF7F2]">
                  <div><span className="text-[#8C777A]">Buyer:</span> <strong>{activePreset.buyerName}</strong></div>
                  <div><span className="text-[#8C777A]">Unit:</span> <strong>Flat {activePreset.flatNumber}</strong></div>
                  <div><span className="text-[#8C777A]">Carpet Area:</span> {activePreset.carpetSqFt} sq.ft</div>
                  <div><span className="text-[#8C777A]">Super Built-Up:</span> {activePreset.sbaSqFt} sq.ft</div>
                </div>

                <div className="text-[11px] space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-[#E8DFD3]">
                    <span>1. Basic Consideration:</span>
                    <span className="font-mono font-semibold text-[#24060B]">{formatIndianCurrency(activePreset.basePrice)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E8DFD3]">
                    <span>2. Dedicated Car Parking Bay ({activePreset.bayNumber}):</span>
                    <span className="font-mono font-semibold text-[#24060B]">{formatIndianCurrency(activePreset.parkingFee)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DECFC0] font-bold">
                    <span>Total Agreed Consideration:</span>
                    <span className="font-mono text-[#821A2A]">{formatIndianCurrency(totalConsideration)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Tray */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs font-mono text-[#5C4A4D]">
              Synthesized in <strong className="text-[#821A2A]">1.2 seconds</strong> • 0 typos
            </span>

            <div className="flex items-center space-x-2">
              <a
                href="/dashboard/draft/new"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold spring-snap flex items-center space-x-1.5 border border-[#DECFC0] bg-[#FFFDFB] hover:bg-[#F8F2EC] text-[#24060B] transition-colors"
              >
                <span>Open in Studio</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#821A2A]" />
              </a>

              <a
                href="/templates/car-parking-allotment.docx"
                download
                className="px-4 py-2 rounded-xl text-xs font-semibold spring-snap flex items-center space-x-1.5 glossy-btn-burgundy text-[#FAF7F2]"
              >
                <Download className="w-3.5 h-3.5 text-[#E5C178]" />
                <span>Download Sample .DOCX</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated WhatsApp Review Popup */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-[#FFFDFB] rounded-2xl p-6 shadow-2xl border border-[#DECFC0] space-y-4 text-[#24060B]">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-xs uppercase tracking-wider text-[#821A2A]">WhatsApp Secure Watermark</span>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-xs text-[#8C777A] hover:text-[#24060B] font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] text-xs space-y-2">
              <p className="font-semibold text-[#24060B]">Recipient: {activePreset.buyerName}</p>
              <p className="text-[11px] text-[#5C4A4D] leading-relaxed">
                &ldquo;Dear Mr. Kantharaju, your Draft Car Parking Allotment Letter for Flat {activePreset.flatNumber} at {activePreset.projectName} has been generated. Please review watermarked draft before final registration stamp.&rdquo;
              </p>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-800 font-mono">
                Watermark: &ldquo;DRAFT — FOR VERIFICATION ONLY — NOT FOR REGISTRATION&rdquo;
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-xl font-semibold text-xs spring-snap cursor-pointer glossy-btn-burgundy text-[#FAF7F2]"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
