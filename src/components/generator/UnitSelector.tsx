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
    <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
      <div className="border-b border-[#F0E8DD] pb-4">
        <h3 className="text-base font-bold font-serif text-[#24060B]">Unit &amp; Dedicated Parking Bay Allocation</h3>
        <p className="text-xs text-[#5C4A4D]">Auto-injects boundary schedules and RERA area computations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Flat Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#5C4A4D] uppercase tracking-wider flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#7D1826]" />
            <span>Select Flat / Unit:</span>
          </label>
          <select
            value={selectedUnitId}
            onChange={(e) => {
              const u = units.find((item) => item.id === e.target.value);
              if (u) onSelectUnit(u);
            }}
            className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Flat {u.flatNumber} ({u.tower} • Floor {u.floorNumber} • {u.unitType})
              </option>
            ))}
          </select>

          {/* Unit Specs Quick Grid */}
          {currentUnit && (
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] text-xs grid grid-cols-3 gap-2">
              <div>
                <span className="text-[#8C777A] block text-[10px] font-mono">SBA:</span>
                <span className="font-bold text-[#24060B]">{currentUnit.superBuiltUpAreaSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-[#8C777A] block text-[10px] font-mono">CARPET:</span>
                <span className="font-bold text-[#24060B]">{currentUnit.carpetAreaSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-[#8C777A] block text-[10px] font-mono">UDS:</span>
                <span className="font-bold text-[#7D1826]">{currentUnit.undividedShareLandSqFt} sq.ft</span>
              </div>
              <div className="col-span-3 pt-2 border-t border-[#DECFC0] flex justify-between items-center">
                <span className="text-[#5C4A4D]">Base Price:</span>
                <span className="font-bold font-mono text-[#24060B] text-sm">
                  {formatIndianCurrency(currentUnit.basePrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Parking Bay Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#5C4A4D] uppercase tracking-wider flex items-center space-x-2">
            <Car className="w-4 h-4 text-[#7D1826]" />
            <span>Dedicated Car Parking Bay:</span>
          </label>
          <select
            value={selectedSlotId}
            onChange={(e) => {
              const s = slots.find((item) => item.id === e.target.value);
              if (s) onSelectSlot(s);
            }}
            className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#DECFC0] rounded-xl bg-white text-[#24060B] focus:outline-none focus:border-[#4A0E17]"
          >
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                Bay {s.slotNumber} ({s.level} • {s.slotType} • {s.status.toUpperCase()})
              </option>
            ))}
          </select>

          {/* Slot Specs */}
          {currentSlot && (
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#5C4A4D]">Basement Level:</span>
                <span className="font-bold text-[#24060B]">{currentSlot.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C4A4D]">Bay Category:</span>
                <span className="font-bold text-[#7D1826]">{currentSlot.slotType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DECFC0] items-center">
                <span className="text-[#5C4A4D]">Allotment Fee:</span>
                <span className="font-bold font-mono text-[#24060B] text-sm">
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
