"use client";

import React, { useState } from "react";
import { KycUploadZone } from "@/components/generator/KycUploadZone";
import { BuyerDetailsForm } from "@/components/generator/BuyerDetailsForm";
import { UnitSelector } from "@/components/generator/UnitSelector";
import { BankKitBundler } from "@/components/generator/BankKitBundler";
import {
  MOCK_PROJECT,
  MOCK_UNITS,
  MOCK_PARKING_SLOTS,
  SAMPLE_BUYER,
} from "@/lib/mockData";
import { BuyerProfile, KycExtractionResult, UnitInventory, ParkingSlot } from "@/lib/types";

export default function GeneratePage() {
  const [buyer, setBuyer] = useState<BuyerProfile>(SAMPLE_BUYER);
  const [selectedUnit, setSelectedUnit] = useState<UnitInventory>(MOCK_UNITS[0]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot>(MOCK_PARKING_SLOTS[1]); // B1-02 available

  const handleKycExtracted = (result: KycExtractionResult) => {
    setBuyer((prev) => ({
      ...prev,
      fullName: result.fullName || prev.fullName,
      panNumber: result.documentType === "PAN" ? result.idNumber : prev.panNumber,
      aadhaarNumberMasked: result.documentType === "AADHAAR" ? result.idNumber : prev.aadhaarNumberMasked,
      address: result.address || prev.address,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
          <span className="w-3 h-[2px] bg-emerald-600 rounded-full" />
          <span>Document Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          1-Click Home Loan Bank Kit Studio<span className="text-emerald-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Generate Car Parking Allotment + Builder Home Loan NOC + Unit Cost Sheet from KYC in 15 seconds.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: KYC Upload Dropzone */}
        <KycUploadZone onExtracted={handleKycExtracted} />

        {/* Step 2: Verified Buyer Details Form & Smart Grammar */}
        <BuyerDetailsForm buyer={buyer} onChange={setBuyer} />

        {/* Step 3: Flat & Parking Unit Association */}
        <UnitSelector
          units={MOCK_UNITS}
          slots={MOCK_PARKING_SLOTS}
          selectedUnitId={selectedUnit.id}
          selectedSlotId={selectedSlot.id}
          onSelectUnit={setSelectedUnit}
          onSelectSlot={setSelectedSlot}
        />

        {/* Step 4: 1-Click Bank Kit Bundler & WhatsApp Link */}
        <BankKitBundler
          input={{
            project: MOCK_PROJECT,
            unit: selectedUnit,
            slot: selectedSlot,
            buyer,
            parkingFee: 350000,
            bankName: "State Bank of India",
            bankBranch: "Sarjapur Road Branch, Bengaluru",
            isDraft: true,
          }}
        />
      </div>
    </div>
  );
}
