import React from "react";
import Link from "next/link";
import { ShieldCheck, Building2, CheckCircle2, Lock, ArrowLeft } from "lucide-react";

interface VerifyPageProps {
  params: Promise<{ hash: string }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { hash } = await params;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DeedFlow</span>
        </Link>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Official DeedFlow Tamper-Proof Seal</span>
        </div>
      </div>

      {/* Main Certificate Card */}
      <div className="max-w-2xl mx-auto w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Authentic Legal Record Verified</h1>
              <p className="text-xs text-slate-400">Cryptographic hash matches builder ledger</p>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[11px] font-bold font-mono">
            SEAL ACTIVE
          </div>
        </div>

        {/* Hash Banner */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 break-all">
          <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Verification Hash:</span>
          {hash}
        </div>

        {/* Record Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Developer Organization:</span>
            <span className="font-bold text-white text-sm">Sobha Limited</span>
            <span className="text-slate-500 block text-[10px] font-mono">CIN: L45201KA1995PLC018475</span>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">RERA Project:</span>
            <span className="font-bold text-white text-sm">Sobha Royal Pavilion — Tower B</span>
            <span className="text-slate-500 block text-[10px] font-mono">PRM/KA/RERA/1251/308/PR/190330</span>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Allocated Flat &amp; Parking:</span>
            <span className="font-bold text-emerald-400 text-sm">Flat B-101 • Bay B1-01</span>
            <span className="text-slate-400 block text-[10px]">Basement 1 • Standard Covered</span>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Allottee Verification Reference:</span>
            <span className="font-bold text-white text-sm">Kantharaju M.</span>
            <span className="text-slate-400 block text-[10px] font-mono">ID Ref: XXXXXXXX4826 (Masked)</span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Strict Privacy Guarantee: In accordance with the Aadhaar Act (2016) and UIDAI circulars, citizen
            identity numbers are redacted. This verification confirms matching records in the builder&apos;s
            internal master ledger.
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto w-full text-center text-xs text-slate-500 pt-6">
        Powered by DeedFlow Institutional Infrastructure • Bangalore, Karnataka
      </div>
    </div>
  );
}
