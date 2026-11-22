"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Car, Camera, Upload, Download, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { MOCK_PARKING_SLOTS, MOCK_UNITS } from "@/lib/mockData";
import { ParkingSlot, UnitInventory } from "@/lib/types";

export default function ParkingDashboardPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>(MOCK_PARKING_SLOTS);
  const [activeLevel, setActiveLevel] = useState<"Basement 1" | "Basement 2">("Basement 1");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrResults, setOcrResults] = useState<any[] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter slots for active basement level
  const currentSlots = slots.filter((s) => s.level === activeLevel);
  const availableCount = currentSlots.filter((s) => s.status === "available").length;
  const allottedCount = currentSlots.filter((s) => s.status === "allotted").length;
  const reservedCount = currentSlots.filter((s) => s.status === "reserved").length;

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    if (slot.status === "available") {
      setNotification(`Selected Slot ${slot.slotNumber}. Click "Draft Allotment Letter" to auto-fill.`);
    } else if (slot.status === "allotted") {
      setNotification(`Slot ${slot.slotNumber} is locked to Flat ${slot.allottedUnitFlat}. Swapping will stage a Change Request.`);
    }
  };

  const handleSimulateSwapRequest = (slot: ParkingSlot) => {
    const targetFlat = prompt(`Enter Flat Number to reassign slot ${slot.slotNumber} to:`, "B-104");
    if (!targetFlat) return;

    setNotification(`Change request staged for Slot ${slot.slotNumber} -> Flat ${targetFlat}. Sent to Diff Review Queue.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRegisterOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsProcessingOcr(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/ocr/register-sheet", { method: "POST", body: formData });
      const data = await res.json();
      setOcrResults(data.rows || []);
      setNotification(`Photocopy Register OCR extracted ${data.rows?.length || 0} rows.`);
    } catch {
      setNotification("Failed to parse register sheet.");
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const handleExportParkingCsv = () => {
    const headers = "SlotNumber,Level,Type,Status,AllottedFlat,Notes\n";
    const rows = slots
      .map((s) => `${s.slotNumber},${s.level},${s.slotType},${s.status},${s.allottedUnitFlat || ""},${s.notes || ""}`)
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sobha_Royal_Pavilion_${activeLevel.replace(" ", "_")}_Slots.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Three-Way Modes Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E] animate-pulse" />
            <span>Cadastral Parking Engine (UC-05)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Three-Way Basement Parking Lot Studio
          </h1>
          <p className="text-xs text-[#5C4A4D] mt-0.5">
            Synchronized across Visual CAD Grid, Physical Photocopy Register Vision OCR, and Excel Bulk Sync.
          </p>
        </div>

        {/* 3 Synchronization Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode 2: Photocopy Register OCR */}
          <label className="px-3.5 py-2 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors">
            <Camera className="w-3.5 h-3.5 text-[#7D1826]" />
            <span>Upload Register Scan / Photo</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleRegisterOcrUpload}
            />
          </label>

          {/* Mode 3: Excel Export/Sync */}
          <button
            onClick={handleExportParkingCsv}
            className="px-3.5 py-2 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#5C4A4D]" />
            <span>Export .CSV Sheet</span>
          </button>

          {/* Link to Diff Approvals */}
          <Link
            href="/dashboard/approvals"
            className="px-3.5 py-2 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <span>Review Diff Queue</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4B989]" />
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-[#FFFDFB] border border-[#DECFC0] text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* OCR Results Staging Drawer if active */}
      {ocrResults && (
        <div className="p-5 bg-[#FAF7F2] border border-[#DECFC0] rounded-2xl space-y-4 animate-fade-in shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#24060B] font-serif">
              <Camera className="w-4 h-4 text-[#7D1826]" />
              <span>Physical Register Vision OCR Staging Grid ({ocrResults.length} Rows)</span>
            </div>
            <button
              onClick={() => setOcrResults(null)}
              className="text-xs text-[#7D1826] hover:underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white rounded-xl border border-[#DECFC0] overflow-hidden">
              <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
                <tr>
                  <th className="px-4 py-2">Flat #</th>
                  <th className="px-4 py-2">Detected Slot</th>
                  <th className="px-4 py-2">Level</th>
                  <th className="px-4 py-2">Allottee Name</th>
                  <th className="px-4 py-2">Routing Determination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DD] font-mono">
                {ocrResults.map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAF7F2]">
                    <td className="px-4 py-2.5 font-bold text-[#24060B]">{row.flatNumber}</td>
                    <td className="px-4 py-2.5 text-[#7D1826] font-bold">{row.slotNumber}</td>
                    <td className="px-4 py-2.5 text-[#5C4A4D]">{row.level}</td>
                    <td className="px-4 py-2.5 font-sans text-[#24060B]">{row.ownerName}</td>
                    <td className="px-4 py-2.5 font-sans">
                      {row.status === "existing_allotted" && (
                        <span className="text-[10px] font-semibold text-[#5C4A4D] bg-[#F8F2EC] px-2 py-0.5 rounded border border-[#E8DFD3]">
                          Already Committed
                        </span>
                      )}
                      {row.status === "new_assignment" && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Direct Commit (New)
                        </span>
                      )}
                      {row.status === "conflict_swap_needed" && (
                        <span className="text-[10px] font-semibold text-[#B88E3E] bg-[#FFF9EE] px-2 py-0.5 rounded border border-[#F2E4C4]">
                          Staged to Diff Queue
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 1: INTERACTIVE VISUAL CAD BASEMENT GRID */}
      <div className="glossy-card bg-[#FFFDFB] p-6 sm:p-8 rounded-2xl border border-[#DECFC0] shadow-xs space-y-6">
        {/* Level Switcher & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E8DD] pb-5">
          {/* Level Switcher Tabs */}
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#F8F2EC] border border-[#DECFC0] text-xs">
            {(["Basement 1", "Basement 2"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setActiveLevel(lvl);
                  setSelectedSlot(null);
                }}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activeLevel === lvl
                    ? "bg-[#821A2A] text-white shadow-xs font-bold"
                    : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-white/60"
                }`}
              >
                {lvl} {lvl === "Basement 1" ? "(Upper)" : "(Lower)"}
              </button>
            ))}
          </div>

          {/* Color-Coded Status Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600" />
              <span className="font-semibold text-[#5C4A4D]">Available ({availableCount})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#B88E3E]" />
              <span className="font-semibold text-[#5C4A4D]">Reserved ({reservedCount})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#821A2A]" />
              <span className="font-semibold text-[#5C4A4D]">Allotted ({allottedCount})</span>
            </span>
          </div>
        </div>

        {/* CAD Grid Canvas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {currentSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAllotted = slot.status === "allotted";
            const isReserved = slot.status === "reserved";
            const isAvailable = slot.status === "available";

            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`p-3.5 rounded-xl border flex flex-col justify-between h-32 select-none relative group transition-all cursor-pointer ${
                  isAvailable
                    ? "bg-emerald-50/40 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100/50"
                    : isReserved
                    ? "bg-[#FFF9EE] border-[#F2E4C4] hover:border-[#B88E3E]"
                    : "bg-[#FAF7F2] border-[#DECFC0] hover:border-[#8C777A]"
                } ${
                  isSelected ? "ring-3 ring-[#821A2A] ring-offset-2 border-transparent shadow-md" : ""
                }`}
              >
                {/* Header: Slot No & Level */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm tracking-tight text-[#24060B]">
                    {slot.slotNumber}
                  </span>
                  {slot.slotType === "Covered EV-Ready" && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#B88E3E] text-white">
                      EV
                    </span>
                  )}
                </div>

                {/* Status Indicator & Flat Association */}
                <div className="my-1">
                  {isAllotted ? (
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#24060B] flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#821A2A] shrink-0" />
                        <span className="truncate">Flat {slot.allottedUnitFlat}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8C777A] block">Locked</span>
                    </div>
                  ) : isReserved ? (
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#B88E3E] flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#B88E3E] shrink-0" />
                        <span>Token Hold</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#A88C40] block">Pending KYC</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-800 flex items-center space-x-1">
                        <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Available</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 block">Click to Select</span>
                    </div>
                  )}
                </div>

                {/* Footer: Type & Dimensions */}
                <div className="border-t border-[#DECFC0]/60 pt-1 flex items-center justify-between text-[10px] font-mono text-[#8C777A]">
                  <span className="truncate">{slot.slotType}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Slot Action Drawer */}
        {selectedSlot && (
          <div className="p-5 bg-[#FAF7F2] border border-[#DECFC0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-base text-[#24060B]">
                  Selected Slot {selectedSlot.slotNumber}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-white border border-[#DECFC0] text-[#5C4A4D]">
                  {selectedSlot.level} • {selectedSlot.slotType}
                </span>
              </div>
              <p className="text-xs text-[#5C4A4D]">
                {selectedSlot.status === "available"
                  ? "This slot is in builder open inventory. Ready for immediate allotment."
                  : `Currently allotted to Flat ${selectedSlot.allottedUnitFlat}. Swapping requires Maker-Checker sign-off.`}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {selectedSlot.status === "available" ? (
                <Link
                  href={`/dashboard/draft/new?slot=${selectedSlot.slotNumber}&level=${selectedSlot.level}`}
                  className="px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#D4B989]" />
                  <span>Draft Allotment Letter</span>
                </Link>
              ) : (
                <button
                  onClick={() => handleSimulateSwapRequest(selectedSlot)}
                  className="px-4 py-2.5 bg-[#B88E3E] hover:bg-[#9E782E] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Stage Slot Swap Request</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
