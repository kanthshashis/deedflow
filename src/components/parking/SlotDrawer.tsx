"use client";

import React, { useState } from "react";
import { ParkingSlot, UnitInventory } from "@/lib/types";
import { X, Car, CheckCircle2, ShieldAlert, Check } from "lucide-react";
import clsx from "clsx";

interface SlotDrawerProps {
  slot: ParkingSlot | null;
  units: UnitInventory[];
  isOpen: boolean;
  onClose: () => void;
  onAllot: (slotNumber: string, flatNumber: string) => Promise<void>;
}

export function SlotDrawer({ slot, units, isOpen, onClose, onAllot }: SlotDrawerProps) {
  const [selectedFlat, setSelectedFlat] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !slot) return null;

  const isAllotted = slot.status === "allotted";
  const isBlocked = slot.status === "blocked";

  const handleConfirm = async () => {
    if (!selectedFlat) {
      setErrorMsg("Please select a flat to allot this parking slot.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onAllot(slot.slotNumber, selectedFlat);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to allot slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full sm:max-w-md bg-surface-card rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dedicated Bay {slot.slotNumber}</h3>
              <p className="text-xs text-slate-400 font-mono">{slot.level} • {slot.slotType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 spring-transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Status Banner */}
          <div
            className={clsx(
              "px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2.5",
              slot.status === "available" && "bg-sky-500/10 text-sky-300 border border-sky-500/30",
              slot.status === "allotted" && "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
              slot.status === "reserved" && "bg-amber-500/15 text-amber-300 border border-amber-500/30",
              slot.status === "blocked" && "bg-red-500/15 text-red-300 border border-red-500/30"
            )}
          >
            {isAllotted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>
              Status: <strong className="capitalize">{slot.status}</strong>
              {slot.allottedUnitFlat && ` (Allocated to Flat ${slot.allottedUnitFlat})`}
            </span>
          </div>

          {slot.notes && (
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-white/5 font-mono">
              <span className="font-bold text-slate-200">Notes: </span>
              {slot.notes}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Unit Selector if available */}
          {!isAllotted && !isBlocked && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Allot to Flat / Unit:
              </label>
              <select
                value={selectedFlat}
                onChange={(e) => setSelectedFlat(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-white/10 rounded-xl bg-slate-950 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="">-- Choose Flat --</option>
                {units.map((u) => (
                  <option key={u.id} value={u.flatNumber}>
                    {u.flatNumber} ({u.tower} • {u.unitType} • {u.superBuiltUpAreaSqFt} sq.ft)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white border border-white/10 rounded-xl bg-transparent hover:bg-white/5 spring-transition"
          >
            Cancel
          </button>
          {!isAllotted && !isBlocked && (
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || !selectedFlat}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-sky-500/20 spring-transition disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Locking Slot..." : "Confirm Allotment"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
