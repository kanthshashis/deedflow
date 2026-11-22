"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle, Zap, Clock, Sparkles } from "lucide-react";

export function ClerkVsDeedflowComparison() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          The 45-Minute Clerk Friction vs. The 12-Second Invariant
        </h2>
        <p className="text-xs sm:text-sm text-ink-secondary max-w-xl mx-auto">
          Why Tier-1 &amp; Tier-2 developers replace error-prone manual document editing with DeedFlow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* The Old Way: Manual Word Nightmare */}
        <div className="glossy-card rounded-2xl p-6 space-y-4 relative overflow-hidden border-[#DECFC0]">
          <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
            <div className="flex items-center space-x-2 text-[#7D1826] font-bold text-sm">
              <XCircle className="w-4 h-4 text-[#7D1826]" />
              <span>The Old Way: Manual Word Typing</span>
            </div>
            <span className="text-[11px] text-[#5C4A4D] font-mono font-semibold bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
              45 Mins / Booking
            </span>
          </div>

          <ul className="space-y-3 text-xs text-[#5C4A4D]">
            <li className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-[#7D1826] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Previous Buyer Name Leaks:</strong> Sales executive opens old Word template, forgets to replace buyer name on Schedule C.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-[#7D1826] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Basement Parking Clashes:</strong> Two executives promise slot B1-14 to both Flat 302 and Flat 405 on token day.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-[#7D1826] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Bank Loan Disbursement Stalls:</strong> SBI or HDFC rejects the tripartite NOC due to a ₹1,000 calculation typo in words.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-[#7D1826] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Aadhaar Act Violations:</strong> Raw unmasked 12-digit Aadhaar photocopies stored insecurely in shared office drives.
              </span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-[#5C4A4D] font-medium">
            Result: ₹50L–₹1.5Cr home loan tranches stuck in bank compliance review for 21+ days.
          </div>
        </div>

        {/* The DeedFlow Way: 12-Second Invariant */}
        <div className="glossy-card rounded-2xl p-6 space-y-4 relative overflow-hidden border-[#E8C8CC] bg-gradient-to-b from-white/95 to-[#FBF2F3]/70">
          <div className="flex items-center justify-between border-b border-[#E8C8CC] pb-3">
            <div className="flex items-center space-x-2 text-[#4A0E17] font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#B88E3E]" />
              <span>The DeedFlow Invariant</span>
            </div>
            <span className="text-[11px] text-[#7D1826] font-mono font-bold bg-[#FBF2F3] px-2.5 py-0.5 rounded-full border border-[#E8C8CC]">
              12 Seconds / Booking
            </span>
          </div>

          <ul className="space-y-3 text-xs text-[#5C4A4D]">
            <li className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#B88E3E] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Zero-Typo In-Memory OCR:</strong> Reads PAN/Aadhaar in 120ms. Populates all 22 legal tags with 100% precision.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#B88E3E] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Atomic Slot Allotment:</strong> Visual basement grid locks slot B1-04 instantly, mathematically preventing double allocation.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#B88E3E] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">Deterministic Financials:</strong> Currency in words is calculated mathematically in Lakhs/Crores. Never hallucinated.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#B88E3E] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24060B]">1-Click WhatsApp Draft Dispatch:</strong> Buyer verifies spelling on mobile in 30 seconds before printing.
              </span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-[#FBF2F3] border border-[#E8C8CC] text-[11px] text-[#7D1826] font-medium">
            Result: 100% first-pass bank approval. Loan tranches released 14 days faster.
          </div>
        </div>
      </div>
    </div>
  );
}
