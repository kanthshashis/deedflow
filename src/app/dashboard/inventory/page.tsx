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
          <h1 className="text-xl font-bold text-obsidian tracking-tight">Master Flat &amp; Unit Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule C &amp; D property descriptions, boundary limits, and RERA carpet areas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <label className="cursor-pointer px-3 py-1.5 bg-obsidian hover:bg-obsidian-hover text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
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
      <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flat number e.g. B-101..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 border border-border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
          />
        </div>

        <span className="text-xs text-slate-500 font-mono">Showing {filteredUnits.length} units</span>
      </div>

      {/* Table of Units */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Flat #</th>
                <th className="px-4 py-3">Tower &amp; Floor</th>
                <th className="px-4 py-3">Configuration</th>
                <th className="px-4 py-3">Carpet / SBA</th>
                <th className="px-4 py-3">UDS</th>
                <th className="px-4 py-3">Base Price</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold font-mono text-obsidian">{unit.flatNumber}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {unit.tower} • Floor {unit.floorNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{unit.unitType}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="font-semibold">{unit.carpetAreaSqFt}</span> / {unit.superBuiltUpAreaSqFt} sq.ft
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{unit.undividedShareLandSqFt} sq.ft</td>
                  <td className="px-4 py-3 font-bold font-mono text-slate-900">
                    {formatIndianCurrency(unit.basePrice)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        unit.status === "available" && "bg-slate-100 text-slate-700",
                        unit.status === "sold" && "bg-emerald-100 text-emerald-800",
                        unit.status === "booked" && "bg-amber-100 text-amber-800"
                      )}
                    >
                      {unit.status}
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
