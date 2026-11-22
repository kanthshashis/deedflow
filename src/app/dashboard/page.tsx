"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  Plus,
  Search,
  ArrowUpRight,
  Building,
  Car,
  Download,
  Filter,
} from "lucide-react";
import clsx from "clsx";

interface DocumentItem {
  id: string;
  name: string;
  subtitle: string;
  customer: string;
  unit: string;
  status: "Sent" | "Ready" | "Signed" | "Draft";
  updated: string;
  downloadUrl?: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Apartment allotment letter",
    subtitle: "Riverside Residences • Scheme A",
    customer: "Meera Sundaram",
    unit: "*204",
    status: "Sent",
    updated: "12 min ago",
    downloadUrl: "/templates/car-parking-allotment.docx",
  },
  {
    id: "doc-2",
    name: "Home Loan Bank NOC (SBI Empanelled)",
    subtitle: "Sobha Royal Pavilion • Tower B",
    customer: "Kantharaju Mariyappa",
    unit: "B-302",
    status: "Ready",
    updated: "25 min ago",
    downloadUrl: "/templates/builder-home-loan-noc.docx",
  },
  {
    id: "doc-3",
    name: "Exclusive Car Parking Bay Allotment",
    subtitle: "Dedicated Bay B1-04 (Covered Standard)",
    customer: "Vikram & Ananya Rao",
    unit: "A-504",
    status: "Signed",
    updated: "1 hour ago",
    downloadUrl: "/templates/car-parking-allotment.docx",
  },
  {
    id: "doc-4",
    name: "Unit Cost Sheet & RERA Schedule",
    subtitle: "Milestone payment breakdown",
    customer: "Rohit Menon (GPA Suresh)",
    unit: "C-1202",
    status: "Draft",
    updated: "3 hours ago",
    downloadUrl: "/templates/unit-cost-sheet.docx",
  },
  {
    id: "doc-5",
    name: "Tripartite Agreement Schedule C",
    subtitle: "Assetz Marq 3.0 • Tower C",
    customer: "Pooja Hegde",
    unit: "B-101",
    status: "Sent",
    updated: "1 day ago",
    downloadUrl: "/templates/car-parking-allotment.docx",
  },
];

export default function DashboardOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Draft" | "Ready" | "Sent" | "Signed">("All");

  const filteredDocs = INITIAL_DOCS.filter((doc) => {
    if (activeFilter !== "All" && doc.status !== activeFilter) return false;
    if (
      searchQuery &&
      !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.unit.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-3 h-[2px] bg-[#7D1826] rounded-full" />
            <span>Document Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#24060B] tracking-tight">
            Good morning, Aidan<span className="text-[#B88E3E]">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4A4D]">
            Your apartment documents, ready for the next step.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/dashboard/parking"
            className="px-4 py-2.5 glossy-btn-ivory text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Car className="w-4 h-4 text-[#7D1826]" />
            <span>Basement Grid</span>
          </Link>

          <Link
            href="/dashboard/draft/new"
            className="px-4 py-2.5 glossy-btn-burgundy text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors cursor-pointer hover:brightness-105"
          >
            <Plus className="w-4 h-4 text-[#D4B989]" />
            <span>New document</span>
          </Link>
        </div>
      </div>

      {/* Pending Diff Approvals Alert Banner */}
      <div className="p-4 glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#821A2A] text-white border border-[#821A2A]/40 flex items-center justify-center font-bold text-xs shadow-xs">
            3
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#24060B] font-serif">
              3 Pending Diff Requests Awaiting Project Admin Sign-Off
            </h3>
            <p className="text-[11px] text-[#5C4A4D]">
              Updates to parking bays and owner profiles from OCR and Grid are held in the Diff Queue.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/approvals"
          className="px-4 py-2 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs w-fit cursor-pointer"
        >
          <span>Open Diff Queue</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#D4B989]" />
        </Link>
      </div>

      {/* 4 KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Documents */}
        <div className="glossy-card bg-[#FFFDFB] rounded-2xl p-5 border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs space-y-3 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#F8F2EC] border border-[#E8DFD3] flex items-center justify-center text-[#821A2A]">
            <FileText className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#5C4A4D] font-medium">Total documents</span>
            <div className="text-3xl font-bold font-serif text-[#24060B] tracking-tight">
              05
            </div>
            <span className="text-[11px] text-[#8C777A] block truncate">
              Across your active projects
            </span>
          </div>
        </div>

        {/* Card 2: Awaiting Signature */}
        <div className="glossy-card bg-[#FFFDFB] rounded-2xl p-5 border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs space-y-3 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] flex items-center justify-center text-[#B88E3E] border border-[#F2E4C4]">
            <Clock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#5C4A4D] font-medium">Awaiting signature</span>
            <div className="text-3xl font-bold font-serif text-[#24060B] tracking-tight">
              02
            </div>
            <span className="text-[11px] text-[#8C777A] block truncate">
              Issued to customers
            </span>
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="glossy-card bg-[#FFFDFB] rounded-2xl p-5 border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs space-y-3 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-50/80 flex items-center justify-center text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#5C4A4D] font-medium">Completed</span>
            <div className="text-3xl font-bold font-serif text-[#24060B] tracking-tight">
              01
            </div>
            <span className="text-[11px] text-[#8C777A] block truncate">
              Signed by allottees
            </span>
          </div>
        </div>

        {/* Card 4: In Progress */}
        <div className="glossy-card bg-[#FFFDFB] rounded-2xl p-5 border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs space-y-3 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#FAF0F2] flex items-center justify-center text-[#7D1826] border border-[#F0D5D9]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#5C4A4D] font-medium">In progress</span>
            <div className="text-3xl font-bold font-serif text-[#24060B] tracking-tight">
              02
            </div>
            <span className="text-[11px] text-[#8C777A] block truncate">
              Drafts and review
            </span>
          </div>
        </div>
      </div>

      {/* Recent Documents Container */}
      <div className="glossy-card bg-[#FFFDFB] rounded-2xl border border-[#E8DFD3] p-5 sm:p-6 shadow-xs space-y-5">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold font-serif text-[#24060B]">Recent documents</h2>
              <span className="w-2 h-2 rounded-full bg-[#B88E3E]" />
            </div>
            <p className="text-xs text-[#5C4A4D] mt-0.5">
              Track the paperwork moving through your apartment sales.
            </p>
          </div>

          <Link
            href="/dashboard/generate"
            className="text-xs font-semibold text-[#5C4A4D] hover:text-[#821A2A] flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C777A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, unit, or document"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] placeholder-[#8C777A] focus:outline-none focus:border-[#821A2A] focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {(["All", "Draft", "Ready", "Sent", "Signed"] as const).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg font-medium transition-colors spring-snap cursor-pointer",
                  isSelected
                    ? "bg-[#821A2A] text-white font-bold shadow-xs"
                    : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#F8F2EC]"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DFD3] text-[11px] font-mono text-[#8C777A] uppercase tracking-wider bg-[#F8F2EC]/60">
                <th className="py-3 px-3 font-semibold rounded-l-lg">Document</th>
                <th className="py-3 px-2 font-semibold">Customer</th>
                <th className="py-3 px-2 font-semibold">Unit</th>
                <th className="py-3 px-2 font-semibold">Status</th>
                <th className="py-3 px-2 font-semibold">Updated</th>
                <th className="py-3 px-3 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8F2EC]/60 group transition-colors">
                  {/* Document Column */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0F2] border border-[#F0D5D9] flex items-center justify-center text-[#7D1826] shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#24060B] group-hover:text-[#7D1826] transition-colors">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-[#8C777A] mt-0.5">{doc.subtitle}</div>
                      </div>
                    </div>
                  </td>

                  {/* Customer Column */}
                  <td className="py-3.5 px-2 text-[#4A3538] font-medium">
                    {doc.customer}
                  </td>

                  {/* Unit Column */}
                  <td className="py-3.5 px-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#F8F2EC] text-[#24060B] font-mono text-[11px] font-semibold border border-[#E8DFD3]">
                      {doc.unit}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="py-3.5 px-2">
                    <span
                      className={clsx(
                        "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                        doc.status === "Sent" && "bg-sky-50 text-sky-800 border border-sky-200",
                        doc.status === "Ready" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
                        doc.status === "Signed" && "bg-[#FFF9EE] text-[#B88E3E] border border-[#F2E4C4]",
                        doc.status === "Draft" && "bg-[#F8F2EC] text-[#5C4A4D] border border-[#DECFC0]"
                      )}
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          doc.status === "Sent" && "bg-sky-600",
                          doc.status === "Ready" && "bg-emerald-600",
                          doc.status === "Signed" && "bg-[#B88E3E]",
                          doc.status === "Draft" && "bg-[#8C777A]"
                        )}
                      />
                      <span>{doc.status}</span>
                    </span>
                  </td>

                  {/* Updated Column */}
                  <td className="py-3.5 px-2 text-[#8C777A] font-mono text-[11px]">
                    {doc.updated}
                  </td>

                  {/* Action Link Column */}
                  <td className="py-3.5 px-3 text-right">
                    {doc.downloadUrl ? (
                      <a
                        href={doc.downloadUrl}
                        download
                        className="p-1.5 text-[#8C777A] hover:text-[#821A2A] rounded-lg hover:bg-[#FAF0F2] inline-flex transition-colors"
                        title="Download .DOCX"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href="/dashboard/generate"
                        className="p-1.5 text-[#8C777A] hover:text-[#821A2A] rounded-lg hover:bg-[#FAF0F2] inline-flex transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
