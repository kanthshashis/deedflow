"use client";

import React from "react";
import { BuyerProfile, EntityType } from "@/lib/types";
import { User, Users, Globe, Building } from "lucide-react";
import clsx from "clsx";

interface BuyerDetailsFormProps {
  buyer: BuyerProfile;
  onChange: (updated: BuyerProfile) => void;
}

export function BuyerDetailsForm({ buyer, onChange }: BuyerDetailsFormProps) {
  const handleFieldChange = (field: keyof BuyerProfile, value: any) => {
    onChange({
      ...buyer,
      [field]: value,
    });
  };

  const handleEntityChange = (entityType: EntityType) => {
    onChange({
      ...buyer,
      entityType,
    });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
      {/* Header & Entity Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Verified Buyer Profile &amp; Entity Type</h3>
          <p className="text-xs text-slate-500">
            Smart grammar engine auto-adjusts singular/plural legal agreements
          </p>
        </div>

        {/* Entity Selector Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleEntityChange("sole")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all",
              buyer.entityType === "sole"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sole</span>
          </button>

          <button
            type="button"
            onClick={() => handleEntityChange("joint")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all",
              buyer.entityType === "joint"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Joint</span>
          </button>

          <button
            type="button"
            onClick={() => handleEntityChange("nri_gpa")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all",
              buyer.entityType === "nri_gpa"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>NRI (GPA)</span>
          </button>

          <button
            type="button"
            onClick={() => handleEntityChange("company")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all",
              buyer.entityType === "company"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Company</span>
          </button>
        </div>
      </div>

      {/* Primary Buyer Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Primary Allottee Full Name:
          </label>
          <input
            type="text"
            value={buyer.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            placeholder="e.g. KANTHARAJU MARIYAPPA"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            PAN Number (Verified):
          </label>
          <input
            type="text"
            value={buyer.panNumber}
            onChange={(e) => handleFieldChange("panNumber", e.target.value.toUpperCase())}
            className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-indigo-700 focus:outline-none focus:border-emerald-600 focus:bg-white"
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Aadhaar Number (Auto-Masked):
          </label>
          <input
            type="text"
            value={buyer.aadhaarNumberMasked}
            onChange={(e) => handleFieldChange("aadhaarNumberMasked", e.target.value)}
            className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-emerald-700 focus:outline-none"
            placeholder="XXXXXXXX4826"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Mobile Number (for WhatsApp Draft):
          </label>
          <input
            type="text"
            value={buyer.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            placeholder="+91 98450 12345"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Residential Address (for Agreement Schedule):
          </label>
          <input
            type="text"
            value={buyer.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            placeholder="Door No, Street, Layout, Area, City, State, PIN"
          />
        </div>
      </div>

      {/* Dynamic Conditional Fields based on Entity */}
      {buyer.entityType === "joint" && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-emerald-900">Co-Buyer / Joint Purchaser Details:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Co-Buyer Full Name:</label>
              <input
                type="text"
                value={buyer.coBuyerName || ""}
                onChange={(e) => handleFieldChange("coBuyerName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-xl bg-white text-slate-900"
                placeholder="e.g. PRIYA KANTHARAJU"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship / Role:</label>
              <input
                type="text"
                value={buyer.relationship || ""}
                onChange={(e) => handleFieldChange("relationship", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-xl bg-white text-slate-900"
                placeholder="Wife / Co-purchaser"
              />
            </div>
          </div>
        </div>
      )}

      {buyer.entityType === "nri_gpa" && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-amber-900">Power of Attorney (GPA) Representation:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">GPA Holder Name:</label>
              <input
                type="text"
                value={buyer.gpaHolderName || ""}
                onChange={(e) => handleFieldChange("gpaHolderName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-amber-200 rounded-xl bg-white text-slate-900"
                placeholder="e.g. SURESH MARIYAPPA"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Registered GPA Doc No:</label>
              <input
                type="text"
                value={buyer.gpaDocumentNumber || ""}
                onChange={(e) => handleFieldChange("gpaDocumentNumber", e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-amber-200 rounded-xl bg-white text-slate-900"
                placeholder="BK-IV/1234/2026-27"
              />
            </div>
          </div>
        </div>
      )}

      {buyer.entityType === "company" && (
        <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-purple-900">Corporate Signatory &amp; Board Authorization:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Authorized Signatory:</label>
              <input
                type="text"
                value={buyer.authorizedSignatoryName || ""}
                onChange={(e) => handleFieldChange("authorizedSignatoryName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-purple-200 rounded-xl bg-white text-slate-900"
                placeholder="Signatory Name"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Designation:</label>
              <input
                type="text"
                value={buyer.designation || ""}
                onChange={(e) => handleFieldChange("designation", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-purple-200 rounded-xl bg-white text-slate-900"
                placeholder="Director / Partner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
