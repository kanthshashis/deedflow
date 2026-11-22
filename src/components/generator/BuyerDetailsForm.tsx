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
    <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header & Entity Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8DD] pb-4">
        <div>
          <h3 className="text-base font-bold font-serif text-[#24060B]">Verified Buyer Profile &amp; Entity Type</h3>
          <p className="text-xs text-[#5C4A4D]">
            Smart grammar engine auto-adjusts singular/plural legal agreements
          </p>
        </div>

        {/* Entity Selector Tabs */}
        <div className="flex items-center space-x-1 bg-[#F8F2EC] border border-[#DECFC0] p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleEntityChange("sole")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all cursor-pointer",
              buyer.entityType === "sole"
                ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                : "text-[#5C4A4D] hover:text-[#24060B]"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sole</span>
          </button>

          <button
            type="button"
            onClick={() => handleEntityChange("joint")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all cursor-pointer",
              buyer.entityType === "joint"
                ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                : "text-[#5C4A4D] hover:text-[#24060B]"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Joint</span>
          </button>

          <button
            type="button"
            onClick={() => handleEntityChange("nri_gpa")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all cursor-pointer",
              buyer.entityType === "nri_gpa"
                ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                : "text-[#5C4A4D] hover:text-[#24060B]"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>NRI (GPA)</span>
          </button>

          <button
            type="button"
            onClick={() => handleEntityChange("company")}
            className={clsx(
              "px-3 py-1.5 rounded-lg flex items-center space-x-1.5 spring-snap transition-all cursor-pointer",
              buyer.entityType === "company"
                ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                : "text-[#5C4A4D] hover:text-[#24060B]"
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
          <label className="block text-xs font-bold text-[#5C4A4D] uppercase tracking-wider mb-1.5">
            Primary Allottee Full Name:
          </label>
          <input
            type="text"
            value={buyer.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            placeholder="e.g. KANTHARAJU MARIYAPPA"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5C4A4D] uppercase tracking-wider mb-1.5">
            PAN Number (Verified):
          </label>
          <input
            type="text"
            value={buyer.panNumber}
            onChange={(e) => handleFieldChange("panNumber", e.target.value.toUpperCase())}
            className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-white text-[#7D1826] focus:outline-none focus:border-[#4A0E17]"
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5C4A4D] uppercase tracking-wider mb-1.5">
            Aadhaar Number (Auto-Masked):
          </label>
          <input
            type="text"
            value={buyer.aadhaarNumberMasked}
            onChange={(e) => handleFieldChange("aadhaarNumberMasked", e.target.value)}
            className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-[#FAF7F2] text-[#B88E3E] focus:outline-none"
            placeholder="XXXXXXXX4826"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5C4A4D] uppercase tracking-wider mb-1.5">
            Mobile Number (for WhatsApp Draft):
          </label>
          <input
            type="text"
            value={buyer.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            placeholder="+91 98450 12345"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-[#5C4A4D] uppercase tracking-wider mb-1.5">
            Residential Address (for Agreement Schedule):
          </label>
          <input
            type="text"
            value={buyer.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
            placeholder="Door No, Street, Layout, Area, City, State, PIN"
          />
        </div>
      </div>

      {/* Dynamic Conditional Fields based on Entity */}
      {buyer.entityType === "joint" && (
        <div className="p-4 bg-[#FAF7F2] border border-[#DECFC0] rounded-xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-[#7D1826]">Co-Buyer / Joint Purchaser Details:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C4A4D] mb-1">Co-Buyer Full Name:</label>
              <input
                type="text"
                value={buyer.coBuyerName || ""}
                onChange={(e) => handleFieldChange("coBuyerName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#DECFC0] rounded-xl bg-white text-[#24060B]"
                placeholder="e.g. PRIYA KANTHARAJU"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C4A4D] mb-1">Relationship / Role:</label>
              <input
                type="text"
                value={buyer.relationship || ""}
                onChange={(e) => handleFieldChange("relationship", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#DECFC0] rounded-xl bg-white text-[#24060B]"
                placeholder="Wife / Co-purchaser"
              />
            </div>
          </div>
        </div>
      )}

      {buyer.entityType === "nri_gpa" && (
        <div className="p-4 bg-[#FFF9EE] border border-[#F2E4C4] rounded-xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-[#B88E3E]">Power of Attorney (GPA) Representation:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C4A4D] mb-1">GPA Holder Name:</label>
              <input
                type="text"
                value={buyer.gpaHolderName || ""}
                onChange={(e) => handleFieldChange("gpaHolderName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#F2E4C4] rounded-xl bg-white text-[#24060B]"
                placeholder="e.g. SURESH MARIYAPPA"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C4A4D] mb-1">Registered GPA Doc No:</label>
              <input
                type="text"
                value={buyer.gpaDocumentNumber || ""}
                onChange={(e) => handleFieldChange("gpaDocumentNumber", e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-[#F2E4C4] rounded-xl bg-white text-[#24060B]"
                placeholder="BK-IV/1234/2026-27"
              />
            </div>
          </div>
        </div>
      )}

      {buyer.entityType === "company" && (
        <div className="p-4 bg-[#FAF0F2] border border-[#F0D5D9] rounded-xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-[#7D1826]">Corporate Signatory &amp; Board Authorization:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C4A4D] mb-1">Authorized Signatory:</label>
              <input
                type="text"
                value={buyer.authorizedSignatoryName || ""}
                onChange={(e) => handleFieldChange("authorizedSignatoryName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#F0D5D9] rounded-xl bg-white text-[#24060B]"
                placeholder="Signatory Name"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C4A4D] mb-1">Designation:</label>
              <input
                type="text"
                value={buyer.designation || ""}
                onChange={(e) => handleFieldChange("designation", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#F0D5D9] rounded-xl bg-white text-[#24060B]"
                placeholder="Director / Partner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
