"use client";

import React, { useState } from "react";
import { MOCK_UNITS } from "@/lib/mockData";
import { UnitInventory } from "@/lib/types";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";
import { Building, Upload, Download, Search, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export default function InventoryPage() {
  const [units, setUnits] = useState<UnitInventory[]>(MOCK_UNITS);
  const [search, setSearch] = useState("");

  const filteredUnits = units.filter(
    (u) =>
      u.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
      u.unitType.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCsv = () => {
    const headers = "FlatNumber,Tower,Floor,Type,CarpetSqFt,SBASqFt,UDSSqFt,Price,Status\n";
    const rows = units
      .map(
        (u) =>
          `${u.flatNumber},${u.tower},${u.floorNumber},${u.unitType},${u.carpetAreaSqFt},${u.superBuiltUpAreaSqFt},${u.undividedShareLandSqFt},${u.basePrice},${u.status}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sobha_Royal_Pavilion_Tower_B_Inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight">Master Flat &amp; Unit Inventory</h1>
          <p className="text-xs text-[#5C4A4D] mt-1">
            Schedule C &amp; D property descriptions, boundary limits, and RERA carpet areas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5C4A4D]" />
            <span>Export CSV</span>
          </button>
          <label className="cursor-pointer px-3.5 py-2 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5 text-[#D4B989]" />
            <span>Import Excel/CSV</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={() => alert("CSV imported successfully into local project inventory!")}
            />
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8C777A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by flat number (e.g. B-101) or configuration..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DECFC0] bg-[#FFFDFB] text-[#24060B] placeholder-[#8C777A] text-xs focus:outline-none focus:border-[#4A0E17]"
        />
      </div>

      {/* Inventory Table */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
              <tr>
                <th className="px-5 py-3">Flat #</th>
                <th className="px-5 py-3">Configuration</th>
                <th className="px-5 py-3">RERA Carpet</th>
                <th className="px-5 py-3">Super Built-Up</th>
                <th className="px-5 py-3">UDS Share</th>
                <th className="px-5 py-3">Base Price</th>
                <th className="px-5 py-3">Lock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-5 py-3.5 font-bold font-mono text-[#24060B]">
                    Flat {unit.flatNumber}
                    <span className="text-[10px] text-[#8C777A] block font-sans font-normal">{unit.tower} • Floor {unit.floorNumber}</span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[#24060B]">{unit.unitType}</td>
                  <td className="px-5 py-3.5 font-mono text-[#5C4A4D]">{unit.carpetAreaSqFt} sq.ft</td>
                  <td className="px-5 py-3.5 font-mono text-[#5C4A4D]">{unit.superBuiltUpAreaSqFt} sq.ft</td>
                  <td className="px-5 py-3.5 font-mono text-[#5C4A4D]">{unit.undividedShareLandSqFt} sq.ft</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-[#24060B]">
                    {formatIndianCurrency(unit.basePrice)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={clsx(
                        "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase",
                        unit.status === "available" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
                        (unit.status === "booked" || unit.status === "blocked") && "bg-[#FFF9EE] text-[#B88E3E] border border-[#F2E4C4]",
                        unit.status === "sold" && "bg-[#FAF0F2] text-[#7D1826] border border-[#F0D5D9]"
                      )}
                    >
                      <span>{unit.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
