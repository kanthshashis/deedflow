"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle2, ShieldCheck, Eye } from "lucide-react";
import clsx from "clsx";

const DOSSIER_DOCS = [
  {
    id: "parking",
    title: "1. Car Parking Allotment Letter",
    tagline: "Perpetual, non-severable basement bay right",
    fileDocx: "/templates/car-parking-allotment.docx",
    clauses: [
      "Schedule C Undivided Share (UDS) computation",
      "Dedicated Covered / Compact / Tandem bay number",
      "Non-transferable to non-resident third parties",
      "Dual legal tags {parking_fee_formatted} & {parking_fee_words}",
    ],
  },
  {
    id: "noc",
    title: "2. Builder Home Loan Tripartite NOC",
    tagline: "SBI, HDFC, ICICI, Axis & Canara bank approved format",
    fileDocx: "/templates/builder-home-loan-noc.docx",
    clauses: [
      "Direct mortgage permission under Section 11(4)(h)",
      "Received consideration vs Balance to be disbursed",
      "Direct remittance to RERA Master Bank Account & IFSC",
      "Undertaking to deliver original Sale Deed upon registration",
    ],
  },
  {
    id: "cost",
    title: "3. Official Unit Cost Sheet & Schedule",
    tagline: "RERA construction-linked milestone payment schedule",
    fileDocx: "/templates/unit-cost-sheet.docx",
    clauses: [
      "Carpet Area vs Super Built-Up Area breakup",
      "Infrastructure & Amenities charges (BESCOM/BWSSB)",
      "Applicable GST (5% Under-Construction / 0% OC received)",
      "6-stage milestone disbursement breakdown (Plinth, Slabs, Finishing)",
    ],
  },
];

export function DocumentDossierShowcase() {
  const [activeDoc, setActiveDoc] = useState(DOSSIER_DOCS[0]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          The 1-Click Home Loan Bank Kit Dossier
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          3 official legal documents generated simultaneously from one verified buyer profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Document Tab Selector */}
        <div className="lg:col-span-5 space-y-3">
          {DOSSIER_DOCS.map((doc) => {
            const isActive = activeDoc.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={clsx(
                  "p-4 rounded-2xl border cursor-pointer spring-transition text-left",
                  isActive
                    ? "bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/10"
                    : "bg-surface-card border-white/5 hover:border-white/20 hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">{doc.tagline}</p>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Detailed Clause Inspector */}
        <div className="lg:col-span-7 bg-surface-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-sky-400 font-bold uppercase">
                Active Template Inspection
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeDoc.title}</h3>
            </div>
            <a
              href={activeDoc.fileDocx}
              download
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 spring-transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .DOCX</span>
            </a>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Audited Statutory Clauses Included:
            </span>
            <ul className="space-y-2.5">
              {activeDoc.clauses.map((clause, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[11px] font-bold">
                    ✓
                  </div>
                  <span className="leading-relaxed">{clause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Word Formatting Preservation</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold text-[11px]">
              Ready for Print
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
