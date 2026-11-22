import React from "react";
import { BasementGrid } from "@/components/parking/BasementGrid";
import { MOCK_PARKING_SLOTS, MOCK_UNITS } from "@/lib/mockData";

export default function ParkingPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
          <span className="w-3 h-[2px] bg-emerald-600 rounded-full" />
          <span>Cadastral Inventory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Interactive Basement Parking Grid<span className="text-emerald-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Visual inventory for Basement 1 and Basement 2. Real-time slot locking prevents double allotments.
        </p>
      </div>

      <BasementGrid
        initialSlots={MOCK_PARKING_SLOTS}
        units={MOCK_UNITS}
      />
    </div>
  );
}
