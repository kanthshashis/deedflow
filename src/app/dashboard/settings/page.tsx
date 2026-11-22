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
        <h1 className="text-xl font-bold text-obsidian tracking-tight">Organization Profile &amp; Billing</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure builder credentials, statutory RERA registration numbers, and launch partner access.
        </p>
      </div>

      {/* Launch Partner Status Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-emerald-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Founding Builder Partner</span>
          </div>
          <h2 className="text-lg font-bold">100% Free Pilot Access Active</h2>
          <p className="text-xs text-emerald-700 mt-1">
            Enjoy unlimited document generations, 1-Click Bank Kits, and priority OCR extraction during your trial.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-white text-emerald-800 rounded-xl font-bold text-xs shadow-sm border border-emerald-200 text-center shrink-0">
          Status: Active (₹0 / Free)
        </div>
      </div>

      {/* Organization Statutory Form */}
      <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-bold text-obsidian">Statutory &amp; Company Details</h2>
          <p className="text-xs text-slate-500">Auto-injected into header of generated sale agreements and NOCs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Commercial Brand Name:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.name}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registered Legal Entity Name:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.legalName}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project RERA Registration #:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.reraNumber}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sanction Plan Approval #:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.sanctionPlanNo}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Site Office Physical Address:</label>
            <input
              type="text"
              defaultValue={MOCK_PROJECT.location}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-obsidian text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold">Changes saved successfully!</span>
          )}
        </div>
      </form>

      {/* Commercial Plans Reference (Dormant Razorpay) */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-obsidian">Commercial Licensing Tiers</h2>
            <p className="text-xs text-slate-500">Available post-pilot for multi-tower deployments</p>
          </div>
          <CreditCard className="w-4 h-4 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900">Single Tower Starter</div>
            <div className="text-lg font-bold text-obsidian">₹2,999 <span className="text-xs font-normal text-slate-500">/ month</span></div>
            <p className="text-[11px] text-slate-500">Up to 60 units • 1 Ongoing Project • Standard Templates</p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
            <div className="text-xs font-bold text-blue-900">Builder Pro (Multi-Project)</div>
            <div className="text-lg font-bold text-obsidian">₹7,999 <span className="text-xs font-normal text-slate-500">/ month</span></div>
            <p className="text-[11px] text-slate-500">Unlimited units • Multi-Tower • Custom Template Linter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
