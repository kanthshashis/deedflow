"use client";

import React, { useState } from "react";
import { lintDocxTemplate } from "@/lib/docxEngine";
import { PdfCoordinateMapper } from "@/components/pdf/PdfCoordinateMapper";
import { FileCheck, Upload, AlertCircle, CheckCircle2, Download, Eye } from "lucide-react";

export default function TemplatesPage() {
  const [linterStatus, setLinterStatus] = useState<{
    tested: boolean;
    valid: boolean;
    errors: string[];
    tags: string[];
  } | null>(null);

  const handleUploadCustomDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const result = lintDocxTemplate(buffer);

      setLinterStatus({
        tested: true,
        valid: result.isValid,
        errors: result.errors,
        tags: result.detectedTags,
      });
    } catch (err: any) {
      setLinterStatus({
        tested: true,
        valid: false,
        errors: [err.message || "Failed to parse file"],
        tags: [],
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight">
          Template Management &amp; Preflight Linter
        </h1>
        <p className="text-xs text-[#5C4A4D] mt-1">
          Upload custom Word (.docx) letterheads or configure exact coordinate overlays for blank stamp paper.
        </p>
      </div>

      {/* Section 1: Standard Active Templates */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
          <h2 className="text-sm font-bold font-serif text-[#24060B]">Active Standard Legal Templates</h2>
          <span className="text-xs text-[#B88E3E] bg-[#FFF9EE] px-2.5 py-1 rounded-full border border-[#F2E4C4] font-semibold font-mono">
            Validated for Karnataka &amp; Pan-India
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 bg-[#FAF7F2] border border-[#DECFC0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B]">1. Car Parking Allotment</span>
              <FileCheck className="w-4 h-4 text-[#7D1826]" />
            </div>
            <p className="text-[11px] text-[#5C4A4D]">
              Covers Schedule C undivided share and dedicated basement bay allotment.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <a
                href="/templates/car-parking-allotment.docx"
                download
                className="text-xs text-[#7D1826] hover:underline font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .DOCX</span>
              </a>
            </div>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#DECFC0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B]">2. Builder Bank NOC</span>
              <FileCheck className="w-4 h-4 text-[#7D1826]" />
            </div>
            <p className="text-[11px] text-[#5C4A4D]">
              Standard Tripartite mortgage permission for SBI, HDFC, ICICI, Axis.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <a
                href="/templates/builder-home-loan-noc.docx"
                download
                className="text-xs text-[#7D1826] hover:underline font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .DOCX</span>
              </a>
            </div>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#DECFC0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B]">3. Unit Cost &amp; Milestone Sheet</span>
              <FileCheck className="w-4 h-4 text-[#7D1826]" />
            </div>
            <p className="text-[11px] text-[#5C4A4D]">
              RERA milestone payment schedule (Token, Agreement, Plinth, Slabs).
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <a
                href="/templates/unit-cost-sheet.docx"
                download
                className="text-xs text-[#7D1826] hover:underline font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .DOCX</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Custom Word Template Uploader & Preflight Linter */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-[#F0E8DD] pb-3">
          <h2 className="text-sm font-bold font-serif text-[#24060B]">Upload Your Own Company Letterhead (.DOCX)</h2>
          <p className="text-xs text-[#5C4A4D]">
            DeedFlow will scan your Word file for syntax errors, unclosed braces, or broken tags.
          </p>
        </div>

        <label className="cursor-pointer border-2 border-dashed border-[#DECFC0] hover:border-[#7D1826] rounded-xl p-6 text-center bg-[#FAF7F2] hover:bg-[#F8F2EC] flex flex-col items-center justify-center space-y-2 transition-all">
          <Upload className="w-6 h-6 text-[#8C777A]" />
          <span className="text-xs font-semibold text-[#24060B]">Select any .docx file to test</span>
          <span className="text-[11px] text-[#8C777A]">Instantly inspects XML runs</span>
          <input
            type="file"
            accept=".docx"
            className="hidden"
            onChange={handleUploadCustomDocx}
          />
        </label>

        {/* Linter Diagnostic Report */}
        {linterStatus && (
          <div className="p-4 rounded-xl border border-[#DECFC0] bg-[#FFFDFB] space-y-2 animate-fade-in text-xs">
            {linterStatus.valid ? (
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preflight Check Passed! 100% Valid XML Tag Structure.</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-[#7D1826] font-bold">
                <AlertCircle className="w-4 h-4 text-[#7D1826]" />
                <span>Syntax Issues Detected in Template:</span>
              </div>
            )}

            {linterStatus.errors.length > 0 && (
              <ul className="list-disc list-inside text-[#7D1826] text-[11px] space-y-0.5">
                {linterStatus.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            )}

            {linterStatus.tags.length > 0 && (
              <div className="pt-2 text-[11px] text-[#5C4A4D]">
                <span className="font-semibold text-[#24060B]">Detected Template Variables ({linterStatus.tags.length}): </span>
                <span className="font-mono text-[#7D1826]">{linterStatus.tags.map((t) => `{${t}}`).join(", ")}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 3: Interactive Coordinate Mapper */}
      <PdfCoordinateMapper />
    </div>
  );
}
