"use client";

import React, { useState } from "react";
import { Car, ShieldCheck, Clock, Ban, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

interface SlotItem {
  number: string;
  type: string;
  status: "available" | "allotted" | "reserved" | "blocked";
  flat?: string;
}

const SAMPLE_BAYS: SlotItem[] = [
  { number: "B1-01", type: "Standard", status: "allotted", flat: "B-101" },
  { number: "B1-02", type: "Standard", status: "available" },
  { number: "B1-03", type: "Standard", status: "available" },
  { number: "B1-04", type: "Compact", status: "available" },
  { number: "B1-05", type: "Compact", status: "available" },
  { number: "B1-06", type: "Tandem Double", status: "reserved", flat: "B-203" },
  { number: "B1-07", type: "Tandem Double", status: "available" },
  { number: "B1-08", type: "EV Wide Bay", status: "allotted", flat: "B-201" },
  { number: "B1-09", type: "Standard", status: "blocked" },
  { number: "B1-10", type: "Standard", status: "available" },
  { number: "B1-11", type: "Compact", status: "available" },
  { number: "B1-12", type: "Standard", status: "available" },
];

export function InteractiveBasementGridPreview() {
  const [bays, setBays] = useState<SlotItem[]>(SAMPLE_BAYS);
  const [selectedBay, setSelectedBay] = useState<SlotItem | null>(bays[1]);
  const [allotmentSuccess, setAllotmentSuccess] = useState<string | null>(null);

  const handleToggleAllotment = (bay: SlotItem) => {
    setSelectedBay(bay);

    if (bay.status === "available") {
      setBays((prev) =>
        prev.map((b) =>
          b.number === bay.number
            ? { ...b, status: "allotted", flat: "B-302" }
            : b
        )
      );
      setAllotmentSuccess(`Locked & Allotted ${bay.number} to Flat B-302!`);
      setTimeout(() => setAllotmentSuccess(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-blue-600/30 via-slate-800/40 to-transparent shadow-2xl">
      <div className="rounded-[23px] bg-surface-card border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-semibold tracking-wider text-sky-400 uppercase">
                Zero Double-Allotment Engine
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Interactive Architectural Basement Slot Grid
            </h3>
            <p className="text-xs text-slate-400">
              Click any bay to test real-time slot state locking and instant flat association.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded bg-slate-700 border border-slate-600" />
              <span>Available</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span>Allotted</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded bg-amber-400" />
              <span>Reserved</span>
            </span>
          </div>
        </div>

        {allotmentSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-xl flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{allotmentSuccess}</span>
          </div>
        )}

        {/* Blueprint Layout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
          {bays.map((bay) => {
            const isAllotted = bay.status === "allotted";
            const isReserved = bay.status === "reserved";
            const isBlocked = bay.status === "blocked";
            const isSelected = selectedBay?.number === bay.number;

            return (
              <div
                key={bay.number}
                onClick={() => handleToggleAllotment(bay)}
                className={clsx(
                  "p-3 rounded-xl border cursor-pointer spring-transition flex flex-col justify-between h-24 select-none relative group",
                  bay.status === "available" &&
                    "bg-slate-900/60 border-white/10 hover:border-sky-400 hover:bg-sky-500/10 hover:shadow-lg",
                  isAllotted && "bg-emerald-500/15 border-emerald-500/40 text-emerald-200",
                  isReserved && "bg-amber-500/15 border-amber-500/40 text-amber-200",
                  isBlocked && "bg-slate-900/30 border-white/5 opacity-40 cursor-not-allowed",
                  isSelected && "ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs tracking-tight text-white">
                    {bay.number}
                  </span>
                  <span
                    className={clsx(
                      "text-[9px] px-1 rounded uppercase font-semibold",
                      isAllotted && "bg-emerald-500/30 text-emerald-300",
                      isReserved && "bg-amber-500/30 text-amber-300",
                      isBlocked && "bg-slate-800 text-slate-500",
                      bay.status === "available" && "bg-white/10 text-slate-400"
                    )}
                  >
                    {bay.status}
                  </span>
                </div>

                <div className="my-1">
                  {isAllotted ? (
                    <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Flat {bay.flat}</span>
                    </div>
                  ) : isReserved ? (
                    <div className="flex items-center space-x-1 text-[10px] text-amber-300">
                      <Clock className="w-3 h-3" />
                      <span>Token Hold</span>
                    </div>
                  ) : isBlocked ? (
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                      <Ban className="w-3 h-3" />
                      <span>Pillar</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 group-hover:text-sky-300">
                      <Car className="w-3 h-3" />
                      <span>Tap to Lock</span>
                    </div>
                  )}
                </div>

                <div className="text-[9px] text-slate-500 font-mono truncate">
                  {bay.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
