"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Car,
  Share2,
  Lock,
  ArrowRight,
  Eye,
  FileArchive,
  RefreshCw,
} from "lucide-react";
import clsx from "clsx";

const PRESET_SCENARIOS = [
  {
    id: "pan",
    label: "Scenario A: Sole Buyer (PAN Card)",
    buyerName: "KANTHARAJU MARIYAPPA",
    docType: "PAN",
    docId: "ABCDE1234F",
    maskedAadhaar: "XXXXXXXX4826",
    flat: "B-302",
    sba: "1280.0 sq.ft",
    bay: "B1-04",
    level: "Basement 1",
    price: "₹1,17,76,000",
    priceWords: "Rupees One Crore Seventeen Lakhs Seventy Six Thousand Only",
  },
  {
    id: "joint",
    label: "Scenario B: Joint Co-Buyers (Husband & Wife)",
    buyerName: "ANANYA RAO & VIKRAM RAO",
    docType: "AADHAAR e-KYC",
    docId: "XXXXXXXX9921",
    maskedAadhaar: "XXXXXXXX9921",
    flat: "B-201",
    sba: "1620.0 sq.ft",
    bay: "B1-08 (EV Bay)",
    level: "Basement 1",
    price: "₹1,47,42,000",
    priceWords: "Rupees One Crore Forty Seven Lakhs Forty Two Thousand Only",
  },
  {
    id: "nri",
    label: "Scenario C: NRI via GPA Holder",
    buyerName: "ROHIT MENON (Rep. by GPA Suresh M)",
    docType: "PASSPORT + GPA",
    docId: "Z5829104",
    maskedAadhaar: "XXXXXXXX1189",
    flat: "B-203",
    sba: "1850.0 sq.ft",
    bay: "B2-05 (Tandem Double)",
    level: "Basement 2",
    price: "₹1,68,35,000",
    priceWords: "Rupees One Crore Sixty Eight Lakhs Thirty Five Thousand Only",
  },
];

export function LiveSimulator() {
  const [selectedScenario, setSelectedScenario] = useState(PRESET_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(3); // All steps completed
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const runSimulation = (scenario: typeof PRESET_SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setIsSimulating(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setIsSimulating(false);
      }, 500);
    }, 450);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-sky-500/30 via-slate-700/20 to-transparent shadow-2xl">
      <div className="rounded-[23px] bg-surface-card border border-white/10 p-5 sm:p-8 backdrop-blur-xl space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-wider text-sky-400 uppercase">
                Interactive Live Engine Simulator
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Test In-Memory OCR &amp; 1-Click Bank Kit Generation
            </h3>
          </div>

          {/* Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
            {PRESET_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => runSimulation(sc)}
                disabled={isSimulating}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium spring-transition",
                  selectedScenario.id === sc.id
                    ? "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {sc.label.split(":")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Step Pipeline Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={clsx(
              "p-3 rounded-xl border spring-transition text-xs",
              activeStep >= 1
                ? "bg-sky-500/10 border-sky-500/40 text-sky-200"
                : "bg-slate-900/40 border-white/5 text-slate-500"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Step 1: In-Memory OCR</span>
              {activeStep >= 1 && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Aadhaar masked, zero disk retention</p>
          </div>

          <div
            className={clsx(
              "p-3 rounded-xl border spring-transition text-xs",
              activeStep >= 2
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
                : "bg-slate-900/40 border-white/5 text-slate-500"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Step 2: Inventory &amp; Bay Lock</span>
              {activeStep >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Atomic row-lock prevents clashes</p>
          </div>

          <div
            className={clsx(
              "p-3 rounded-xl border spring-transition text-xs",
              activeStep >= 3
                ? "bg-blue-500/10 border-blue-500/40 text-blue-200"
                : "bg-slate-900/40 border-white/5 text-slate-500"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Step 3: 3-in-1 Bank Kit ZIP</span>
              {activeStep >= 3 && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Word .docx + watermarked PDF</p>
          </div>
        </div>

        {/* Live Output Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Left 5 Cols: Extracted Data Sheet */}
          <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl border border-white/10 p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-mono text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Normalized Buyer Ledger
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                100% Deterministic
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">PRIMARY ALLOTTEE:</span>
                <span className="font-bold text-white text-sm">{selectedScenario.buyerName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">DOCUMENT TYPE:</span>
                  <span className="font-semibold text-sky-400">{selectedScenario.docType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">MASKED ID REF:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedScenario.maskedAadhaar}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">ALLOCATED UNIT:</span>
                  <span className="font-bold text-white">Flat {selectedScenario.flat} ({selectedScenario.sba})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">DEDICATED BAY:</span>
                  <span className="font-bold text-emerald-300">{selectedScenario.bay}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-white/5">
                <span className="text-slate-500 block text-[10px] font-mono">CONSIDERATION AMOUNT:</span>
                <span className="font-mono font-bold text-sky-300 text-sm">{selectedScenario.price}</span>
                <span className="text-[10px] text-slate-400 block italic leading-tight mt-0.5">
                  &quot;{selectedScenario.priceWords}&quot;
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero PII stored</span>
              </span>
              <button
                onClick={() => runSimulation(selectedScenario)}
                className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
              >
                <RefreshCw className={clsx("w-3 h-3", isSimulating && "animate-spin")} />
                <span>Re-Run</span>
              </button>
            </div>
          </div>

          {/* Right 7 Cols: The Generated Document & WhatsApp Action */}
          <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white text-xs">Simulated Output Dossier</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">A4 Format • Letterhead Clean</span>
              </div>

              {/* Document Mock Preview */}
              <div className="relative p-4 rounded-xl bg-white text-slate-900 shadow-xl overflow-hidden text-[11px] font-serif leading-relaxed select-none border border-slate-300">
                {/* Diagonal Draft Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-25deg] select-none">
                  <span className="text-xl sm:text-2xl font-black text-red-500/25 tracking-widest uppercase border-4 border-dashed border-red-500/25 px-4 py-2">
                    DRAFT — FOR VERIFICATION ONLY
                  </span>
                </div>

                {/* Header */}
                <div className="text-center border-b border-slate-200 pb-2 mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Sobha Limited</div>
                  <div className="text-[9px] text-slate-500 font-sans">
                    RERA No: PRM/KA/RERA/1251/308 • Project: Sobha Royal Pavilion
                  </div>
                </div>

                {/* Body Snippet */}
                <div className="space-y-1.5 text-slate-800">
                  <p>
                    <strong>Sub:</strong> Allotment of Exclusive Car Parking Space No.{" "}
                    <strong>{selectedScenario.bay}</strong> appurtenant to Flat No.{" "}
                    <strong>{selectedScenario.flat}</strong>.
                  </p>
                  <p className="text-[10px] text-slate-600 line-clamp-2">
                    We hereby confirm that on receipt of agreed consideration of {selectedScenario.price}, dedicated car parking bay {selectedScenario.bay} ({selectedScenario.level}) has been allotted to {selectedScenario.buyerName}...
                  </p>
                </div>

                {/* Footer with simulated QR code */}
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-sans">
                  <span>Tamper-Proof Verification Hash: DF-2026-X829B</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    QR Sealed
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 spring-transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Simulate 1-Click WhatsApp Review</span>
              </button>

              <a
                href="/dashboard/generate"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-500/20 spring-transition"
              >
                <span>Open Generator Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp Preview Popup Modal */}
        {showWhatsAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-sm">WhatsApp Buyer Verification</span>
                </div>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Chat Bubble Mock */}
              <div className="p-4 rounded-2xl bg-[#005c4b]/80 border border-emerald-500/30 text-white text-xs space-y-2 shadow-inner">
                <p className="font-semibold text-emerald-200">
                  Sobha Post-Sales Desk:
                </p>
                <p>
                  Dear {selectedScenario.buyerName.split(" ")[0]}, congratulations on Flat {selectedScenario.flat}!
                </p>
                <p>
                  Your Car Parking Allotment ({selectedScenario.bay}) &amp; Home Loan Bank Kit are ready. Please review the official draft:
                </p>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-sky-300">
                  👉 https://deedflow.in/verify/DF-X94B2
                </div>
                <div className="text-[10px] text-emerald-300/80 text-right">
                  12:45 PM • Delivered ✓✓
                </div>
              </div>

              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
