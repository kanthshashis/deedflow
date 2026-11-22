"use client";

import React from "react";
import { UnitInventory, ParkingSlot } from "@/lib/types";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";
import { Building, Car } from "lucide-react";

interface UnitSelectorProps {
  units: UnitInventory[];
  slots: ParkingSlot[];
  selectedUnitId: string;
  selectedSlotId: string;
  onSelectUnit: (unit: UnitInventory) => void;
  onSelectSlot: (slot: ParkingSlot) => void;
}

export function UnitSelector({
  units,
  slots,
  selectedUnitId,
  selectedSlotId,
  onSelectUnit,
  onSelectSlot,
}: UnitSelectorProps) {
  const currentUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const currentSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">Unit &amp; Dedicated Parking Bay Allocation</h3>
        <p className="text-xs text-slate-500">Auto-injects boundary schedules and RERA area computations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Flat Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Select Flat / Unit:</span>
          </label>
          <select
            value={selectedUnitId}
            onChange={(e) => {
              const u = units.find((item) => item.id === e.target.value);
              if (u) onSelectUnit(u);
            }}
            className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Flat {u.flatNumber} ({u.tower} • Floor {u.floorNumber} • {u.unitType})
              </option>
            ))}
          </select>

          {/* Unit Specs Quick Grid */}
          {currentUnit && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E5E7EB] text-xs grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">SBA:</span>
                <span className="font-bold text-slate-900">{currentUnit.superBuiltUpAreaSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">CARPET:</span>
                <span className="font-bold text-slate-900">{currentUnit.carpetAreaSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">UDS:</span>
                <span className="font-bold text-indigo-700">{currentUnit.undividedShareLandSqFt} sq.ft</span>
              </div>
              <div className="col-span-3 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-500">Base Price:</span>
                <span className="font-bold font-mono text-emerald-700 text-sm">
                  {formatIndianCurrency(currentUnit.basePrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Parking Bay Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Dedicated Car Parking Bay:</span>
          </label>
          <select
            value={selectedSlotId}
            onChange={(e) => {
              const s = slots.find((item) => item.id === e.target.value);
              if (s) onSelectSlot(s);
            }}
            className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#E5E7EB] rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
          >
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                Bay {s.slotNumber} ({s.level} • {s.slotType} • {s.status.toUpperCase()})
              </option>
            ))}
          </select>

          {/* Slot Specs */}
          {currentSlot && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E5E7EB] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Basement Level:</span>
                <span className="font-bold text-slate-900">{currentSlot.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bay Category:</span>
                <span className="font-bold text-indigo-700">{currentSlot.slotType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 items-center">
                <span className="text-slate-500">Allotment Fee:</span>
                <span className="font-bold font-mono text-emerald-700 text-sm">
                  {formatIndianCurrency(350000)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
