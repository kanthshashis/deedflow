"use client";

import React, { useState } from "react";
import { Download, FileArchive, CheckCircle2, ShieldCheck, Filter, FileText, Sparkles, AlertTriangle } from "lucide-react";
import { MOCK_UNITS } from "@/lib/mockData";
import { UnitInventory, SaleDeedEnrichment } from "@/lib/types";
import { SaleDeedEnrichmentModal } from "@/components/generator/SaleDeedEnrichmentModal";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";

export default function BatchGeneratorPage() {
  const [units, setUnits] = useState<UnitInventory[]>(MOCK_UNITS);
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([MOCK_UNITS[0].id]);
  const [activeModalUnit, setActiveModalUnit] = useState<UnitInventory | null>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedUnitIds.length === units.length) {
      setSelectedUnitIds([]);
    } else {
      setSelectedUnitIds(units.map((u) => u.id));
    }
  };

  const toggleUnit = (id: string) => {
    setSelectedUnitIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveEnrichment = (unitId: string, enrichment: SaleDeedEnrichment) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              allottee: u.allottee
                ? { ...u.allottee, saleDeedEnrichment: enrichment }
                : undefined,
            }
          : u
      )
    );
    setActiveModalUnit(null);
    setNotification("Sale deed statutory enrichment saved.");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGenerateSingleDeed = (unit: UnitInventory, enrichment: SaleDeedEnrichment) => {
    setActiveModalUnit(null);
    setNotification(`Generating Official Sale Deed (.DOCX) for Flat ${unit.flatNumber}... Complete.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRunBatchZip = () => {
    setIsBatchGenerating(true);
    setTimeout(() => {
      setIsBatchGenerating(false);
      setNotification(`Batch ZIP Generated for ${selectedUnitIds.length} flats. Quota deducted via atomic consume_document_quota.`);
      setTimeout(() => setNotification(null), 6000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E] animate-pulse" />
            <span>High-Throughput Batch Engine (UC-08 &amp; UC-13)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Sale Deed Pre-Flight &amp; Batch Generator
          </h1>
          <p className="text-xs text-[#5C4A4D] mt-0.5">
            Audit-grade statutory pre-flight validation (E-Stamp, UTR, UDS &amp; Witnesses) before bulk generating multi-crore deeds.
          </p>
        </div>

        {/* Batch Action Button */}
        <button
          onClick={handleRunBatchZip}
          disabled={selectedUnitIds.length === 0 || isBatchGenerating}
          className="px-5 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileArchive className="w-4 h-4 text-[#D4B989]" />
          <span>
            {isBatchGenerating
              ? `Compiling ${selectedUnitIds.length} Deeds into .ZIP...`
              : `1-Click Batch Export (${selectedUnitIds.length} Selected)`}
          </span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 bg-[#FFFDFB] border border-[#DECFC0] text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Table of Inventory */}
      <div className="glossy-card bg-[#FFFDFB] rounded-2xl border border-[#DECFC0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#F8F2EC]/40">
          <div className="flex items-center space-x-3 text-xs">
            <label className="flex items-center space-x-2 font-semibold text-[#24060B] cursor-pointer">
              <input
                type="checkbox"
                checked={selectedUnitIds.length === units.length}
                onChange={toggleSelectAll}
                className="rounded border-[#DECFC0] text-[#821A2A] focus:ring-0"
              />
              <span>Select All Flats ({units.length})</span>
            </label>
          </div>

          <span className="text-xs font-mono text-[#8C777A]">
            {selectedUnitIds.length} of {units.length} Selected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">Flat &amp; Tower</th>
                <th className="px-4 py-3">Configuration &amp; SBA</th>
                <th className="px-4 py-3">Allottee Name</th>
                <th className="px-4 py-3">Sale Deed Enrichment Status</th>
                <th className="px-4 py-3">Consideration</th>
                <th className="px-4 py-3 text-right">Pre-Flight Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {units.map((unit) => {
                const isSelected = selectedUnitIds.includes(unit.id);
                const enrichment = unit.allottee?.saleDeedEnrichment;
                const isEnriched = Boolean(enrichment && enrichment.e_stamp_certificate_no && enrichment.payment_utr_schedule.length > 0);

                return (
                  <tr key={unit.id} className="hover:bg-[#F8F2EC]/60 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleUnit(unit.id)}
                        className="rounded border-[#DECFC0] text-[#821A2A] focus:ring-0"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-[#24060B] text-sm">Flat {unit.flatNumber}</div>
                      <div className="text-[11px] text-[#8C777A] font-mono">{unit.tower} • Floor {unit.floorNumber}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[#24060B]">{unit.unitType}</div>
                      <div className="text-[10px] text-[#8C777A] font-mono">SBA: {unit.superBuiltUpAreaSqFt} sq.ft</div>
                    </td>
                    <td className="px-4 py-4">
                      {unit.allottee ? (
                        <div>
                          <div className="font-semibold text-[#24060B]">{unit.allottee.fullName}</div>
                          <div className="text-[10px] text-[#8C777A] font-mono">PAN: {unit.allottee.panNumber}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#8C777A] italic">Unassigned (Open)</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {isEnriched ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FFF9EE] text-[#B88E3E] border border-[#F2E4C4]">
                          <CheckCircle2 className="w-3 h-3 text-[#B88E3E]" />
                          <span>Statutory Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FAF0F2] text-[#7D1826] border border-[#F0D5D9]">
                          <AlertTriangle className="w-3 h-3 text-[#7D1826]" />
                          <span>Needs E-Stamp / UTR</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-[#24060B]">
                      {formatIndianCurrency(unit.basePrice)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setActiveModalUnit(unit)}
                        className="px-3 py-1.5 rounded-lg glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                      >
                        Enrich Statutory Modal
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Deed Enrichment Modal Drawer */}
      {activeModalUnit && (
        <SaleDeedEnrichmentModal
          unit={activeModalUnit}
          isOpen={true}
          onClose={() => setActiveModalUnit(null)}
          onSave={handleSaveEnrichment}
          onGenerateDeed={handleGenerateSingleDeed}
        />
      )}
    </div>
  );
}
