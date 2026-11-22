"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_UNITS } from "@/lib/mockData";
import { UnitInventory, UserRole, hasPermission } from "@/lib/types";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";
import {
  Building2,
  Upload,
  Download,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  FileText,
  AlertCircle,
  Filter,
  Plus,
  X,
  FileSpreadsheet,
  ShieldCheck,
  FileArchive,
} from "lucide-react";
import clsx from "clsx";

export default function InventoryPage() {
  const [units, setUnits] = useState<UnitInventory[]>(MOCK_UNITS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [importNotification, setImportNotification] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>("project_admin");
  const [perspectiveRole, setPerspectiveRole] = useState<UserRole | "omni">("omni");

  const syncRole = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("deedflow_active_role") as UserRole | null;
      if (stored) setCurrentRole(stored);
      const storedPerspective = localStorage.getItem("deedflow_perspective_role") as (UserRole | "omni") | null;
      if (storedPerspective) setPerspectiveRole(storedPerspective);
      else setPerspectiveRole("omni");
    }
  };

  useEffect(() => {
    syncRole();
    const handleRoleChanged = () => syncRole();
    window.addEventListener("deedflow_role_changed", handleRoleChanged);
    window.addEventListener("storage", handleRoleChanged);
    return () => {
      window.removeEventListener("deedflow_role_changed", handleRoleChanged);
      window.removeEventListener("storage", handleRoleChanged);
    };
  }, []);

  const effectiveRole: UserRole =
    (currentRole === "project_admin" || currentRole === "super_admin") && perspectiveRole !== "omni"
      ? perspectiveRole
      : currentRole;

  const isBankAuditor = effectiveRole === "bank_auditor";
  const canManageInventory = hasPermission(effectiveRole, "manage_inventory");

  // New Single Unit Modal
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [newFlatNumber, setNewFlatNumber] = useState("");
  const [newUnitType, setNewUnitType] = useState("3 BHK Luxury");
  const [newFloor, setNewFloor] = useState(1);
  const [newCarpet, setNewCarpet] = useState(1280);
  const [newSba, setNewSba] = useState(1650);
  const [newBasePrice, setNewBasePrice] = useState(8800000);

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
      u.unitType.toLowerCase().includes(search.toLowerCase()) ||
      (u.allottee?.fullName && u.allottee.fullName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Real in-browser CSV / Excel parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          alert("File is empty or missing headers.");
          return;
        }

        const headerLine = lines[0].toLowerCase();
        const headers = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

        const flatIdx = headers.findIndex((h) => h.includes("flat") || h.includes("unit") || h.includes("door"));
        const towerIdx = headers.findIndex((h) => h.includes("tower") || h.includes("block") || h.includes("wing"));
        const floorIdx = headers.findIndex((h) => h.includes("floor"));
        const typeIdx = headers.findIndex((h) => h.includes("type") || h.includes("config") || h.includes("bhk"));
        const carpetIdx = headers.findIndex((h) => h.includes("carpet"));
        const sbaIdx = headers.findIndex((h) => h.includes("sba") || h.includes("super"));
        const udsIdx = headers.findIndex((h) => h.includes("uds"));
        const priceIdx = headers.findIndex((h) => h.includes("price") || h.includes("cost") || h.includes("value"));
        const statusIdx = headers.findIndex((h) => h.includes("status"));

        const parsedUnits: UnitInventory[] = [];

        for (let i = 1; i < lines.length; i++) {
          const rawRow = lines[i];
          const row = rawRow.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => v.trim().replace(/^["']|["']$/g, ""));

          if (row.length === 0 || !row[flatIdx !== -1 ? flatIdx : 0]) continue;

          const flatNumber = flatIdx !== -1 ? row[flatIdx] : `Unit-${i}`;
          const tower = towerIdx !== -1 ? row[towerIdx] : "Tower B";
          const floorNumber = floorIdx !== -1 ? parseInt(row[floorIdx], 10) || 1 : Math.floor(i / 4) + 1;
          const unitType = typeIdx !== -1 ? row[typeIdx] : "3 BHK Luxury";
          const carpetAreaSqFt = carpetIdx !== -1 ? parseFloat(row[carpetIdx]) || 1200 : 1250;
          const superBuiltUpAreaSqFt = sbaIdx !== -1 ? parseFloat(row[sbaIdx]) || 1600 : 1625;
          const undividedShareLandSqFt = udsIdx !== -1 ? parseFloat(row[udsIdx]) || 400 : Math.round(superBuiltUpAreaSqFt * 0.25);
          const basePrice = priceIdx !== -1 ? parseFloat(row[priceIdx].replace(/[^0-9.]/g, "")) || 8500000 : 8500000;
          const statusRaw = statusIdx !== -1 ? row[statusIdx].toLowerCase() : "available";
          const status = (statusRaw.includes("sold") ? "sold" : statusRaw.includes("book") ? "booked" : "available") as any;

          parsedUnits.push({
            id: `unit-import-${i}-${Date.now()}`,
            flatNumber,
            tower,
            floorNumber,
            unitType,
            carpetAreaSqFt,
            superBuiltUpAreaSqFt,
            undividedShareLandSqFt,
            basePrice,
            status,
            northBoundary: "Internal Corridor",
            southBoundary: "Open to Sky / Landscape",
            eastBoundary: "Adjacent Apartment",
            westBoundary: "Service Core & Staircase",
          });
        }

        if (parsedUnits.length > 0) {
          setUnits(parsedUnits);
          setImportNotification(`Successfully parsed & loaded ${parsedUnits.length} units from ${file.name}!`);
          setTimeout(() => setImportNotification(null), 5000);
        }
      } catch (err: any) {
        alert(`Failed to parse file: ${err.message || String(err)}`);
      }
    };

    reader.readAsText(file);
  };

  const handleExportCsv = () => {
    const headers = "FlatNumber,Tower,Floor,Type,CarpetSqFt,SBASqFt,UDSSqFt,Price,Status\n";
    const rows = units
      .map(
        (u) =>
          `${u.flatNumber},${u.tower},${u.floorNumber},"${u.unitType}",${u.carpetAreaSqFt},${u.superBuiltUpAreaSqFt},${u.undividedShareLandSqFt},${u.basePrice},${u.status}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sobha_Royal_Pavilion_Master_Inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleCsv = () => {
    const sample = `FlatNumber,Tower,Floor,Type,CarpetSqFt,SBASqFt,UDSSqFt,Price,Status
B-101,Tower B,1,3 BHK Luxury,1280,1650,412,8800000,booked
B-102,Tower B,1,2 BHK Comfort,920,1220,305,6500000,available
B-103,Tower B,1,3 BHK + Study,1450,1890,472,10500000,available
B-201,Tower B,2,3 BHK Luxury,1280,1650,412,8900000,available
B-202,Tower B,2,2 BHK Comfort,920,1220,305,6550000,sold
B-301,Tower B,3,4 BHK Presidential,2100,2850,712,18500000,booked`;

    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "DeedFlow_Sample_Tower_Inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSingleUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlatNumber.trim()) return;

    const newUnit: UnitInventory = {
      id: `unit-manual-${Date.now()}`,
      flatNumber: newFlatNumber.trim().toUpperCase(),
      tower: "Tower B",
      floorNumber: Number(newFloor),
      unitType: newUnitType,
      carpetAreaSqFt: Number(newCarpet),
      superBuiltUpAreaSqFt: Number(newSba),
      undividedShareLandSqFt: Math.round(Number(newSba) * 0.25),
      basePrice: Number(newBasePrice),
      status: "available",
      northBoundary: "Internal Corridor",
      southBoundary: "Open to Sky / Landscaped Courtyard",
      eastBoundary: "Adjacent Apartment",
      westBoundary: "Lift Core & Fire Staircase",
    };

    setUnits([newUnit, ...units]);
    setIsAddUnitOpen(false);
    setNewFlatNumber("");
    setImportNotification(`Added ${newUnit.flatNumber} to Tower B inventory!`);
    setTimeout(() => setImportNotification(null), 4000);
  };

  const totalInventoryValue = units.reduce((acc, u) => acc + u.basePrice, 0);
  const activeBookedUnits = units.filter((u) => u.status === "booked" || u.status === "sold").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#821A2A] uppercase">
            <span className="w-3 h-[2px] bg-[#821A2A] rounded-full" />
            <span>
              {isBankAuditor
                ? "Empaneled Bank Audit & Clearance Hub"
                : "Master Inventory & Post-Sales Hub"}
            </span>
            {isBankAuditor && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-amber-700" />
                <span>Read-Only Audit Mode</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            {isBankAuditor ? "Unit Dossiers (Bank Audit)" : "Unit Dossiers"}
            <span className="text-[#B88E3E]">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4A4D] mt-0.5">
            {isBankAuditor
              ? "Verify sanctioned plans, customer Aadhaar/PAN status, and export 1-Click Bank Kits for loan disbursement."
              : "Single source of truth for every flat: Buyer KYC, Parking allocation, and 2-Click Document Generation."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {!isBankAuditor && (
            <button
              onClick={handleDownloadSampleCsv}
              className="px-3 py-2.5 rounded-xl bg-white border border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Download example CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sample CSV</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="px-3 py-2.5 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#821A2A]/40 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#5C4A4D]" />
            <span>Export CSV</span>
          </button>

          {/* Import Sheet is restricted to Project Admin */}
          {canManageInventory && (
            <label className="cursor-pointer px-3.5 py-2.5 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-2xs transition-all">
              <Upload className="w-3.5 h-3.5 text-[#821A2A]" />
              <span>Import Sheet</span>
              <input
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}

          {/* Add Flat is restricted from Bank Auditor */}
          {!isBankAuditor && (
            <button
              onClick={() => setIsAddUnitOpen(true)}
              className="px-3.5 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4B989]" />
              <span>Add Single Flat</span>
            </button>
          )}

          {/* Bank Auditor Special CTA */}
          {isBankAuditor && (
            <button
              onClick={() => {
                alert("Downloading Master Bank Disbursal Batch Package (ZIP) for all approved units...");
              }}
              className="px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FileArchive className="w-3.5 h-3.5 text-[#D4B989]" />
              <span>Download Master Bank Kit (ZIP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Notification */}
      {importNotification && (
        <div className="bg-[#FFF9EE] border border-[#F2E4C4] text-[#821A2A] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{importNotification}</span>
          </div>
          <button
            onClick={() => setImportNotification(null)}
            className="text-[#8C777A] hover:text-[#24060B] text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Inventory Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-mono font-medium text-[#8C777A] uppercase tracking-wider block">Total Tower Units</span>
          <span className="text-2xl font-bold font-serif text-[#24060B] block mt-1">{units.length} Flats</span>
          <span className="text-[11px] text-[#5C4A4D] mt-0.5 block">Sobha Royal Pavilion</span>
        </div>

        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-mono font-medium text-[#8C777A] uppercase tracking-wider block">Active Buyer Dossiers</span>
          <span className="text-2xl font-bold font-serif text-[#821A2A] block mt-1">{activeBookedUnits} Allotted</span>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Documents Ready</span>
        </div>

        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-mono font-medium text-[#8C777A] uppercase tracking-wider block">Available for Sale</span>
          <span className="text-2xl font-bold font-serif text-[#24060B] block mt-1">{units.length - activeBookedUnits} Flats</span>
          <span className="text-[11px] text-[#5C4A4D] mt-0.5 block">Unallocated Bays</span>
        </div>

        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-mono font-medium text-[#8C777A] uppercase tracking-wider block">Total Project Value</span>
          <span className="text-2xl font-bold font-serif text-[#24060B] block mt-1">{formatIndianCurrency(totalInventoryValue)}</span>
          <span className="text-[11px] text-[#5C4A4D] mt-0.5 block">Sanctioned RERA Area</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C777A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flat number (e.g. B-101), buyer name, or unit type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DECFC0] bg-[#FFFDFB] text-[#24060B] placeholder-[#8C777A] text-xs focus:outline-none focus:border-[#821A2A] shadow-2xs"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-1.5 self-start sm:self-center">
          {["all", "available", "booked", "sold"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer",
                statusFilter === status
                  ? "bg-[#821A2A] text-white shadow-2xs"
                  : "bg-[#FFFDFB] text-[#5C4A4D] border border-[#DECFC0] hover:bg-[#FAF7F2]"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory & Dossier Table */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
              <tr>
                <th className="px-5 py-3.5 font-bold">Flat # &amp; Floor</th>
                <th className="px-4 py-3.5 font-bold">Configuration</th>
                <th className="px-4 py-3.5 font-bold">RERA Carpet</th>
                <th className="px-4 py-3.5 font-bold">UDS Share</th>
                <th className="px-4 py-3.5 font-bold">Base Consideration</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Post-Sales Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-[#FAF7F2] transition-colors group">
                  <td className="px-5 py-4 font-bold font-mono text-[#24060B]">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{unit.flatNumber}</span>
                    </div>
                    <span className="text-[11px] text-[#8C777A] block font-sans font-normal mt-0.5">
                      {unit.tower} • Floor {unit.floorNumber}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium text-[#24060B]">
                    {unit.unitType}
                    <span className="text-[10px] text-[#8C777A] block font-mono">{unit.superBuiltUpAreaSqFt} sq.ft SBA</span>
                  </td>

                  <td className="px-4 py-4 font-mono text-[#5C4A4D]">
                    {unit.carpetAreaSqFt} sq.ft
                  </td>

                  <td className="px-4 py-4 font-mono text-[#5C4A4D]">
                    {unit.undividedShareLandSqFt} sq.ft
                  </td>

                  <td className="px-4 py-4 font-mono font-bold text-[#24060B]">
                    {formatIndianCurrency(unit.basePrice)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase",
                        unit.status === "available" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
                        (unit.status === "booked" || unit.status === "blocked") && "bg-[#FFF9EE] text-[#B88E3E] border border-[#F2E4C4]",
                        unit.status === "sold" && "bg-[#FAF0F2] text-[#7D1826] border border-[#F0D5D9]"
                      )}
                    >
                      <span>{unit.status}</span>
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/units/${encodeURIComponent(unit.flatNumber)}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0F2] text-[#821A2A] hover:bg-[#821A2A] hover:text-white font-semibold text-xs border border-[#E8C4C8] shadow-2xs transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Dossier</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Flat Modal */}
      {isAddUnitOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl max-w-md w-full shadow-2xl animate-fade-in overflow-hidden">
            <div className="p-5 border-b border-[#F0E8DD] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#821A2A]" />
                <h3 className="font-serif font-bold text-sm text-[#24060B]">Add Single Flat to Inventory</h3>
              </div>
              <button
                onClick={() => setIsAddUnitOpen(false)}
                className="p-1.5 text-[#8C777A] hover:text-[#24060B] rounded-lg hover:bg-[#F2EAE0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSingleUnit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Flat Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B-402"
                    value={newFlatNumber}
                    onChange={(e) => setNewFlatNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-mono font-bold focus:outline-none focus:border-[#821A2A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Floor Number</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newFloor}
                    onChange={(e) => setNewFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Configuration Type</label>
                <select
                  value={newUnitType}
                  onChange={(e) => setNewUnitType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-medium focus:outline-none focus:border-[#821A2A]"
                >
                  <option value="2 BHK Comfort">2 BHK Comfort</option>
                  <option value="3 BHK Luxury">3 BHK Luxury</option>
                  <option value="3 BHK + Study">3 BHK + Study</option>
                  <option value="4 BHK Presidential">4 BHK Presidential</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={newCarpet}
                    onChange={(e) => setNewCarpet(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-mono focus:outline-none focus:border-[#821A2A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Super Built-Up (sq.ft)</label>
                  <input
                    type="number"
                    value={newSba}
                    onChange={(e) => setNewSba(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-mono focus:outline-none focus:border-[#821A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Base Price (₹ INR)</label>
                <input
                  type="number"
                  step="50000"
                  value={newBasePrice}
                  onChange={(e) => setNewBasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-mono font-bold focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUnitOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#DECFC0] text-[#5C4A4D] font-semibold text-xs hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl glossy-btn-burgundy hover:brightness-105 text-white font-semibold text-xs shadow-sm"
                >
                  Save &amp; Open Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
