"use client";

import React, { useState } from "react";
import {
  Car,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import clsx from "clsx";

interface BlueprintBay {
  number: string;
  type: string;
  status: "available" | "allotted" | "reserved";
  flat?: string;
  dimensions: string;
  col: string;
}

const DRAFTING_BAYS: BlueprintBay[] = [
  { number: "B1-001", type: "Covered", status: "allotted", flat: "A-101", dimensions: "2.5m x 5.0m", col: "Col 14-A" },
  { number: "B1-002", type: "Covered", status: "available", dimensions: "2.5m x 5.0m", col: "Col 14-B" },
  { number: "B1-003", type: "Tandem Upper", status: "reserved", flat: "A-102", dimensions: "2.4m x 9.8m", col: "Col 15-A" },
  { number: "B1-004", type: "Tandem Lower", status: "available", dimensions: "2.4m x 9.8m", col: "Col 15-B" },
  { number: "B1-005", type: "Covered", status: "allotted", flat: "H-801", dimensions: "2.6m x 5.2m", col: "Col 16-A" },
  { number: "B1-006", type: "Covered", status: "available", dimensions: "2.5m x 5.0m", col: "Col 16-B" },
  { number: "B1-007", type: "Covered", status: "allotted", flat: "B-204", dimensions: "2.5m x 5.0m", col: "Col 17-A" },
  { number: "B1-008", type: "Covered", status: "available", dimensions: "2.5m x 5.0m", col: "Col 17-B" },
  { number: "B1-009", type: "Stilt Open", status: "available", dimensions: "2.5m x 5.0m", col: "Col 18-A" },
  { number: "B1-010", type: "Covered", status: "allotted", flat: "C-402", dimensions: "2.5m x 5.0m", col: "Col 18-B" },
  { number: "B1-011", type: "Covered", status: "available", dimensions: "2.5m x 5.0m", col: "Col 19-A" },
  { number: "B1-012", type: "Covered", status: "available", dimensions: "2.5m x 5.0m", col: "Col 19-B" },
];

interface ArchitecturalBlueprintGridProps {
  theme?: string;
}

export function ArchitecturalBlueprintGrid({}: ArchitecturalBlueprintGridProps) {
  const [bays, setBays] = useState<BlueprintBay[]>(DRAFTING_BAYS);
  const [selectedBay, setSelectedBay] = useState<BlueprintBay | null>(bays[1]);
  const [activeLevel, setActiveLevel] = useState<"B1 (Upper)" | "B2 (Lower)">("B1 (Upper)");
  const [notification, setNotification] = useState<string | null>(null);

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
    <div className="w-full max-w-6xl mx-auto space-y-6 font-sans">
      <div className="rounded-2xl p-6 sm:p-8 space-y-6 border border-[#DECFC0] glossy-card spring-snap">
        {/* Top Blueprint Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD3] pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl border border-[#DECFC0] bg-[#FBF2F3] text-[#821A2A] flex items-center justify-center font-bold shadow-2xs">
              <Layers className="w-5 h-5 text-[#B88E3E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24060B]">
                Architectural Drawing: Scheme A-04 (Basement Bay Layout)
              </h3>
              <p className="text-xs font-mono text-[#5C4A4D]">
                Scale 1:100 • BBMP Sanction Plan Ref: LP/0114/2018-19 • Sobha Royal Pavilion
              </p>
            </div>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center space-x-1.5 p-1 rounded-xl text-xs font-semibold border border-[#DECFC0] bg-[#FFFDFB] shadow-2xs">
            {(["B1 (Upper)", "B2 (Lower)"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg spring-snap transition-all cursor-pointer",
                  activeLevel === lvl
                    ? "bg-[#821A2A] text-white shadow-xs font-bold border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {notification && (
          <div className="p-3.5 border border-[#DECFC0] text-xs font-medium rounded-xl flex items-center space-x-2 animate-fade-in bg-[#FBF2F3] text-[#821A2A]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#B88E3E]" />
            <span>{notification}</span>
          </div>
        )}

        {/* The Architectural Drafting Canvas Sheet */}
        <div className="border border-[#DECFC0] rounded-xl p-6 sm:p-8 relative overflow-hidden bg-[#FFFDFB] shadow-inner">
          {/* CAD Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(184, 142, 62, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(184, 142, 62, 0.14) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Blueprint Title Block Corner */}
          <div className="hidden sm:block absolute top-4 right-4 border border-[#DECFC0] rounded-lg p-3 text-[10px] font-mono text-right space-y-0.5 glossy-card text-[#5C4A4D]">
            <div className="font-semibold text-[#24060B]">SOBHA ROYAL PAVILION</div>
            <div>DWG NO: B1-PARK-REV3</div>
            <div className="font-bold text-[#821A2A]">STATUS: ATOMIC RECONCILED</div>
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
                      "bg-white/90 border-[#E8DFD3] hover:border-[#821A2A] hover:bg-[#FBF2F3]/40 text-[#24060B] shadow-2xs",
                    isAllotted &&
                      "bg-[#FBF2F3] border-[#DECFC0] text-[#821A2A]",
                    isReserved &&
                      "bg-[#F7F1E6] border-[#DFD1B8] text-[#8C6D2D]",
                    isSelected && "ring-2 ring-[#821A2A] shadow-sm"
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
                      <div className="text-[11px] font-bold flex items-center space-x-1 text-[#821A2A]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#B88E3E]" />
                        <span className="truncate">Flat {bay.flat}</span>
                      </div>
                    ) : isReserved ? (
                      <div className="text-[11px] font-bold flex items-center space-x-1 text-[#8C6D2D]">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[#B88E3E]" />
                        <span>Token Hold</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#5C4A4D] group-hover:text-[#821A2A] flex items-center space-x-1 font-medium">
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
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2 text-[#5C4A4D]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8DFD3] border border-[#DECFC0]" />
              <span>Available ({availableCount})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#821A2A]" />
              <span className="font-semibold text-[#821A2A]">
                Allotted ({allottedCount})
              </span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E]" />
              <span className="font-semibold text-[#8C6D2D]">Reserved (1)</span>
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
