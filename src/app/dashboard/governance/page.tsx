"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, ShieldCheck, Download, FolderArchive } from "lucide-react";
import { MOCK_UNITS } from "@/lib/mockData";
import { UnitInventory } from "@/lib/types";

interface VaultDocument {
  id: string;
  filename: string;
  fileType: string;
  detectedType: "PAN Card" | "Passport" | "Booking Application" | "Allotment Letter" | "Bank NOC";
  detectedFlat: string;
  confidence: number;
  status: "matched" | "manual_check";
}

export default function GovernancePage() {
  const [units, setUnits] = useState<UnitInventory[]>(MOCK_UNITS);
  const [isClassifying, setIsClassifying] = useState(false);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([
    {
      id: "vd_01",
      filename: "IMG_20261115_PAN_B101.jpg",
      fileType: "image/jpeg",
      detectedType: "PAN Card",
      detectedFlat: "B-101",
      confidence: 0.98,
      status: "matched",
    },
    {
      id: "vd_02",
      filename: "Sobha_B103_Booking_Form_Signed.pdf",
      fileType: "application/pdf",
      detectedType: "Booking Application",
      detectedFlat: "B-103",
      confidence: 0.94,
      status: "matched",
    },
    {
      id: "vd_03",
      filename: "SBI_HomeLoan_NOC_Scan_B302.pdf",
      fileType: "application/pdf",
      detectedType: "Bank NOC",
      detectedFlat: "B-302",
      confidence: 0.89,
      status: "matched",
    },
  ]);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleSimulateBulkIngestion = () => {
    setUploadNotice("Bulk sheet analyzed: 3 new flats assigned directly; 2 existing owners routed to Diff Approval Queue.");
    setTimeout(() => setUploadNotice(null), 6000);
  };

  const handleDropFiles = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    setIsClassifying(true);
    setTimeout(() => {
      const newDoc: VaultDocument = {
        id: `vd_${Date.now()}`,
        filename: "Scanned_KYC_DL_B104.pdf",
        fileType: "application/pdf",
        detectedType: "Passport",
        detectedFlat: "B-104",
        confidence: 0.96,
        status: "matched",
      };
      setVaultDocs((prev) => [newDoc, ...prev]);
      setIsClassifying(false);
      setUploadNotice("Gemini 2.5 Flash auto-classified 1 new document and matched it to Flat B-104.");
      setTimeout(() => setUploadNotice(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Master Data Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Data Governance &amp; Smart Document Vault
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Initial unassigned records commit directly. Any edits to existing owners automatically route to the Diff Review Queue.
          </p>
        </div>

        <Link
          href="/dashboard/approvals"
          className="px-4 py-2.5 bg-[#0F172A] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-xs cursor-pointer w-fit"
        >
          <span>Open Diff Approval Queue</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </Link>
      </div>

      {uploadNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Two-Column Governance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Bulk Add vs Gated Update */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-700">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Bulk Ingestion Engine</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Smart Routing
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Upload your project schedule (.xlsx/.csv). DeedFlow automatically differentiates between fresh allottees and existing owner modifications:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unassigned Flat (New)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Directly inserts owner profile and commits to live database without friction.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Assigned Flat (Update)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Safely isolates change into Diff Queue. Requires Project Admin approval before mutation.
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 p-6 rounded-2xl text-center space-y-3 bg-slate-50/50 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-800">Drop Master Inventory (.xlsx or .csv)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Supports Sole, Joint, NRI GPA, and Corporate columns</p>
            </div>
            <button
              onClick={handleSimulateBulkIngestion}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              Simulate Ingestion of 5 Flats
            </button>
          </div>
        </div>

        {/* Right Column: Smart Document Vault Auto-Classifier */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Smart Document Vault Auto-Classifier</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
              Gemini 2.5 Flash
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Drag-and-drop up to 50 mixed PDFs/photos (PAN cards, application forms, bank NOCs). The model identifies document category, detects flat number, and organizes them automatically:
          </p>

          <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 p-5 rounded-2xl text-center space-y-2 bg-indigo-50/20 transition-colors block cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleDropFiles}
            />
            <FolderArchive className="w-7 h-7 text-indigo-600 mx-auto" />
            <p className="text-xs font-bold text-slate-800">
              {isClassifying ? "Gemini 2.5 Flash Classifying Documents..." : "Click or Drop Mixed KYC Files Here"}
            </p>
            <p className="text-[11px] text-slate-500">Auto-routes to Flat Digital Dossier</p>
          </label>

          {/* Classified Vault Items Table */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase font-mono">
              Classified Document Dossiers ({vaultDocs.length})
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden text-xs">
              {vaultDocs.map((doc) => (
                <div key={doc.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-xs">{doc.filename}</div>
                      <div className="text-[10px] text-slate-500">
                        {doc.detectedType} • Confidence: <span className="font-mono font-bold text-emerald-700">{(doc.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] text-white font-mono font-bold text-xs">
                    Flat {doc.detectedFlat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
