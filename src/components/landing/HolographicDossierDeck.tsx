"use client";

import React, { useState } from "react";
import { Download, FileText, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import clsx from "clsx";

const DOSSIER_CARDS = [
  {
    id: "parking",
    title: "Car Parking Allotment",
    subtitle: "Schedule C & D Perpetual Right",
    downloadPath: "/templates/car-parking-allotment.docx",
    badge: "Bay B1-04 • Basement 1",
    accentColor: "from-sky-500 to-blue-600",
    paragraphs: [
      "Sub: Exclusive Right to Use Dedicated Car Parking Bay No. B1-04.",
      "Consideration: ₹3,50,000 (Rupees Three Lakhs Fifty Thousand Only).",
      "Appurtenant to Flat No. B-302, Floor 3, Tower B.",
      "Non-severable, perpetual, running concurrently with title ownership.",
    ],
  },
  {
    id: "noc",
    title: "Builder Home Loan NOC",
    subtitle: "Tripartite Permission to Mortgage",
    downloadPath: "/templates/builder-home-loan-noc.docx",
    badge: "SBI / HDFC / ICICI Empanelled",
    accentColor: "from-emerald-500 to-teal-600",
    paragraphs: [
      "To: The Branch Manager, State Bank of India / HDFC Bank.",
      "Permission to mortgage right, title, and interest in Flat B-302.",
      "Direct disbursement to designated RERA Bank Account No. 918020034827101.",
      "Undertaking to deliver original registered Sale Deed upon completion.",
    ],
  },
  {
    id: "cost",
    title: "Official Unit Cost Sheet",
    subtitle: "RERA Construction-Linked Milestones",
    downloadPath: "/templates/unit-cost-sheet.docx",
    badge: "100% Deterministic Financials",
    accentColor: "from-indigo-500 to-purple-600",
    paragraphs: [
      "Basic Consideration: ₹1,17,76,000 (Carpet: 920.0 sq.ft, SBA: 1280.0 sq.ft).",
      "Dedicated Covered Bay: ₹3,50,000 + Infrastructure: ₹2,50,000.",
      "Total Agreed Consideration: ₹1,23,76,000.",
      "Milestones: 10% Booking, 10% Agreement, 15% Plinth, 25% Slabs, 35% Finishing.",
    ],
  },
];

export function HolographicDossierDeck() {
  const [activeCardId, setActiveCardId] = useState<string>("parking");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Dossier Deck</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          3 Print-Ready Documents. 1 Verified Profile.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Hover or click any card in the deck to inspect exact clauses and download sample .DOCX files.
        </p>
      </div>

      {/* 3D Card Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 [perspective:1200px]">
        {DOSSIER_CARDS.map((card, idx) => {
          const isActive = activeCardId === card.id;

          return (
            <div
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
              className={clsx(
                "cursor-pointer rounded-3xl p-6 sm:p-7 border spring-transition relative flex flex-col justify-between select-none shadow-2xl group",
                isActive
                  ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-sky-400/60 shadow-sky-500/20 [transform:translateY(-8px)_scale(1.02)]"
                  : "bg-slate-950/70 border-white/10 hover:border-white/30 hover:[transform:translateY(-4px)] opacity-85 hover:opacity-100"
              )}
            >
              {/* Top Accent Pill & Gold Stamp */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      "text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase",
                      isActive
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                        : "bg-white/5 text-slate-400 border-white/10"
                    )}
                  >
                    {card.badge}
                  </span>

                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold text-amber-300">
                    ★
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{card.subtitle}</p>
                </div>

                {/* Simulated Clauses Box */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-serif leading-relaxed text-slate-300">
                  {card.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-[11px] text-slate-300/90">
                      • {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero-Typo Sealed</span>
                </span>

                <a
                  href={card.downloadPath}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 spring-transition"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Download .DOCX</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
