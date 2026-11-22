"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles, RefreshCw, Lock, Zap, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export function LaserDocScannerHUD() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [docType, setDocType] = useState<"PAN" | "AADHAAR">("AADHAAR");

  const triggerScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 70);
  };

  return (
    <div className="w-full max-w-5xl mx-auto surface-card rounded-2xl p-6 sm:p-8 space-y-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>In-Memory Neural KYC OCR Engine</span>
          </div>
          <h3 className="text-xl font-bold text-ink tracking-tight">
            Automated Identity Extraction &amp; Aadhaar Redaction
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setDocType(docType === "PAN" ? "AADHAAR" : "PAN");
              triggerScan();
            }}
            className="px-3.5 py-2 bg-surface-muted hover:bg-surface-elevated text-indigo-300 border border-border rounded-xl font-mono text-xs font-semibold spring-snap flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className={clsx("w-3.5 h-3.5", isScanning && "animate-spin")} />
            <span>Switch to {docType === "PAN" ? "Aadhaar Card" : "PAN Card"}</span>
          </button>
        </div>
      </div>

      {/* 3D Perspective Hologram Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 6 Cols: Card with Animated Laser */}
        <div className="lg:col-span-6 flex justify-center [perspective:1000px]">
          <div className="relative w-full max-w-sm aspect-[1.58/1] rounded-2xl p-5 border border-border bg-[#0B0D10] shadow-card overflow-hidden [transform:rotateX(10deg)_rotateY(-8deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)] spring-snap select-none group">
            {/* Hologram Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-indigo-400/80" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-indigo-400/80" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-indigo-400/80" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-indigo-400/80" />

            {/* Scanning Laser Beam */}
            {isScanning && (
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#5E6AD2] z-20"
                style={{
                  top: `${scanProgress}%`,
                  transition: "top 0.07s linear",
                }}
              />
            )}

            {/* Document Hologram Interior */}
            <div className="relative z-10 h-full flex flex-col justify-between text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-brand/20 border border-brand/40 flex items-center justify-center font-mono font-bold text-[10px] text-indigo-300">
                    ID
                  </div>
                  <span className="font-mono font-bold text-ink tracking-wider text-[11px]">
                    {docType === "PAN" ? "INCOME TAX DEPARTMENT OF INDIA" : "GOVERNMENT OF INDIA"}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400">
                  {docType === "PAN" ? "PERMANENT ACCT" : "UNIQUE IDENTIFICATION"}
                </span>
              </div>

              <div className="space-y-1.5 my-auto">
                <div className="text-[10px] text-ink-muted uppercase">Legal Name / Full Allottee:</div>
                <div className="font-bold text-sm text-ink tracking-wide">
                  KANTHARAJU MARIYAPPA
                </div>
                <div className="text-[10px] text-ink-muted">Father: LATE MARIYAPPA</div>
              </div>

              <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-ink-muted uppercase">
                    {docType === "PAN" ? "PAN NUMBER" : "AADHAAR NUMBER"}
                  </div>
                  <div className="font-mono font-bold text-xs tracking-wider text-emerald-400">
                    {docType === "PAN" ? "ABCDE1234F" : "•••• •••• 4826 (MASKED)"}
                  </div>
                </div>

                <div className="w-10 h-10 rounded border border-white/10 bg-surface-muted flex items-center justify-center text-[8px] font-mono text-ink-muted">
                  QR SECURE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Extracted Data HUD Stream */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>OCR Pipeline Verified (120ms)</span>
              </span>
              <span className="text-[10px] font-mono text-ink-muted bg-surface px-2 py-0.5 rounded border border-border">
                Zero Cloud Disk Write
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-ink-secondary">Extracted Name:</span>
                <span className="font-semibold text-ink">KANTHARAJU MARIYAPPA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-ink-secondary">Document Number:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {docType === "PAN" ? "ABCDE1234F" : "XXXXXXXX4826"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-ink-secondary">UIDAI Compliance:</span>
                <span className="font-mono text-emerald-400 font-semibold">First 8 Digits Redacted</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-secondary">Confidence Score:</span>
                <span className="font-mono text-indigo-300 font-bold">99.8% Neural Match</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-muted font-mono px-1">
            <span>UIDAI Circular 2018/02 Compliant</span>
            <button
              onClick={triggerScan}
              className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
            >
              Rerun Scan Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
