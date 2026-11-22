"use client";

import React, { useState } from "react";
import { lintDocxTemplate } from "@/lib/docxEngine";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode2,
  Plus,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  History,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import clsx from "clsx";

interface TemplateVersion {
  id: string;
  version: string;
  label: string;
  updatedBy: string;
  updatedAt: string;
  status: "active" | "archived" | "draft";
  downloadUrl: string;
  notes: string;
  detectedTagsCount: number;
}

interface TemplateCategory {
  id: string;
  title: string;
  code: string;
  description: string;
  defaultFilename: string;
  activeVersion: string;
  versions: TemplateVersion[];
  tags: string[];
}

const INITIAL_CATEGORIES: TemplateCategory[] = [
  {
    id: "parking",
    title: "Car Parking Allotment Letter",
    code: "DF-TPL-PARK",
    description: "Allotment letter for single or tandem parking bays appurtenant to the apartment with Nahalchand Laloochand legal shield.",
    defaultFilename: "car-parking-allotment.docx",
    activeVersion: "v1.2",
    versions: [
      {
        id: "v1.2",
        version: "v1.2",
        label: "Supreme Court Appurtenancy & Tandem Bay Update",
        updatedBy: "Advocate Krishnamurthy",
        updatedAt: "Yesterday, 4:30 PM",
        status: "active",
        downloadUrl: "/templates/car-parking-allotment.docx",
        notes: "Incorporated non-severable appurtenancy clause and support for dual tandem parking slots.",
        detectedTagsCount: 18,
      },
      {
        id: "v1.1",
        version: "v1.1",
        label: "Karnataka RERA Cadastral Demarcation",
        updatedBy: "Pooja Hegde",
        updatedAt: "12 Nov 2026",
        status: "archived",
        downloadUrl: "/templates/car-parking-allotment.docx",
        notes: "Added basement level and pillar coordinate boundary parameters.",
        detectedTagsCount: 14,
      },
      {
        id: "v1.0",
        version: "v1.0",
        label: "Initial Project Baseline Allotment",
        updatedBy: "Aidan Morgan",
        updatedAt: "01 Oct 2026",
        status: "archived",
        downloadUrl: "/templates/car-parking-allotment.docx",
        notes: "Baseline single car park letterhead template.",
        detectedTagsCount: 12,
      },
    ],
    tags: [
      "company_name", "company_cin", "project_name", "project_rera_no",
      "flat_no", "tower_name", "floor_ordinal", "buyer_name", "buyer_pan",
      "parking_slot_no", "parking_level", "parking_type", "parking_fee_formatted", "parking_fee_words"
    ],
  },
  {
    id: "ats",
    title: "Karnataka RERA Agreement for Sale (ATS)",
    code: "DF-TPL-ATS",
    description: "Statutory 30-page Model Agreement for Sale (Form N) with 6-stage construction milestones and Section 14 defect liability.",
    defaultFilename: "karnataka-rera-sale-agreement.docx",
    activeVersion: "v2.1",
    versions: [
      {
        id: "v2.1",
        version: "v2.1",
        label: "Karnataka RERA Form N 2026 Mandate",
        updatedBy: "Advocate Krishnamurthy",
        updatedAt: "18 Nov 2026",
        status: "active",
        downloadUrl: "/templates/karnataka-rera-sale-agreement.docx",
        notes: "Standardized 5-year structural defect warranty under Sec 14(3) and statutory milestone payment schedule.",
        detectedTagsCount: 26,
      },
      {
        id: "v2.0",
        version: "v2.0",
        label: "Bi-annual RERA Amendment Baseline",
        updatedBy: "Aidan Morgan",
        updatedAt: "15 Aug 2026",
        status: "archived",
        downloadUrl: "/templates/karnataka-rera-sale-agreement.docx",
        notes: "Initial deployment of Form N clauses.",
        detectedTagsCount: 22,
      },
    ],
    tags: [
      "company_name", "company_cin", "project_name", "project_rera_no",
      "buyer_name", "buyer_pan", "buyer_aadhaar_masked", "buyer_address",
      "flat_no", "carpet_sqft", "carpet_sqm", "sba_sqft", "uds_sqft",
      "total_sale_price_formatted", "total_sale_price_words", "possession_date"
    ],
  },
  {
    id: "deed",
    title: "Kaveri 2.0 Sub-Registrar Sale Deed Dossier",
    code: "DF-TPL-DEED",
    description: "Sub-Registrar registration deed pre-formatted for Karnataka Kaveri 2.0 portal with Schedules A, B, C, and D.",
    defaultFilename: "kaveri-sale-deed-dossier.docx",
    activeVersion: "v1.4",
    versions: [
      {
        id: "v1.4",
        version: "v1.4",
        label: "Kaveri 2.0 e-Stamp & Boundary Standard",
        updatedBy: "Advocate Krishnamurthy",
        updatedAt: "20 Nov 2026",
        status: "active",
        downloadUrl: "/templates/kaveri-sale-deed-dossier.docx",
        notes: "Includes Schedule C 4-sided internal boundary bearings and automated e-Stamp certificate cross-referencing.",
        detectedTagsCount: 30,
      },
      {
        id: "v1.3",
        version: "v1.3",
        label: "Bangalore East SRO Formats",
        updatedBy: "Pooja Hegde",
        updatedAt: "05 Nov 2026",
        status: "archived",
        downloadUrl: "/templates/kaveri-sale-deed-dossier.docx",
        notes: "Schedule A master survey number updates.",
        detectedTagsCount: 25,
      },
    ],
    tags: [
      "e_stamp_certificate_no", "company_name", "buyer_name", "buyer_pan",
      "total_sale_price_formatted", "survey_numbers", "location", "taluk",
      "unit_north", "unit_south", "unit_east", "unit_west", "uds_sqft"
    ],
  },
  {
    id: "noc",
    title: "Builder Bank Home Loan NOC",
    code: "DF-TPL-NOC",
    description: "Tripartite mortgage permission letter for SBI RACPC, HDFC Bank, ICICI Bank, Canara Bank, and Axis Bank.",
    defaultFilename: "builder-home-loan-noc.docx",
    activeVersion: "v1.3",
    versions: [
      {
        id: "v1.3",
        version: "v1.3",
        label: "Big 5 Bank Tripartite Pre-Certified Standard",
        updatedBy: "Advocate Krishnamurthy",
        updatedAt: "10 Nov 2026",
        status: "active",
        downloadUrl: "/templates/builder-home-loan-noc.docx",
        notes: "Direct disbursement indemnity clause and RERA Master Escrow account details.",
        detectedTagsCount: 20,
      },
    ],
    tags: [
      "bank_name", "bank_branch_address", "buyer_name", "flat_no",
      "total_sale_price_formatted", "amount_received_formatted", "balance_amount_formatted",
      "rera_bank_account_no", "rera_bank_ifsc"
    ],
  },
];

export default function TemplatesPage() {
  const [categories, setCategories] = useState<TemplateCategory[]>(INITIAL_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ats");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New Version Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [newVersionLabel, setNewVersionLabel] = useState("");
  const [newVersionNotes, setNewVersionNotes] = useState("");
  const [linterResult, setLinterResult] = useState<{
    tested: boolean;
    valid: boolean;
    errors: string[];
    tags: string[];
  } | null>(null);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(`{${tag}}`);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleUploadDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    try {
      const buffer = await file.arrayBuffer();
      const result = lintDocxTemplate(buffer);

      setLinterResult({
        tested: true,
        valid: result.isValid,
        errors: result.errors,
        tags: result.detectedTags,
      });

      setNewVersionLabel(file.name.replace(".docx", ""));
    } catch (err: any) {
      setLinterResult({
        tested: true,
        valid: false,
        errors: [err.message || "Failed to inspect DOCX XML"],
        tags: [],
      });
    }
  };

  const handlePublishNewVersion = () => {
    if (!uploadedFile || !linterResult?.valid) return;

    const nextVersionNum = `v${(parseFloat(activeCategory.activeVersion.replace("v", "")) + 0.1).toFixed(1)}`;

    const newVersion: TemplateVersion = {
      id: nextVersionNum,
      version: nextVersionNum,
      label: newVersionLabel || "Advocate Custom Update",
      updatedBy: "Project Admin",
      updatedAt: "Just now",
      status: "active",
      downloadUrl: URL.createObjectURL(uploadedFile),
      notes: newVersionNotes || "Uploaded through DeedFlow Template Studio.",
      detectedTagsCount: linterResult.tags.length,
    };

    const updatedCategories = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          activeVersion: nextVersionNum,
          versions: [
            newVersion,
            ...cat.versions.map((v) => ({ ...v, status: "archived" as const })),
          ],
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setUploadedFile(null);
    setLinterResult(null);
    setNewVersionLabel("");
    setNewVersionNotes("");
    setNotification(`Successfully published ${nextVersionNum} as the new ACTIVE template for ${activeCategory.title}!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSetActiveVersion = (versionId: string) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          activeVersion: versionId,
          versions: cat.versions.map((v) => ({
            ...v,
            status: v.id === versionId ? ("active" as const) : ("archived" as const),
          })),
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setNotification(`Template ${versionId} is now set as ACTIVE for ${activeCategory.title}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#821A2A] uppercase">
            <span className="w-3 h-[2px] bg-[#821A2A] rounded-full" />
            <span>Legal Governance &amp; Versioning</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Template Studio &amp; Version Manager<span className="text-[#B88E3E]">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4A4D] mt-0.5">
            Upload custom company letterheads, manage contract versions (v1.0 to v2.0), and inspect smart tags without writing code.
          </p>
        </div>

        <a
          href={`/templates/${activeCategory.defaultFilename}`}
          download
          className="px-4 py-2.5 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A]/40 text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-2xs transition-colors cursor-pointer w-fit"
        >
          <Download className="w-4 h-4 text-[#821A2A]" />
          <span>Download Baseline .DOCX</span>
        </a>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="bg-[#FFF9EE] border border-[#F2E4C4] text-[#821A2A] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[#8C777A] hover:text-[#24060B] text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Category Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setUploadedFile(null);
                setLinterResult(null);
              }}
              className={clsx(
                "p-4 rounded-2xl border text-left transition-all cursor-pointer select-none space-y-2",
                isSelected
                  ? "bg-[#FFFDFB] border-[#821A2A] shadow-xs ring-2 ring-[#821A2A]/10"
                  : "bg-[#FAF7F2] border-[#DECFC0] hover:bg-[#FFFDFB] hover:border-[#821A2A]/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#8C777A]">{cat.code}</span>
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                    isSelected ? "bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8]" : "bg-white text-[#5C4A4D] border border-[#DECFC0]"
                  )}
                >
                  {cat.activeVersion} Active
                </span>
              </div>
              <h3 className="font-bold font-serif text-xs sm:text-sm text-[#24060B] line-clamp-1">
                {cat.title}
              </h3>
              <p className="text-[11px] text-[#5C4A4D] line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Version History & Rollback (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Template Status Card */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8DD] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase">
                    Currently In Production
                  </span>
                  <span className="text-xs font-mono font-bold text-[#821A2A]">{activeCategory.activeVersion}</span>
                </div>
                <h2 className="text-lg font-bold font-serif text-[#24060B] tracking-tight mt-1">
                  {activeCategory.title}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`/templates/${activeCategory.defaultFilename}`}
                  download
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F2EAE0] text-[#24060B] border border-[#DECFC0] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Download Active .DOCX</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-[#5C4A4D] leading-relaxed">
              {activeCategory.description}
            </p>

            {/* Version History List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-serif text-[#24060B] flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-[#821A2A]" />
                  <span>Version History &amp; Audit Trail ({activeCategory.versions.length} versions)</span>
                </h3>
                <span className="text-[10px] font-mono text-[#8C777A]">1-Click Rollback Enabled</span>
              </div>

              <div className="divide-y divide-[#F0E8DD] rounded-xl border border-[#DECFC0] overflow-hidden bg-[#FAF7F2]">
                {activeCategory.versions.map((ver) => {
                  const isActive = ver.status === "active";
                  return (
                    <div
                      key={ver.id}
                      className={clsx(
                        "p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                        isActive ? "bg-[#FFFDFB]" : "hover:bg-[#F5EFE8]"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#24060B]">{ver.version}</span>
                          <span className="text-xs font-bold text-[#24060B]">{ver.label}</span>
                          {isActive && (
                            <span className="px-2 py-0.2 rounded-full bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8] text-[9px] font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5C4A4D]">{ver.notes}</p>
                        <div className="flex items-center space-x-3 text-[10px] text-[#8C777A] font-mono">
                          <span>Updated by: {ver.updatedBy}</span>
                          <span>•</span>
                          <span>{ver.updatedAt}</span>
                          <span>•</span>
                          <span>{ver.detectedTagsCount} smart tags</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
                        <a
                          href={ver.downloadUrl}
                          download={`${activeCategory.code}_${ver.version}.docx`}
                          className="p-1.5 text-[#8C777A] hover:text-[#24060B] rounded-lg hover:bg-[#FAF0F2] transition-colors"
                          title="Download this version"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {!isActive && (
                          <button
                            onClick={() => handleSetActiveVersion(ver.id)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#821A2A] text-[#24060B] hover:text-white border border-[#DECFC0] hover:border-[#821A2A] text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Activate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upload New Custom Version Card */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#F0E8DD] pb-3">
              <h3 className="text-sm font-bold font-serif text-[#24060B]">
                Upload Advocate Custom Letterhead (.DOCX)
              </h3>
              <p className="text-xs text-[#5C4A4D] mt-0.5">
                Drop your company's modified Word file. DeedFlow scans the XML tags before you publish.
              </p>
            </div>

            <label className="cursor-pointer border-2 border-dashed border-[#DECFC0] hover:border-[#821A2A] rounded-2xl p-6 text-center bg-[#FAF7F2] hover:bg-[#FFFDFB] flex flex-col items-center justify-center space-y-2 transition-all">
              <Upload className="w-7 h-7 text-[#821A2A]" />
              <span className="text-xs font-bold text-[#24060B]">
                {uploadedFile ? uploadedFile.name : "Click or Drag & Drop .docx template here"}
              </span>
              <span className="text-[11px] text-[#8C777A]">
                Automatic XML Syntax Inspection &amp; Tag Extraction
              </span>
              <input
                type="file"
                accept=".docx"
                className="hidden"
                onChange={handleUploadDocx}
              />
            </label>

            {/* Diagnostic Report & Publish Confirmation */}
            {linterResult && (
              <div className="p-4 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] space-y-3 animate-fade-in text-xs">
                {linterResult.valid ? (
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Preflight Passed! 100% Valid XML Tag Structure ({linterResult.tags.length} smart tags found).</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-[#7D1826] font-bold">
                    <AlertCircle className="w-4 h-4 text-[#7D1826] shrink-0" />
                    <span>Syntax Error in Word Document:</span>
                  </div>
                )}

                {linterResult.errors.length > 0 && (
                  <ul className="list-disc list-inside text-[#7D1826] text-[11px] space-y-1">
                    {linterResult.errors.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                )}

                {linterResult.valid && (
                  <div className="space-y-3 pt-2 border-t border-[#DECFC0]/60">
                    <div>
                      <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Version Title / Reason</label>
                      <input
                        type="text"
                        placeholder="e.g. Added SBI RACPC Tripartite mortgage clause"
                        value={newVersionLabel}
                        onChange={(e) => setNewVersionLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-white text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Release Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Legal approved on 22-Nov-2026 by Krishnamurthy"
                        value={newVersionNotes}
                        onChange={(e) => setNewVersionNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-white text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                      />
                    </div>

                    <button
                      onClick={handlePublishNewVersion}
                      className="px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4B989]" />
                      <span>Publish &amp; Activate as Next Version</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Smart Tags Cheat Sheet for Advocates (1 col) */}
        <div className="space-y-5">
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#F0E8DD] pb-3">
              <Tag className="w-4 h-4 text-[#821A2A]" />
              <h3 className="text-sm font-bold font-serif text-[#24060B]">Smart Tag Directory</h3>
            </div>
            <p className="text-xs text-[#5C4A4D] leading-relaxed">
              Advocates can paste these tokens directly into Microsoft Word. DeedFlow injects the exact values during 2-click generation.
            </p>

            <div className="space-y-2">
              {activeCategory.tags.map((tag) => {
                const isCopied = copiedTag === tag;
                return (
                  <div
                    key={tag}
                    onClick={() => handleCopyTag(tag)}
                    className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0F2] border border-[#DECFC0] hover:border-[#E8C4C8] transition-colors flex items-center justify-between cursor-pointer group"
                    title="Click to copy tag"
                  >
                    <span className="font-mono text-xs font-semibold text-[#821A2A]">
                      {`{${tag}}`}
                    </span>
                    <button className="text-[#8C777A] group-hover:text-[#821A2A] transition-colors">
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-[#5C4A4D] bg-[#FAF7F2] p-3 rounded-xl border border-[#DECFC0]/60">
              <span className="font-semibold text-[#24060B]">Advocate Tip:</span> Any text inside curly braces `{`{...}`}` is treated as dynamic. Currency values are automatically converted into English Indian Rupees words (e.g. *Rupees Eighty-Eight Lakhs Only*).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
