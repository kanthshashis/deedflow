"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, LifeBuoy } from "lucide-react";
import { logger } from "@/lib/logger";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Global boundary intercepted runtime error", "GlobalErrorPage", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 py-12 text-[#24060B]">
      <div className="w-full max-w-lg bg-white border border-[#DECFC0] rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF0F2] border border-[#E8C4C8] flex items-center justify-center text-[#821A2A] shadow-inner">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#821A2A] uppercase bg-[#FAF0F2] px-2.5 py-1 rounded-full border border-[#E8C4C8]">
            Fault Resilient Interceptor
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24060B]">
            Operational Exception Encountered
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4A4D] max-w-sm mx-auto">
            The workspace encountered an unexpected runtime state. System state has been quarantined to prevent data corruption.
          </p>
        </div>

        {error?.digest && (
          <div className="bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-left">
            <span className="text-[10px] font-mono text-[#8C777A] block">Diagnostic Reference Digest:</span>
            <code className="text-xs font-mono text-[#821A2A] break-all">{error.digest}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 glossy-btn-burgundy text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#DECFC0] hover:border-[#821A2A] text-[#24060B] hover:text-[#821A2A] text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-2xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </Link>
        </div>

        <div className="border-t border-[#F0E8DD] pt-4 text-center">
          <a
            href="mailto:support@deedflow.in"
            className="inline-flex items-center space-x-1.5 text-xs text-[#8C777A] hover:text-[#821A2A]"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Contact 24/7 Enterprise Support (Bangalore)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
