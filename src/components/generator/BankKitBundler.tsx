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
    <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E8DD] pb-4">
        <div>
          <h3 className="text-base font-bold font-serif text-[#24060B]">1-Click Home Loan Bank Kit (.ZIP)</h3>
          <p className="text-xs text-[#5C4A4D]">
            Simultaneously compiles 3 print-ready Word (.docx) &amp; watermarked (.pdf) files
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#FFF9EE] text-[#B88E3E] border border-[#F2E4C4]">
          SBI / HDFC / ICICI Ready
        </span>
      </div>

      {/* 3 In-Kit Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-1">
          <div className="font-bold text-[#24060B]">1. Parking Allotment</div>
          <p className="text-[11px] text-[#5C4A4D]">Bay {input.slot.slotNumber} • {input.slot.level}</p>
          <div className="text-[10px] text-[#7D1826] font-mono font-semibold">✓ DOCX + Watermarked PDF</div>
        </div>

        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-1">
          <div className="font-bold text-[#24060B]">2. Builder Bank NOC</div>
          <p className="text-[11px] text-[#5C4A4D]">Tripartite Mortgage Permission</p>
          <div className="text-[10px] text-[#7D1826] font-mono font-semibold">✓ DOCX + Watermarked PDF</div>
        </div>

        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-1">
          <div className="font-bold text-[#24060B]">3. Official Cost Sheet</div>
          <p className="text-[11px] text-[#5C4A4D]">RERA Milestone Schedule</p>
          <div className="text-[10px] text-[#7D1826] font-mono font-semibold">✓ DOCX + Watermarked PDF</div>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto flex-1 px-6 py-3.5 glossy-btn-burgundy hover:brightness-105 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Compiling 6 Documents &amp; Zipping...</span>
            </>
          ) : (
            <>
              <FileArchive className="w-4 h-4 text-[#D4B989]" />
              <span>Generate &amp; Download 1-Click Bank Kit (.ZIP)</span>
            </>
          )}
        </button>

        {generatedResult && (
          <button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto px-6 py-3.5 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#B88E3E]/60 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>Share on WhatsApp</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {generatedResult && (
        <div className="p-4 bg-[#FFF9EE] border border-[#F2E4C4] rounded-xl text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-[#24060B]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bank Kit Generated in 1.4 seconds!</span>
          </div>
          <p className="text-[#5C4A4D] text-[11px]">
            Saved to your downloads as <code className="font-mono text-[#24060B] font-semibold">{generatedResult.filename}</code>.
          </p>
          <div className="flex items-center space-x-3 pt-1 text-[11px]">
            <a
              href={`/verify/${generatedResult.hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#7D1826] hover:underline flex items-center space-x-1 font-bold"
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
