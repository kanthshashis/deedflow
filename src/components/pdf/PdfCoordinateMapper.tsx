"use client";

import React, { useState } from "react";
import { Crosshair, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface CoordinateMarker {
  id: string;
  label: string;
  xPct: number; // 0 to 100%
  yPct: number; // 0 to 100%
  pdfX: number; // points (0 to 595.28)
  pdfY: number; // points (0 to 841.89, from bottom)
}

export function PdfCoordinateMapper() {
  const [markers, setMarkers] = useState<CoordinateMarker[]>([
    { id: "m1", label: "Buyer Name", xPct: 22, yPct: 24, pdfX: 131, pdfY: 640 },
    { id: "m2", label: "Allotted Bay #", xPct: 65, yPct: 38, pdfX: 386, pdfY: 522 },
    { id: "m3", label: "Consideration Words", xPct: 20, yPct: 45, pdfX: 119, pdfY: 463 },
  ]);
  const [activeLabel, setActiveLabel] = useState<string>("PAN / ID Ref");

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = Math.round((x / rect.width) * 100);
    const yPct = Math.round((y / rect.height) * 100);

    // Standard A4: 595.28 x 841.89 points. Note: PDF Y is measured from the bottom!
    const pdfX = Math.round((x / rect.width) * 595.28);
    const pdfY = Math.round((1 - y / rect.height) * 841.89);

    const newMarker: CoordinateMarker = {
      id: `m_${Date.now()}`,
      label: activeLabel,
      xPct,
      yPct,
      pdfX,
      pdfY,
    };

    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleRemove = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-obsidian">Pre-Printed Letterhead (X, Y) Coordinate Mapper</h3>
          <p className="text-xs text-slate-500">
            Click anywhere on the preview canvas to drop exact coordinate overlays for blank stamp paper
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <input
            type="text"
            value={activeLabel}
            onChange={(e) => setActiveLabel(e.target.value)}
            className="px-2.5 py-1 border border-border rounded-lg bg-slate-50 text-slate-800"
            placeholder="Field Name"
          />
          <span className="text-slate-400 font-mono text-[11px]">(Click canvas to place)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* The Mock A4 Letterhead Canvas */}
        <div className="lg:col-span-2 flex justify-center bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div
            onClick={handleCanvasClick}
            className="relative w-full max-w-md aspect-[1/1.414] bg-white border border-slate-300 shadow-md rounded cursor-crosshair overflow-hidden select-none"
          >
            {/* Mock Header on Letterhead */}
            <div className="p-4 border-b border-slate-100 text-center">
              <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                [Pre-Printed Builder Letterhead Header Margin — 80pt]
              </div>
            </div>

            {/* Subtle grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Coordinate Markers */}
            {markers.map((m) => (
              <div
                key={m.id}
                style={{ left: `${m.xPct}%`, top: `${m.yPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md ring-2 ring-white">
                  <Crosshair className="w-3 h-3" />
                </div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap shadow-lg">
                  {m.label} ({m.pdfX}, {m.pdfY})
                </div>
              </div>
            ))}

            {/* Mock Footer Margin */}
            <div className="absolute bottom-0 inset-x-0 p-3 border-t border-slate-100 text-center bg-slate-50/50">
              <div className="text-[9px] text-slate-400 font-mono">
                [Bottom Margin — 60pt for QR Authenticity Seal]
              </div>
            </div>
          </div>
        </div>

        {/* Placed Markers Table */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Configured Field Positions:</span>
            <span className="text-[11px] text-slate-500 font-mono">{markers.length} mapped</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {markers.map((m) => (
              <div
                key={m.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{m.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    PDF X: {m.pdfX} pt • Y: {m.pdfY} pt ({m.xPct}%, {m.yPct}%)
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert("Calibration coordinates saved to local profile!")}
              className="w-full px-3 py-2 bg-obsidian text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Save Coordinate Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
