"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, ShieldCheck, FileText, User } from "lucide-react";

interface ApprovePageProps {
  params: Promise<{ token: string }>;
}

export default function ApprovePage({ params }: ApprovePageProps) {
  const [tokenVal, setTokenVal] = useState<string>("");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [rejectionReason, setRejectionReason] = useState("");

  React.useEffect(() => {
    params.then((p) => setTokenVal(p.token));
  }, [params]);

  const handleApprove = () => {
    setStatus("approved");
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection note for the junior clerk.");
      return;
    }
    setStatus("rejected");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full pb-4 border-b border-slate-800 flex items-center justify-between text-xs">
        <Link href="/dashboard" className="flex items-center space-x-1.5 text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-slate-400 font-mono">Token: {tokenVal.slice(0, 12)}...</span>
      </div>

      <div className="max-w-3xl mx-auto w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Maker-Checker Manager Approval Sign-Off</h1>
            <p className="text-xs text-slate-400">
              Review draft details prepared by junior sales executive before formal seal
            </p>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold">
            Status: {status.toUpperCase()}
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Left: Raw KYC Extracted */}
          <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="font-bold text-slate-300 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Extracted from Customer PAN / Aadhaar:</span>
            </div>
            <div className="space-y-1.5 text-slate-400">
              <div><strong className="text-slate-200">Name:</strong> KANTHARAJU MARIYAPPA</div>
              <div><strong className="text-slate-200">PAN:</strong> ABCDE1234F</div>
              <div><strong className="text-slate-200">Aadhaar:</strong> XXXXXXXX4826 (Masked)</div>
              <div><strong className="text-slate-200">Address:</strong> Bellandur, Bengaluru 560103</div>
            </div>
          </div>

          {/* Right: Template Field Values */}
          <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="font-bold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Draft Letter Injected Values:</span>
            </div>
            <div className="space-y-1.5 text-slate-400">
              <div><strong className="text-slate-200">Allocated Unit:</strong> Flat B-101 (Tower B)</div>
              <div><strong className="text-slate-200">Parking Bay:</strong> Bay B1-01 (Basement 1)</div>
              <div><strong className="text-slate-200">Super Built-Up:</strong> 1620.0 sq.ft</div>
              <div><strong className="text-slate-200">Agreed Price:</strong> ₹1,49,30,000</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {status === "pending" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleApprove}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve &amp; Issue Final Sealed Documents</span>
              </button>

              <button
                onClick={() => setStatus("rejected")}
                className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

        {status === "approved" && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Document Pack Approved! Senior Manager Digital Seal applied. Ready for print.</span>
          </div>
        )}

        {status === "rejected" && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs space-y-2">
            <div className="font-bold flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Draft Rejected. Returned to Sales Clerk for Corrections.</span>
            </div>
            <textarea
              placeholder="Enter reason for rejection (e.g. spelling mismatch, wrong parking slot)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
            <button
              onClick={handleReject}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
            >
              Send Feedback to Clerk
            </button>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto w-full text-center text-xs text-slate-500 pt-4">
        DeedFlow Institutional Maker-Checker Protocol • Internal Builder Access Only
      </div>
    </div>
  );
}
