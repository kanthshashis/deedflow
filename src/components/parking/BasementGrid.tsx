"use client";

import React, { useState } from "react";
import { ParkingSlot, UnitInventory } from "@/lib/types";
import { SlotDrawer } from "./SlotDrawer";
import { Car, CheckCircle2, Clock, Ban, Search, ShieldCheck } from "lucide-react";
import clsx from "clsx";

interface BasementGridProps {
  initialSlots: ParkingSlot[];
  units: UnitInventory[];
}

export function BasementGrid({ initialSlots, units }: BasementGridProps) {
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [activeLevel, setActiveLevel] = useState<"Basement 1" | "Basement 2">("Basement 1");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredSlots = slots.filter((slot) => {
    if (slot.level !== activeLevel) return false;
    if (statusFilter !== "all" && slot.status !== statusFilter) return false;
    if (searchQuery && !slot.slotNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const availableCount = slots.filter((s) => s.status === "available").length;
  const allottedCount = slots.filter((s) => s.status === "allotted").length;
  const reservedCount = slots.filter((s) => s.status === "reserved").length;

  const handleAllotSlot = async (slotNumber: string, flatNumber: string) => {
    const targetSlot = slots.find((s) => s.slotNumber === slotNumber);

    const response = await fetch("/api/parking/allot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotNumber,
        flatNumber,
        currentSlotStatus: targetSlot?.status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to allot slot");
    }

    setSlots((prev) =>
      prev.map((s) =>
        s.slotNumber === slotNumber
          ? { ...s, status: "allotted", allottedUnitFlat: flatNumber }
          : s
      )
    );

    setToastMessage(`Bay ${slotNumber} allotted to Flat ${flatNumber} successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-black">
            ×
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Bays</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{slots.length}</p>
        </div>
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-xs text-emerald-700 font-medium flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Allotted</span>
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">{allottedCount}</p>
        </div>
        <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-xs text-sky-700 font-medium flex items-center space-x-1">
            <Car className="w-3.5 h-3.5" />
            <span>Available</span>
          </span>
          <p className="text-2xl font-bold font-mono text-sky-800 mt-1">{availableCount}</p>
        </div>
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-xs text-amber-700 font-medium flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Reserved</span>
          </span>
          <p className="text-2xl font-bold font-mono text-amber-800 mt-1">{reservedCount}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Level Toggles */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {(["Basement 1", "Basement 2"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={clsx(
                "px-4 py-2 text-xs font-semibold rounded-lg spring-snap transition-all",
                activeLevel === level
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Filter and Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bay #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="allotted">Allotted</option>
            <option value="reserved">Reserved</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Visual Parking Bay Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">{activeLevel} Architectural Layout</h2>
            <span className="text-xs text-emerald-600 font-mono font-semibold">({filteredSlots.length} bays shown)</span>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" />
              <span>Available</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span>Allotted</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-amber-400" />
              <span>Reserved</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-slate-400" />
              <span>Pillar</span>
            </span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {filteredSlots.map((slot) => {
            const isAllotted = slot.status === "allotted";
            const isReserved = slot.status === "reserved";
            const isBlocked = slot.status === "blocked";

            return (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={clsx(
                  "relative group cursor-pointer p-4 rounded-xl border text-left spring-snap flex flex-col justify-between h-28 select-none shadow-2xs transition-all",
                  slot.status === "available" &&
                    "bg-slate-50/50 border-[#E5E7EB] hover:border-emerald-600 hover:bg-emerald-50/30 hover:shadow-sm",
                  isAllotted && "bg-emerald-50/70 border-emerald-200 hover:border-emerald-500",
                  isReserved && "bg-amber-50/70 border-amber-200 hover:border-amber-500",
                  isBlocked && "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                )}
              >
                {/* Top: Slot number and type badge */}
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 tracking-tight">
                    {slot.slotNumber}
                  </span>
                  <span
                    className={clsx(
                      "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider",
                      isAllotted && "bg-emerald-100 text-emerald-800",
                      isReserved && "bg-amber-100 text-amber-800",
                      isBlocked && "bg-slate-200 text-slate-600",
                      slot.status === "available" && "bg-slate-100 text-slate-500"
                    )}
                  >
                    {slot.status}
                  </span>
                </div>

                {/* Center: Flat association */}
                <div className="my-1">
                  {isAllotted ? (
                    <div className="flex items-center space-x-1 text-emerald-800 font-bold text-xs truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Flat {slot.allottedUnitFlat}</span>
                    </div>
                  ) : isReserved ? (
                    <div className="flex items-center space-x-1 text-amber-800 text-[11px] truncate font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Token Hold</span>
                    </div>
                  ) : isBlocked ? (
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      <Ban className="w-3.5 h-3.5 shrink-0" />
                      <span>Pillar</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-slate-400 group-hover:text-emerald-700 text-[11px] font-medium">
                      <Car className="w-3.5 h-3.5 shrink-0" />
                      <span>Ready to Allot</span>
                    </div>
                  )}
                </div>

                {/* Bottom: Bay type label */}
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {slot.slotType}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ergonomic Mobile Drawer */}
      <SlotDrawer
        slot={selectedSlot}
        units={units}
        isOpen={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        onAllot={handleAllotSlot}
      />
    </div>
  );
}
