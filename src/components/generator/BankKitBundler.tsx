"use client";

import React, { useState } from "react";
import { generateBankKitZip, triggerDownload, BankKitBundleInput } from "@/lib/bankKit";
import { Download, Share2, CheckCircle2, Loader2, FileArchive, ExternalLink, Zap } from "lucide-react";

interface BankKitBundlerProps {
  input: BankKitBundleInput;
}

export function BankKitBundler({ input }: BankKitBundlerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    blob: Blob;
    hash: string;
    filename: string;
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const [parkingRes, nocRes, costRes] = await Promise.all([
        fetch("/templates/car-parking-allotment.docx"),
        fetch("/templates/builder-home-loan-noc.docx"),
        fetch("/templates/unit-cost-sheet.docx"),
      ]);

      const [parkingDocxBuffer, nocDocxBuffer, costSheetDocxBuffer] = await Promise.all([
        parkingRes.arrayBuffer(),
        nocRes.arrayBuffer(),
        costRes.arrayBuffer(),
      ]);

      const result = await generateBankKitZip(input, {
        parkingDocxBuffer,
        nocDocxBuffer,
        costSheetDocxBuffer,
      });

      setGeneratedResult({
        blob: result.zipBlob,
        hash: result.verificationHash,
        filename: result.filename,
      });

      triggerDownload(result.zipBlob, result.filename);
    } catch (err: any) {
      alert(`Generation failed: ${err.message || String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!generatedResult) return;

    const buyerName = input.buyer.fullName;
    const flatNo = input.unit.flatNumber;
    const projectName = input.project.name;
    const slotNo = input.slot.slotNumber;
    const verifyUrl = `${window.location.origin}/verify/${generatedResult.hash}`;

    const text = encodeURIComponent(
      `Dear ${buyerName},\n\nCongratulations on Flat ${flatNo} at ${projectName}!\n\nYour official Car Parking Allotment (Bay ${slotNo}) & Bank Home Loan Kit drafts are ready for your review.\n\nPlease verify your details here: ${verifyUrl}\n\n— Post-Sales Team, ${projectName}`
    );

    const cleanPhone = input.buyer.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">1-Click Home Loan Bank Kit (.ZIP)</h3>
          <p className="text-xs text-slate-500">
            Simultaneously compiles 3 print-ready Word (.docx) &amp; watermarked (.pdf) files
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          SBI / HDFC / ICICI Ready
        </span>
      </div>

      {/* 3 In-Kit Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 bg-slate-50/80 rounded-xl border border-[#E5E7EB] space-y-1">
          <div className="font-bold text-slate-900">1. Parking Allotment</div>
          <p className="text-[11px] text-slate-500">Bay {input.slot.slotNumber} • {input.slot.level}</p>
          <div className="text-[10px] text-emerald-600 font-mono font-semibold">✓ DOCX + Watermarked PDF</div>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-xl border border-[#E5E7EB] space-y-1">
          <div className="font-bold text-slate-900">2. Builder Bank NOC</div>
          <p className="text-[11px] text-slate-500">Tripartite Mortgage Permission</p>
          <div className="text-[10px] text-emerald-600 font-mono font-semibold">✓ DOCX + Watermarked PDF</div>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-xl border border-[#E5E7EB] space-y-1">
          <div className="font-bold text-slate-900">3. Official Cost Sheet</div>
          <p className="text-[11px] text-slate-500">RERA Milestone Schedule</p>
          <div className="text-[10px] text-emerald-600 font-mono font-semibold">✓ DOCX + Watermarked PDF</div>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Compiling 6 Documents &amp; Zipping...</span>
            </>
          ) : (
            <>
              <FileArchive className="w-4 h-4 text-white" />
              <span>Generate &amp; Download 1-Click Bank Kit (.ZIP)</span>
            </>
          )}
        </button>

        {generatedResult && (
          <button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {generatedResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bank Kit Generated in 1.4 seconds!</span>
          </div>
          <p className="text-emerald-700 text-[11px]">
            Saved to your downloads as <code className="font-mono text-slate-900 font-semibold">{generatedResult.filename}</code>.
          </p>
          <div className="flex items-center space-x-3 pt-1 text-[11px]">
            <a
              href={`/verify/${generatedResult.hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-900 hover:underline flex items-center space-x-1 font-bold"
            >
              <span>View Public QR Authenticity Record ({generatedResult.hash.slice(0, 14)}...)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
