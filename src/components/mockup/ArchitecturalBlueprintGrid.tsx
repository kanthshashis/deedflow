"use client";

import React, { useState } from "react";
import { Car, CheckCircle2, ShieldCheck, Clock, Layers, Compass, Zap } from "lucide-react";
import clsx from "clsx";

interface BlueprintBay {
  number: string;
  type: "Standard" | "Compact" | "EV Wide" | "Tandem";
  dimensions: string;
  status: "available" | "allotted" | "reserved";
  flat?: string;
  col: string;
}

const DRAFTING_BAYS: BlueprintBay[] = [
  { number: "B1-01", type: "Standard", dimensions: "2.6m × 5.0m", status: "allotted", flat: "B-101", col: "P-01" },
  { number: "B1-02", type: "Standard", dimensions: "2.6m × 5.0m", status: "available", col: "P-02" },
  { number: "B1-03", type: "EV Wide", dimensions: "2.8m × 5.2m", status: "allotted", flat: "B-201", col: "P-03" },
  { number: "B1-04", type: "Compact", dimensions: "2.4m × 4.8m", status: "available", col: "P-04" },
  { number: "B1-05", type: "Compact", dimensions: "2.4m × 4.8m", status: "available", col: "P-05" },
  { number: "B1-06", type: "Tandem", dimensions: "2.6m × 9.8m", status: "reserved", flat: "B-103", col: "P-06" },

  { number: "B1-07", type: "Standard", dimensions: "2.6m × 5.0m", status: "available", col: "P-07" },
  { number: "B1-08", type: "Standard", dimensions: "2.6m × 5.0m", status: "allotted", flat: "B-302", col: "P-08" },
  { number: "B1-09", type: "Standard", dimensions: "2.6m × 5.0m", status: "available", col: "P-09" },
  { number: "B1-10", type: "Compact", dimensions: "2.4m × 4.8m", status: "available", col: "P-10" },
  { number: "B1-11", type: "EV Wide", dimensions: "2.8m × 5.2m", status: "available", col: "P-11" },
  { number: "B1-12", type: "Standard", dimensions: "2.6m × 5.0m", status: "allotted", flat: "B-404", col: "P-12" },
];

interface ArchitecturalBlueprintGridProps {
  theme?: "stripe" | "linear" | "luxury";
}

export function ArchitecturalBlueprintGrid({ theme = "stripe" }: ArchitecturalBlueprintGridProps) {
  const [bays, setBays] = useState<BlueprintBay[]>(DRAFTING_BAYS);
  const [selectedBay, setSelectedBay] = useState<BlueprintBay | null>(bays[1]);
  const [activeLevel, setActiveLevel] = useState<"B1 (Upper)" | "B2 (Lower)">("B1 (Upper)");
  const [notification, setNotification] = useState<string | null>(null);

  const isLight = theme === "stripe";
  const isDark = theme === "linear";
  const isLuxury = theme === "luxury";

  const handleToggle = (bay: BlueprintBay) => {
    setSelectedBay(bay);
    if (bay.status === "available") {
      setBays((prev) =>
        prev.map((b) =>
          b.number === bay.number
            ? { ...b, status: "allotted", flat: "B-302" }
            : b
        )
      );
      setNotification(`Slot ${bay.number} locked & allotted to Flat B-302 with atomic concurrency.`);
    } else {
      setBays((prev) =>
        prev.map((b) =>
          b.number === bay.number
            ? { ...b, status: "available", flat: undefined }
            : b
        )
      );
      setNotification(`Slot ${bay.number} released to builder open inventory.`);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const availableCount = bays.filter((b) => b.status === "available").length;
  const allottedCount = bays.filter((b) => b.status === "allotted").length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div
        className={clsx(
          "rounded-2xl p-6 sm:p-8 space-y-6 border spring-snap",
          isLight && "glossy-card border-[#DECFC0]",
          isDark && "bg-surface border-border shadow-card",
          isLuxury && "bg-white border-stone-300 shadow-sm"
        )}
      >
        {/* Top Blueprint Header Bar */}
        <div className={clsx("flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5", isLight ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-200")}>
          <div className="flex items-center space-x-3">
            <div className={clsx(
              "w-10 h-10 rounded-xl border flex items-center justify-center font-bold",
              isLight ? "bg-[#FBF2F3] border-[#E8C8CC] text-[#7D1826]" : isDark ? "bg-brand/20 border-brand/40 text-brand" : "bg-stone-100 border-stone-300 text-stone-800"
            )}>
              <Layers className="w-5 h-5 text-[#B88E3E]" />
            </div>
            <div>
              <h3 className={clsx("text-base font-bold", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>
                Architectural Drawing: Scheme A-04 (Basement Bay Layout)
              </h3>
              <p className={clsx("text-xs font-mono", isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-muted" : "text-stone-500")}>
                Scale 1:100 • BBMP Sanction Plan Ref: LP/0114/2018-19 • Sobha Royal Pavilion
              </p>
            </div>
          </div>

          {/* Level Switcher */}
          <div className={clsx(
            "flex items-center space-x-1.5 p-1 rounded-xl text-xs font-semibold border",
            isLight ? "bg-[#F8F2EC] border-[#DECFC0]" : isDark ? "bg-surface-muted border-border" : "bg-stone-100 border-stone-200"
          )}>
            {(["B1 (Upper)", "B2 (Lower)"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeLevel === lvl
                    ? isLight ? "bg-[#4A0E17] text-[#FAF7F2] shadow-sm font-bold border border-[#6B1B26]" : isDark ? "bg-brand text-white shadow-glow" : "bg-stone-900 text-white shadow-sm font-bold"
                    : isLight ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#F3EAE0]" : isDark ? "text-ink-secondary hover:text-ink" : "text-stone-600 hover:text-stone-900"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {notification && (
          <div className={clsx(
            "p-3.5 border text-xs font-medium rounded-xl flex items-center space-x-2 animate-fade-in",
            isLight ? "bg-[#FBF2F3] border-[#E8C8CC] text-[#7D1826]" : isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-300 text-emerald-900"
          )}>
            <CheckCircle2 className={clsx("w-4 h-4 shrink-0", isLight ? "text-[#B88E3E]" : "text-emerald-600")} />
            <span>{notification}</span>
          </div>
        )}

        {/* The Architectural Drafting Canvas Sheet */}
        <div
          className={clsx(
            "border rounded-xl p-6 sm:p-8 relative overflow-hidden",
            isLight && "bg-[#FFFDFB] border-[#DECFC0] shadow-inner",
            isDark && "bg-[#0A0C0E] border-border",
            isLuxury && "bg-[#FAF9F5] border-stone-300 shadow-inner"
          )}
        >
          {/* CAD Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: isDark
                ? "linear-gradient(to right, rgba(94, 106, 210, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(94, 106, 210, 0.25) 1px, transparent 1px)"
                : "linear-gradient(to right, rgba(184, 142, 62, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(184, 142, 62, 0.14) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Blueprint Title Block Corner */}
          <div className={clsx(
            "hidden sm:block absolute top-4 right-4 border rounded-lg p-3 text-[10px] font-mono text-right space-y-0.5",
            isLight ? "glossy-card border-[#DECFC0] text-[#5C4A4D]" : isDark ? "bg-surface/90 border-border text-ink-muted" : "bg-white/95 border-stone-300 text-stone-600"
          )}>
            <div className={clsx("font-semibold", isLight ? "text-[#24060B]" : isDark ? "text-ink" : "text-stone-900")}>SOBHA ROYAL PAVILION</div>
            <div>DWG NO: B1-PARK-REV3</div>
            <div className={clsx("font-bold", isLight ? "text-[#7D1826]" : "text-emerald-600")}>STATUS: ATOMIC RECONCILED</div>
          </div>

          {/* Bays Layout Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 relative z-10">
            {bays.map((bay) => {
              const isAllotted = bay.status === "allotted";
              const isReserved = bay.status === "reserved";
              const isSelected = selectedBay?.number === bay.number;

              return (
                <div
                  key={bay.number}
                  onClick={() => handleToggle(bay)}
                  className={clsx(
                    "cursor-pointer rounded-xl p-3 border spring-snap flex flex-col justify-between h-28 select-none relative group transition-all",
                    bay.status === "available" &&
                      (isLight
                        ? "bg-white/90 border-[#E8DFD3] hover:border-[#7D1826] hover:bg-[#FBF2F3]/40 text-[#24060B] shadow-2xs"
                        : isDark
                        ? "bg-surface-muted/80 border-border hover:border-brand/60 hover:bg-brand/10 text-ink"
                        : "bg-white border-stone-200 hover:border-stone-800 hover:bg-stone-50 text-stone-800 shadow-xs"),
                    isAllotted &&
                      (isLight
                        ? "bg-[#FBF2F3] border-[#E8C8CC] text-[#7D1826]"
                        : isDark
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
                        : "bg-emerald-50 border-emerald-300 text-emerald-900"),
                    isReserved &&
                      (isLight
                        ? "bg-[#F7F1E6] border-[#DFD1B8] text-[#8C6D2D]"
                        : isDark
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                        : "bg-amber-50 border-amber-300 text-amber-900"),
                    isSelected && (isLight ? "ring-2 ring-[#7D1826] shadow-sm" : isDark ? "ring-2 ring-brand" : "ring-2 ring-stone-900")
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs tracking-tight">
                      {bay.number}
                    </span>
                    <span className="text-[9px] font-mono uppercase opacity-60">
                      {bay.col}
                    </span>
                  </div>

                  <div className="my-1">
                    {isAllotted ? (
                      <div className={clsx("text-[11px] font-bold flex items-center space-x-1", isLight ? "text-[#7D1826]" : "text-emerald-700")}>
                        <CheckCircle2 className={clsx("w-3.5 h-3.5 shrink-0", isLight ? "text-[#B88E3E]" : "")} />
                        <span className="truncate">Flat {bay.flat}</span>
                      </div>
                    ) : isReserved ? (
                      <div className={clsx("text-[11px] font-bold flex items-center space-x-1", isLight ? "text-[#8C6D2D]" : "text-amber-700")}>
                        <Clock className={clsx("w-3.5 h-3.5 shrink-0", isLight ? "text-[#B88E3E]" : "")} />
                        <span>Token Hold</span>
                      </div>
                    ) : (
                      <div className={clsx("text-[11px] opacity-75 group-hover:text-[#7D1826] flex items-center space-x-1 font-medium", isLight ? "text-[#5C4A4D]" : "")}>
                        <Car className="w-3.5 h-3.5 shrink-0" />
                        <span>Click to Allot</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono opacity-60 border-t border-black/5 pt-1">
                    <span>{bay.type}</span>
                    <span>{bay.dimensions}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Legend */}
        <div className={clsx("flex flex-wrap items-center justify-between gap-4 text-xs pt-2", isLight ? "text-[#5C4A4D]" : isDark ? "text-ink-secondary" : "text-stone-600")}>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8DFD3] border border-[#DECFC0]" />
              <span>Available ({availableCount})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className={clsx("w-2.5 h-2.5 rounded-full", isLight ? "bg-[#7D1826]" : "bg-emerald-500")} />
              <span className={clsx("font-semibold", isLight ? "text-[#7D1826]" : "text-emerald-600")}>
                Allotted ({allottedCount})
              </span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className={clsx("w-2.5 h-2.5 rounded-full", isLight ? "bg-[#B88E3E]" : "bg-amber-500")} />
              <span className={clsx("font-semibold", isLight ? "text-[#8C6D2D]" : "text-amber-600")}>Reserved (1)</span>
            </span>
          </div>

          <span className="font-mono text-[11px] opacity-75">
            Directly mapped to Sale Deed Schedule C &amp; Allotment Letter
          </span>
        </div>
      </div>
    </div>
  );
}
