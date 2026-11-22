"use client";

import React, { useState } from "react";
import { MOCK_PROJECT } from "@/lib/mockData";
import { Building2, Sparkles, ShieldCheck, Check, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight">Organization Profile &amp; Billing</h1>
        <p className="text-xs text-[#5C4A4D] mt-1">
          Configure builder credentials, statutory RERA registration numbers, and launch partner access.
        </p>
      </div>

      {/* Launch Partner Status Card */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 text-[#24060B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#7D1826] uppercase tracking-wider mb-1 font-mono">
            <Sparkles className="w-4 h-4 text-[#B88E3E]" />
            <span>Founding Builder Partner</span>
          </div>
          <h2 className="text-lg font-bold font-serif text-[#24060B]">100% Free Pilot Access Active</h2>
          <p className="text-xs text-[#5C4A4D] mt-1">
            Enjoy unlimited document generations, 1-Click Bank Kits, and priority OCR extraction during your trial.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-[#FFF9EE] text-[#B88E3E] rounded-xl font-bold text-xs shadow-xs border border-[#F2E4C4] text-center shrink-0 font-mono">
          Status: Active (₹0 / Free)
        </div>
      </div>

      {/* Organization Statutory Form */}
      <form onSubmit={handleSave} className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-[#F0E8DD] pb-3">
          <h2 className="text-sm font-bold font-serif text-[#24060B]">Statutory &amp; Company Details</h2>
          <p className="text-xs text-[#5C4A4D]">Auto-injected into header of generated sale agreements and NOCs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#5C4A4D] mb-1">Commercial Brand Name:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.name}
              className="w-full px-3 py-2 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5C4A4D] mb-1">Registered Legal Entity Name:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.legalName}
              className="w-full px-3 py-2 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5C4A4D] mb-1">Project RERA Registration #:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.reraNumber}
              className="w-full px-3 py-2 border border-[#DECFC0] rounded-xl bg-white font-mono text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5C4A4D] mb-1">Sanction Plan Approval #:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.sanctionPlanNo}
              className="w-full px-3 py-2 border border-[#DECFC0] rounded-xl bg-white font-mono text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#5C4A4D] mb-1">Site Office Physical Address:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.location}
              className="w-full px-3 py-2 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 glossy-btn-burgundy hover:brightness-105 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#D4B989]" />
            <span>Save Profile</span>
          </button>
          {saved && (
            <span className="text-xs text-emerald-700 font-semibold">Changes saved successfully!</span>
          )}
        </div>
      </form>

      {/* Commercial Plans Reference (Dormant Razorpay) */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-[#F0E8DD] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-serif text-[#24060B]">Commercial Licensing Tiers</h2>
            <p className="text-xs text-[#5C4A4D]">Available post-pilot for multi-tower deployments</p>
          </div>
          <CreditCard className="w-4 h-4 text-[#8C777A]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-2">
            <div className="text-xs font-bold text-[#24060B]">Single Tower Starter</div>
            <div className="text-lg font-bold font-serif text-[#24060B]">₹2,999 <span className="text-xs font-normal text-[#8C777A]">/ month</span></div>
            <p className="text-[11px] text-[#5C4A4D]">Up to 60 units • 1 Ongoing Project • Standard Templates</p>
          </div>

          <div className="p-4 bg-[#FFF9EE] rounded-xl border border-[#F2E4C4] space-y-2">
            <div className="text-xs font-bold text-[#B88E3E]">Builder Pro (Multi-Project)</div>
            <div className="text-lg font-bold font-serif text-[#24060B]">₹7,999 <span className="text-xs font-normal text-[#8C777A]">/ month</span></div>
            <p className="text-[11px] text-[#5C4A4D]">Unlimited units • Multi-Tower • Custom Template Linter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
