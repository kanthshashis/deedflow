"use client";

import React, { useState } from "react";
import { Calculator, Clock, DollarSign, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";

export function RoiCalculator() {
  const [flatCount, setFlatCount] = useState<number>(120);

  // Computed metrics
  const hoursSavedPerYear = Math.round(flatCount * 0.75); // 45 min manual vs 15 sec
  const disbursementDaysSaved = 14; // Average delay reduced from 21 days to 7 days
  const averageTrancheValue = 5000000; // ₹50 Lakhs
  const overdraftInterestRate = 0.11; // 11% p.a.
  // Working capital saved by speeding up disbursement by 14 days per flat
  const workingCapitalSaved = Math.round(
    (averageTrancheValue * (overdraftInterestRate / 365) * disbursementDaysSaved) * (flatCount * 0.5)
  );

  return (
    <div className="w-full max-w-5xl mx-auto glossy-card rounded-2xl p-6 sm:p-8 space-y-6 border-[#DECFC0]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD3] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#7D1826] uppercase tracking-wider font-semibold">
            <Calculator className="w-4 h-4 text-[#B88E3E]" />
            <span>Interactive Financial ROI Simulator</span>
          </div>
          <h3 className="text-xl font-bold text-[#24060B] tracking-tight mt-1">
            Quantify Working Capital &amp; Speed Advantage
          </h3>
        </div>
        <div className="px-3.5 py-1.5 bg-[#F7F1E6] border border-[#DFD1B8] text-[#8C6D2D] rounded-full text-xs font-semibold flex items-center space-x-1.5 w-fit shadow-xs">
          <TrendingUp className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span>Guaranteed 18x Operational ROI</span>
        </div>
      </div>

      {/* The Slider Control */}
      <div className="space-y-4 bg-white/60 p-5 rounded-xl border border-[#E8DFD3] shadow-inner">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#24060B] uppercase tracking-wider">
            Total Inventory Units Under Post-Sales:
          </label>
          <span className="text-xl font-mono font-bold text-[#4A0E17] bg-white px-3.5 py-1 rounded-lg border border-[#DECFC0] shadow-2xs">
            {flatCount} Flats
          </span>
        </div>

        <input
          type="range"
          min={20}
          max={500}
          step={10}
          value={flatCount}
          onChange={(e) => setFlatCount(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#4A0E17]"
        />

        <div className="flex justify-between text-[11px] text-[#5C4A4D] font-mono">
          <span>20 Flats (Boutique)</span>
          <span>120 Flats (Mid-Rise Tower)</span>
          <span>500 Flats (Integrated Township)</span>
        </div>
      </div>

      {/* 3 Metric Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Clerical Time Saved */}
        <div className="p-5 rounded-xl glossy-card border-[#E8DFD3] space-y-1.5">
          <div className="flex items-center space-x-2 text-xs text-[#5C4A4D] font-medium">
            <Clock className="w-4 h-4 text-[#7D1826]" />
            <span>Clerical Time Saved</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#24060B]">
            {hoursSavedPerYear} Hours
          </div>
          <p className="text-[11px] text-[#5C4A4D] leading-tight">
            Zero Word copy-pasting or manual Schedule C edits
          </p>
        </div>

        {/* Card 2: Bank Disbursal Acceleration */}
        <div className="p-5 rounded-xl glossy-card border-[#E8C8CC] bg-gradient-to-b from-white/95 to-[#FBF2F3]/70 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs text-[#7D1826] font-medium">
            <Sparkles className="w-4 h-4 text-[#B88E3E]" />
            <span>Bank Disbursal Acceleration</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#4A0E17]">
            14 Days Faster
          </div>
          <p className="text-[11px] text-[#7D1826] leading-tight">
            Empanelled bank templates prevent NOC legal rejections
          </p>
        </div>

        {/* Card 3: Overdraft Interest Saved */}
        <div className="p-5 rounded-xl glossy-card border-[#DFD1B8] bg-gradient-to-b from-white/95 to-[#F7F1E6]/70 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs text-[#8C6D2D] font-medium">
            <DollarSign className="w-4 h-4 text-[#B88E3E]" />
            <span>Overdraft Interest Saved</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#24060B]">
            {formatIndianCurrency(workingCapitalSaved)}
          </div>
          <p className="text-[11px] text-[#8C6D2D] leading-tight">
            Directly reduces cash cycle drag across project milestones
          </p>
        </div>
      </div>
    </div>
  );
}
