"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building,
  Car,
  Share2,
  Download,
  Sparkles,
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
    aadhaarMasked: "XXXXXXXX4826",
    flatNumber: "B-302",
    tower: "Tower B",
    unitType: "3BHK Luxury",
    sbaSqFt: 1620,
    udsSqFt: 485.5,
    carpetSqFt: 1150,
    basePrice: 14742000,
    bayNumber: "B1-04",
    bayLevel: "Basement 1",
    bayType: "Standard Covered",
    parkingFee: 350000,
    entityType: "sole",
  },
  {
    id: "prestige",
    projectName: "Prestige Falcon City",
    developerName: "Prestige Estates Projects Ltd",
    reraNumber: "PRM/KA/RERA/1251/310/PR/170915/000284",
    location: "Kanakapura Road, Anjanadri Layout, Bengaluru",
    buyerName: "Ananya Rao & Vikram Rao",
    panNumber: "BKXPR9812K",
    aadhaarMasked: "XXXXXXXX9921",
    flatNumber: "A-504",
    tower: "Tower 4",
    unitType: "3BHK + 3T",
    sbaSqFt: 1850,
    udsSqFt: 555,
    carpetSqFt: 1320,
    basePrice: 16835000,
    bayNumber: "B1-12",
    bayLevel: "Basement 1",
    bayType: "EV Wide Bay",
    parkingFee: 400000,
    entityType: "joint",
  },
  {
    id: "assetz",
    projectName: "Assetz Marq 3.0",
    developerName: "Assetz Property Group",
    reraNumber: "PRM/KA/RERA/1251/446/PR/190823/002821",
    location: "Whitefield - Hoskote Road, Bengaluru",
    buyerName: "Rohit Menon (Rep. by GPA Suresh M)",
    panNumber: "CDEFA5678M",
    aadhaarMasked: "XXXXXXXX1189",
    flatNumber: "C-1202",
    tower: "Tower C",
    unitType: "4BHK Sky Villa",
    sbaSqFt: 2280,
    udsSqFt: 684,
    carpetSqFt: 1680,
    basePrice: 21500000,
    bayNumber: "B2-08",
    bayLevel: "Basement 2",
    bayType: "Tandem Double",
    parkingFee: 500000,
    entityType: "nri_gpa",
  },
];

interface InteractiveStudioMockupProps {
  theme?: "stripe" | "linear" | "luxury";
}

export function InteractiveStudioMockup({ theme = "stripe" }: InteractiveStudioMockupProps) {
  const [activePreset, setActivePreset] = useState<ProjectPreset>(PRESETS[0]);
  const [activeTab, setActiveTab] = useState<"parking" | "noc" | "cost">("parking");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const totalConsideration = activePreset.basePrice + activePreset.parkingFee;

  const isLight = theme === "stripe";
  const isLuxury = theme === "luxury";
  const isDark = theme === "linear";

  const handlePresetChange = (preset: ProjectPreset) => {
    setIsGenerating(true);
    setActivePreset(preset);
    setTimeout(() => setIsGenerating(false), 150);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Top Project Selector Tabs */}
      <div
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl border spring-snap",
          isLight && "bg-[#FFFDFB] border-[#E8E1D5] shadow-[0_1px_3px_rgba(28,25,23,0.03)]",
          isDark && "bg-surface border-border shadow-card",
          isLuxury && "bg-white border-stone-300 shadow-sm"
        )}
      >
        <div className="flex items-center space-x-2 text-xs font-semibold px-2">
          <Building className={clsx("w-4 h-4", isLight ? "text-[#9E7A36]" : isDark ? "text-indigo-400" : "text-amber-800")} />
          <span className={clsx(isLight ? "text-slate-700 font-bold" : isDark ? "text-ink-secondary" : "text-stone-600")}>
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
                    ? isLight
                      ? "bg-[#4A0E17] text-[#FAF7F2] font-bold shadow-md shadow-[#4A0E17]/20 border border-[#6B1B26]"
                      : isDark
                      ? "bg-brand text-white shadow-glow font-semibold"
                      : "bg-stone-900 text-white font-bold shadow-sm"
                    : isLight
                    ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#FBF2F3]"
                    : isDark
                    ? "text-ink-secondary hover:text-ink hover:bg-surface-muted"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
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
        <div
          className={clsx(
            "lg:col-span-5 rounded-2xl border p-6 space-y-5 spring-snap",
            isLight && "glossy-card border-[#E8DFD3]",
            isDark && "bg-surface border-border shadow-card",
            isLuxury && "bg-white border-stone-300 shadow-sm"
          )}
        >
          <div className={clsx("border-b pb-4 flex items-center justify-between", isLight ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-200")}>
            <div>
              <div className={clsx("text-[10px] font-mono uppercase tracking-wider font-bold flex items-center space-x-1", isLight ? "text-[#7D1826]" : isDark ? "text-indigo-400" : "text-amber-800")}>
                <Zap className="w-3 h-3 text-[#B88E3E]" />
                <span>Deterministic Legal Intake</span>
              </div>
              <h3 className={clsx("text-base font-bold mt-0.5", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>
                {activePreset.developerName}
              </h3>
            </div>
            <span className={clsx(
              "text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border flex items-center space-x-1",
              isLight ? "bg-[#F7F1E6] text-[#8C6D2D] border-[#DFD1B8]" : isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-800 border-emerald-200"
            )}>
              <ShieldCheck className={clsx("w-3.5 h-3.5", isLight ? "text-[#B88E3E]" : "text-emerald-600")} />
              <span>UIDAI Masked</span>
            </span>
          </div>

          {/* Buyer Information Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className={clsx("font-bold uppercase tracking-wider text-[11px]", isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-muted" : "text-stone-500")}>
                Allottee Profile
              </span>
              <span className={clsx(
                "text-[10px] font-mono px-2 py-0.5 rounded border",
                isLight ? "bg-[#F7F1E6] text-[#8C6D2D] border-[#DFD1B8]" : isDark ? "bg-brand/10 text-indigo-300 border-brand/20" : "bg-stone-100 text-stone-700 border-stone-200"
              )}>
                {activePreset.entityType === "sole" && "Sole Buyer"}
                {activePreset.entityType === "joint" && "Joint Co-Buyers"}
                {activePreset.entityType === "nri_gpa" && "NRI via GPA"}
              </span>
            </div>

            <div className={clsx(
              "p-4 rounded-xl border space-y-2.5 text-xs",
              isLight ? "bg-white/80 border-[#DECFC0]" : isDark ? "bg-surface-muted border-border" : "bg-stone-50 border-stone-200"
            )}>
              <div className="flex items-center justify-between">
                <span className={clsx(isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-secondary" : "text-stone-500")}>Allottee Name:</span>
                <span className={clsx("font-semibold", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>{activePreset.buyerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={clsx(isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-secondary" : "text-stone-500")}>PAN Number:</span>
                <span className={clsx("font-mono font-semibold", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>{activePreset.panNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={clsx(isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-secondary" : "text-stone-500")}>UIDAI Reference:</span>
                <span className={clsx(
                  "font-mono font-semibold px-2 py-0.5 rounded border",
                  isLight ? "bg-[#FAF7F2] text-[#24060B] border-[#DECFC0]" : isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                )}>
                  {activePreset.aadhaarMasked} (Masked)
                </span>
              </div>
            </div>
          </div>

          {/* Unit & Parking Association */}
          <div className="space-y-3">
            <span className={clsx("font-bold uppercase tracking-wider text-[11px] block", isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-muted" : "text-stone-500")}>
              Inventory &amp; Bay Association
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className={clsx(
                "p-3 rounded-xl border space-y-1",
                isLight ? "bg-white/80 border-[#DECFC0]" : isDark ? "bg-surface-muted border-border" : "bg-stone-50 border-stone-200"
              )}>
                <span className={clsx("text-[10px] uppercase font-mono block", isLight ? "text-[#8C777A]" : isDark ? "text-ink-muted" : "text-stone-400")}>Assigned Unit:</span>
                <div className={clsx("font-bold text-sm", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>Flat {activePreset.flatNumber}</div>
                <div className={clsx("text-[10px] font-mono", isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-secondary" : "text-stone-500")}>
                  {activePreset.tower} • {activePreset.sbaSqFt} sq.ft
                </div>
              </div>

              <div className={clsx(
                "p-3 rounded-xl border space-y-1",
                isLight ? "bg-[#FBF2F3] border-[#E8C8CC]" : isDark ? "bg-brand/10 border-brand/30" : "bg-amber-50 border-amber-200"
              )}>
                <span className={clsx("text-[10px] font-semibold uppercase font-mono block", isLight ? "text-[#7D1826]" : isDark ? "text-indigo-300" : "text-amber-800")}>Dedicated Bay:</span>
                <div className={clsx("font-bold text-sm", isLight ? "text-[#4A0E17]" : isDark ? "text-indigo-200" : "text-amber-900")}>{activePreset.bayNumber}</div>
                <div className={clsx("text-[10px] font-mono", isLight ? "text-[#7D1826]" : isDark ? "text-indigo-300" : "text-amber-700")}>
                  {activePreset.bayLevel} • {activePreset.bayType}
                </div>
              </div>
            </div>

            <div className={clsx(
              "p-3 rounded-xl border text-xs flex items-center justify-between",
              isLight ? "bg-white/80 border-[#DECFC0]" : isDark ? "bg-surface-muted border-border" : "bg-stone-50 border-stone-200"
            )}>
              <span className={clsx(isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-secondary" : "text-stone-600")}>Total Agreed Value:</span>
              <span className={clsx("font-mono font-bold text-sm", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>
                {formatIndianCurrency(totalConsideration)}
              </span>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => setShowShareModal(true)}
            className={clsx(
              "w-full py-2.5 px-4 rounded-xl border font-medium text-xs flex items-center justify-center space-x-2 spring-snap cursor-pointer",
              isLight ? "glossy-btn-burgundy text-[#FAF7F2]" : isDark ? "bg-surface-elevated hover:bg-surface-hover text-ink border-border" : "bg-stone-900 text-white border-transparent"
            )}
          >
            <Share2 className={clsx("w-4 h-4", isLight ? "text-[#E5C178]" : "text-emerald-400")} />
            <span>Simulate WhatsApp Review Dispatch</span>
          </button>
        </div>

        {/* RIGHT 7 COLS: The Legal Deed Sheet Preview */}
        <div
          className={clsx(
            "lg:col-span-7 rounded-2xl border p-6 sm:p-8 space-y-5 spring-snap",
            isLight && "glossy-card border-[#DECFC0]",
            isDark && "bg-surface border-border shadow-card",
            isLuxury && "bg-white border-stone-300 shadow-sm"
          )}
        >
          {/* Document Tab Switcher */}
          <div className={clsx("flex items-center justify-between border-b pb-4", isLight ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-200")}>
            <div className={clsx(
              "flex items-center space-x-1.5 p-1 rounded-xl text-xs font-semibold border",
              isLight ? "bg-[#F8F2EC] border-[#DECFC0]" : isDark ? "bg-surface-muted border-border" : "bg-stone-100 border-stone-200"
            )}>
              <button
                onClick={() => setActiveTab("parking")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeTab === "parking"
                    ? isLight ? "bg-[#4A0E17] text-[#FAF7F2] shadow-sm font-bold border border-[#6B1B26]" : isDark ? "bg-brand text-white shadow-glow" : "bg-white text-stone-900 shadow-sm font-bold"
                    : isLight ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#FBF2F3]" : isDark ? "text-ink-secondary hover:text-ink" : "text-stone-600 hover:text-stone-900"
                )}
              >
                1. Parking Deed
              </button>
              <button
                onClick={() => setActiveTab("noc")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeTab === "noc"
                    ? isLight ? "bg-[#4A0E17] text-[#FAF7F2] shadow-sm font-bold border border-[#6B1B26]" : isDark ? "bg-brand text-white shadow-glow" : "bg-white text-stone-900 shadow-sm font-bold"
                    : isLight ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#FBF2F3]" : isDark ? "text-ink-secondary hover:text-ink" : "text-stone-600 hover:text-stone-900"
                )}
              >
                2. Builder Bank NOC
              </button>
              <button
                onClick={() => setActiveTab("cost")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeTab === "cost"
                    ? isLight ? "bg-[#4A0E17] text-[#FAF7F2] shadow-sm font-bold border border-[#6B1B26]" : isDark ? "bg-brand text-white shadow-glow" : "bg-white text-stone-900 shadow-sm font-bold"
                    : isLight ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#FBF2F3]" : isDark ? "text-ink-secondary hover:text-ink" : "text-stone-600 hover:text-stone-900"
                )}
              >
                3. Cost Schedule
              </button>
            </div>

            <span className={clsx(
              "text-[10px] font-mono px-2.5 py-1 rounded-full border hidden sm:inline",
              isLight ? "bg-[#F7F1E6] text-[#8C6D2D] border-[#DFD1B8] font-semibold" : isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-stone-100 text-stone-700 border-stone-200"
            )}>
              ✓ 100% Word Preserved
            </span>
          </div>

          {/* Legal Document Sheet */}
          <div
            className={clsx(
              "relative rounded-xl border p-6 sm:p-7 select-none overflow-hidden text-xs leading-relaxed spring-snap",
              isLight && "bg-[#FFFDFB] border-[#E8DFD3] text-[#24060B] shadow-xs",
              isDark && "bg-[#090B0D] border-border text-ink",
              isLuxury && "bg-[#FAF9F5] border-stone-300 text-stone-800 font-serif"
            )}
          >
            {/* Developer Letterhead */}
            <div className={clsx("text-center border-b pb-4 mb-4", isLight ? "border-[#E8E1D5]" : isDark ? "border-white/10" : "border-stone-300")}>
              <h4 className={clsx("font-bold text-sm uppercase tracking-wider", isLight ? "text-[#1C1917]" : isDark ? "text-ink" : "text-stone-900")}>
                {activePreset.developerName}
              </h4>
              <p className={clsx("font-mono text-[10px] mt-0.5", isLight ? "text-[#78716A]" : isDark ? "text-ink-muted" : "text-stone-500")}>
                RERA Reg No: {activePreset.reraNumber} • Project: {activePreset.projectName}
              </p>
              <p className={clsx("font-mono text-[9px]", isLight ? "text-[#A89F94]" : isDark ? "text-ink-muted" : "text-stone-400")}>
                Registered Site Office: {activePreset.location}
              </p>
            </div>

            {/* Document Content Based on Active Tab */}
            {activeTab === "parking" && (
              <div className="space-y-3 font-sans">
                <div className={clsx("text-center font-bold text-xs underline", isLight ? "text-[#1C1917]" : isDark ? "text-ink" : "text-stone-900")}>
                  ALLOTMENT LETTER FOR EXCLUSIVE CAR PARKING SPACE
                </div>

                <div className={clsx("font-mono text-[10px] flex justify-between", isLight ? "text-[#78716A]" : isDark ? "text-ink-muted" : "text-stone-500")}>
                  <span>Ref: DF/PARK/{activePreset.flatNumber}/2026</span>
                  <span>Date: 22-Nov-2026</span>
                </div>

                <p className="text-[11px] leading-relaxed">
                  To, <br />
                  <strong className={isLight ? "text-[#1C1917]" : isDark ? "text-ink" : "text-stone-900"}>{activePreset.buyerName}</strong> <br />
                  <span className="font-mono text-[10px] opacity-75">
                    PAN: {activePreset.panNumber} • UIDAI Ref: {activePreset.aadhaarMasked}
                  </span>
                </p>

                <p className="text-[11px] leading-relaxed">
                  <strong>Subject:</strong> Allotment of Dedicated Car Parking Bay No.{" "}
                  <strong className={clsx(
                    "font-mono px-1 py-0.5 rounded border",
                    isLight ? "bg-[#F5EFE6] text-[#7A5B22] border-[#DFD3C1]" : isDark ? "bg-brand/20 text-indigo-300 border-brand/30" : "bg-amber-50 text-amber-800 border-amber-200"
                  )}>
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

                <div className={clsx("pt-4 flex justify-between items-end text-[10px] border-t", isLight ? "border-slate-200 text-slate-500" : isDark ? "border-white/10 text-ink-muted" : "border-stone-300 text-stone-500")}>
                  <div>
                    <span className={clsx("block font-semibold", isLight ? "text-slate-900" : isDark ? "text-ink" : "text-stone-900")}>For {activePreset.developerName}</span>
                    <span className="block text-[9px] mt-1">Authorized Legal Signatory</span>
                  </div>
                  <div className={clsx("text-right font-mono text-[9px] font-semibold", isLight ? "text-[#7D1826]" : "text-emerald-400")}>
                    SHA-256: 7F28...D491 (QR Verified)
                  </div>
                </div>
              </div>
            )}

            {activeTab === "noc" && (
              <div className="space-y-3 font-sans">
                <div className={clsx("text-center font-bold text-xs underline", isLight ? "text-slate-900" : isDark ? "text-ink" : "text-stone-900")}>
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

                <div className={clsx("pt-4 flex justify-between items-end text-[10px] border-t", isLight ? "border-slate-200 text-slate-500" : isDark ? "border-white/10 text-ink-muted" : "border-stone-300 text-stone-500")}>
                  <div>
                    <span className={clsx("block font-semibold", isLight ? "text-slate-900" : isDark ? "text-ink" : "text-stone-900")}>For {activePreset.developerName}</span>
                    <span className="block text-[9px] mt-1">Authorized Signatory</span>
                  </div>
                  <div className="text-right font-mono text-[9px] text-indigo-600 font-semibold">
                    Bank Empanelled Schedule
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cost" && (
              <div className="space-y-3 font-sans">
                <div className={clsx("text-center font-bold text-xs underline", isLight ? "text-slate-900" : isDark ? "text-ink" : "text-stone-900")}>
                  OFFICIAL UNIT COST SHEET &amp; RERA MILESTONE SCHEDULE
                </div>

                <div className={clsx(
                  "p-3 rounded-xl font-mono text-[10px] grid grid-cols-2 gap-2 border",
                  isLight ? "bg-slate-50 border-slate-200" : isDark ? "bg-surface-muted border-border" : "bg-stone-50 border-stone-200"
                )}>
                  <div><span className="opacity-75">Buyer:</span> <strong>{activePreset.buyerName}</strong></div>
                  <div><span className="opacity-75">Unit:</span> <strong>Flat {activePreset.flatNumber}</strong></div>
                  <div><span className="opacity-75">Carpet Area:</span> {activePreset.carpetSqFt} sq.ft</div>
                  <div><span className="opacity-75">Super Built-Up:</span> {activePreset.sbaSqFt} sq.ft</div>
                </div>

                <div className="text-[11px] space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-black/5">
                    <span>1. Basic Consideration:</span>
                    <span className="font-mono font-semibold">{formatIndianCurrency(activePreset.basePrice)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-black/5">
                    <span>2. Dedicated Car Parking Bay ({activePreset.bayNumber}):</span>
                    <span className="font-mono font-semibold">{formatIndianCurrency(activePreset.parkingFee)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-black/10 font-bold">
                    <span>Total Agreed Consideration:</span>
                    <span className="font-mono text-emerald-600">{formatIndianCurrency(totalConsideration)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Tray */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className={clsx("text-xs font-mono", isLight ? "text-slate-500" : isDark ? "text-ink-muted" : "text-stone-500")}>
              Synthesized in <strong className="text-emerald-600">1.2 seconds</strong> • 0 typos
            </span>

            <div className="flex items-center space-x-2">
              <a
                href="/dashboard/generate"
                className={clsx(
                  "px-3.5 py-2 rounded-xl text-xs font-semibold spring-snap flex items-center space-x-1.5 border",
                  isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200" : isDark ? "bg-surface-elevated hover:bg-surface-hover text-ink border-border" : "bg-stone-100 text-stone-800 border-stone-300"
                )}
              >
                <span>Open in Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="/templates/car-parking-allotment.docx"
                download
                className={clsx(
                  "px-4 py-2 rounded-xl text-xs font-semibold spring-snap flex items-center space-x-1.5",
                  isLight ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" : isDark ? "bg-brand hover:bg-brand-hover text-white shadow-glow" : "bg-stone-900 hover:bg-black text-white shadow-sm"
                )}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .DOCX</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated WhatsApp Review Popup */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-sm">WhatsApp Allottee Dispatch</span>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-semibold text-emerald-700">
                {activePreset.developerName} Post-Sales:
              </p>
              <p className="text-slate-600">
                Dear {activePreset.buyerName.split(" ")[0]}, congratulations on Flat {activePreset.flatNumber}!
              </p>
              <p className="text-slate-600">
                Your Car Parking Allotment (Bay {activePreset.bayNumber}) &amp; Home Loan Bank Kit are ready. Please review the official draft:
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-indigo-700 font-semibold break-all">
                👉 https://deedflow.in/verify/DF-2026-X892B
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                12:45 PM • Delivered ✓✓
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold spring-snap shadow-md"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
