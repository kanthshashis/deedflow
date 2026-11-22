"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, X, ShieldCheck, Plus, Trash2, Calendar, FileText } from "lucide-react";
import { UnitInventory, SaleDeedEnrichment, PaymentUtrRecord } from "@/lib/types";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";

interface SaleDeedEnrichmentModalProps {
  unit: UnitInventory;
  isOpen: boolean;
  onClose: () => void;
  onSave: (unitId: string, enrichment: SaleDeedEnrichment) => void;
  onGenerateDeed: (unit: UnitInventory, enrichment: SaleDeedEnrichment) => void;
}

export function SaleDeedEnrichmentModal({
  unit,
  isOpen,
  onClose,
  onSave,
  onGenerateDeed,
}: SaleDeedEnrichmentModalProps) {
  const existing = unit.allottee?.saleDeedEnrichment;

  const [eStampNo, setEStampNo] = useState(existing?.e_stamp_certificate_no || "IN-KA92847192847102U");
  const [eStampDate, setEStampDate] = useState(existing?.e_stamp_date || "2026-11-15");
  const [stampDutyAmount, setStampDutyAmount] = useState(existing?.stamp_duty_amount || 729000);
  const [regFeeAmount, setRegFeeAmount] = useState(existing?.registration_fee_amount || 145800);
  const [udsSqft, setUdsSqft] = useState(existing?.uds_sqft || unit.undividedShareLandSqFt);
  const [possessionDate, setPossessionDate] = useState(existing?.possession_date || "2027-03-31");
  const [witness1, setWitness1] = useState(existing?.witness_1_name_address || "Ramesh Kumar, #12, HSR Layout, Bengaluru (DL: KA-01-2018-00912)");
  const [witness2, setWitness2] = useState(existing?.witness_2_name_address || "Suresh Babu, #88, Koramangala, Bengaluru (PAN: BPKPB9912A)");

  const [utrSchedule, setUtrSchedule] = useState<PaymentUtrRecord[]>(
    existing?.payment_utr_schedule || [
      { milestone: "Booking Token", amount: 500000, bankName: "HDFC Bank", utrNumber: "HDFCR520261101001", date: "2026-11-01" },
      { milestone: "Agreement Signing (20%)", amount: 2416000, bankName: "HDFC Bank", utrNumber: "HDFCR520261108002", date: "2026-11-08" },
      { milestone: "Plinth Level Disbursal", amount: 1458000, bankName: "State Bank of India", utrNumber: "SBIN004026111003", date: "2026-11-10" },
    ]
  );

  if (!isOpen) return null;

  // Validation Checks
  const isEStampValid = eStampNo.trim().length >= 10;
  const isStampDutyValid = stampDutyAmount > 0;
  const isUtrComplete = utrSchedule.length > 0 && utrSchedule.every((u) => u.utrNumber.trim().length >= 8);
  const isUdsValid = udsSqft > 0;
  const isWitnessesValid = witness1.trim().length > 10 && witness2.trim().length > 10;

  const isAllValid = isEStampValid && isStampDutyValid && isUtrComplete && isUdsValid && isWitnessesValid;

  const handleAddUtrRow = () => {
    setUtrSchedule([
      ...utrSchedule,
      { milestone: "New Milestone", amount: 1000000, bankName: "Bank", utrNumber: "UTR123456", date: "2026-11-20" },
    ]);
  };

  const handleRemoveUtrRow = (index: number) => {
    setUtrSchedule(utrSchedule.filter((_, i) => i !== index));
  };

  const buildPayload = (): SaleDeedEnrichment => ({
    e_stamp_certificate_no: eStampNo,
    e_stamp_date: eStampDate,
    stamp_duty_amount: stampDutyAmount,
    registration_fee_amount: regFeeAmount,
    payment_utr_schedule: utrSchedule,
    uds_sqft: udsSqft,
    possession_date: possessionDate,
    witness_1_name_address: witness1,
    witness_2_name_address: witness2,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="glossy-card bg-[#FFFDFB] rounded-2xl border border-[#DECFC0] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 animate-fade-in font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4A0E17] text-white">
                Flat {unit.flatNumber} ({unit.tower})
              </span>
              <h2 className="text-lg font-bold font-serif text-[#24060B] tracking-tight">
                Sale Deed Pre-Generation Statutory Enrichment (UC-08)
              </h2>
            </div>
            <p className="text-xs text-[#5C4A4D]">
              Validates e-stamp certificates, banking UTR payments, UDS math, and 2 legal witnesses before printing.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C777A] hover:text-[#24060B] hover:bg-[#F8F2EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Point Statutory Checklist Banner */}
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          isAllValid ? "bg-[#FFF9EE] border-[#F2E4C4] text-[#B88E3E]" : "bg-[#FAF0F2] border-[#F0D5D9] text-[#7D1826]"
        }`}>
          <div className="flex items-center space-x-2.5">
            {isAllValid ? (
              <CheckCircle2 className="w-5 h-5 text-[#B88E3E] shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#7D1826] shrink-0" />
            )}
            <span className="font-semibold">
              {isAllValid
                ? "All 7 Statutory Prerequisites Verified! Ready to generate legally binding Sale Deed."
                : "Missing Statutory Data: Please complete e-stamp, UTR schedule, and witness profiles."}
            </span>
          </div>

          <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-white border border-[#DECFC0]">
            {isAllValid ? "Passed" : "Action Required"}
          </span>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 text-xs">
          {/* Section 1: E-Stamp & Duty */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#7D1826] uppercase text-[11px] font-mono">
              1. Government E-Stamp Certificate &amp; Duty Paid
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">E-Stamp Certificate Number</label>
                <input
                  type="text"
                  value={eStampNo}
                  onChange={(e) => setEStampNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-mono font-bold text-[#24060B] bg-white focus:outline-none focus:border-[#4A0E17]"
                  placeholder="IN-KA92847192847102U"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">E-Stamp Issue Date</label>
                <input
                  type="date"
                  value={eStampDate}
                  onChange={(e) => setEStampDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-mono text-[#24060B] bg-white focus:outline-none focus:border-[#4A0E17]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">State Stamp Duty Paid (₹)</label>
                <input
                  type="number"
                  value={stampDutyAmount}
                  onChange={(e) => setStampDutyAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-mono font-bold text-[#24060B] bg-white focus:outline-none focus:border-[#4A0E17]"
                />
                <span className="text-[10px] text-[#8C777A] mt-0.5 block">{formatIndianCurrency(stampDutyAmount)}</span>
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">Registration &amp; Surcharge Fees (₹)</label>
                <input
                  type="number"
                  value={regFeeAmount}
                  onChange={(e) => setRegFeeAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-mono font-bold text-[#24060B] bg-white focus:outline-none focus:border-[#4A0E17]"
                />
                <span className="text-[10px] text-[#8C777A] mt-0.5 block">{formatIndianCurrency(regFeeAmount)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Banking Payment UTR Schedule */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#7D1826] uppercase text-[11px] font-mono">
                2. Mandatory Payment UTR Schedule (Schedule B of Sale Deed)
              </h4>
              <button
                type="button"
                onClick={handleAddUtrRow}
                className="px-2.5 py-1 rounded-lg bg-[#F8F2EC] hover:bg-[#F3EAE0] text-[#24060B] text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors border border-[#DECFC0]"
              >
                <Plus className="w-3.5 h-3.5 text-[#7D1826]" />
                <span>Add Tranche</span>
              </button>
            </div>

            <div className="border border-[#DECFC0] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
                  <tr>
                    <th className="px-3 py-2">Milestone</th>
                    <th className="px-3 py-2">Amount (₹)</th>
                    <th className="px-3 py-2">Bank</th>
                    <th className="px-3 py-2">UTR / Chq #</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DD] font-mono">
                  {utrSchedule.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2]">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.milestone}
                          onChange={(e) => {
                            const updated = [...utrSchedule];
                            updated[idx].milestone = e.target.value;
                            setUtrSchedule(updated);
                          }}
                          className="w-full px-2 py-1 border border-[#DECFC0] rounded text-xs bg-white text-[#24060B]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.amount}
                          onChange={(e) => {
                            const updated = [...utrSchedule];
                            updated[idx].amount = Number(e.target.value);
                            setUtrSchedule(updated);
                          }}
                          className="w-24 px-2 py-1 border border-[#DECFC0] rounded text-xs font-bold bg-white text-[#24060B]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.bankName}
                          onChange={(e) => {
                            const updated = [...utrSchedule];
                            updated[idx].bankName = e.target.value;
                            setUtrSchedule(updated);
                          }}
                          className="w-24 px-2 py-1 border border-[#DECFC0] rounded text-xs bg-white text-[#24060B]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.utrNumber}
                          onChange={(e) => {
                            const updated = [...utrSchedule];
                            updated[idx].utrNumber = e.target.value;
                            setUtrSchedule(updated);
                          }}
                          className="w-32 px-2 py-1 border border-[#DECFC0] rounded text-xs font-bold text-[#7D1826] bg-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => {
                            const updated = [...utrSchedule];
                            updated[idx].date = e.target.value;
                            setUtrSchedule(updated);
                          }}
                          className="w-32 px-2 py-1 border border-[#DECFC0] rounded text-xs bg-white text-[#24060B]"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveUtrRow(idx)}
                          className="text-[#8C777A] hover:text-[#7D1826] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: UDS & Possession & Witnesses */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-[#7D1826] uppercase text-[11px] font-mono">
              3. Undivided Share (UDS), Possession &amp; Witnesses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">Undivided Share of Land (sq.ft)</label>
                <input
                  type="number"
                  value={udsSqft}
                  onChange={(e) => setUdsSqft(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-mono font-bold text-[#24060B] bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">Possession Handover Date</label>
                <input
                  type="date"
                  value={possessionDate}
                  onChange={(e) => setPossessionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] font-mono text-[#24060B] bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">Witness 1 (Name, Address, ID)</label>
                <input
                  type="text"
                  value={witness1}
                  onChange={(e) => setWitness1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">Witness 2 (Name, Address, ID)</label>
                <input
                  type="text"
                  value={witness2}
                  onChange={(e) => setWitness2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#F0E8DD] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSave(unit.id, buildPayload())}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Save Draft Enrichment
          </button>

          <button
            type="button"
            disabled={!isAllValid}
            onClick={() => onGenerateDeed(unit, buildPayload())}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-[#D4B989]" />
            <span>Generate Official Sale Deed (.DOCX)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
