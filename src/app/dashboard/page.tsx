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
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            <span className="w-3 h-[2px] bg-emerald-600 rounded-full" />
            <span>Document Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Aidan<span className="text-emerald-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Your apartment documents, ready for the next step.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/dashboard/parking"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Basement Grid</span>
          </Link>

          <Link
            href="/dashboard/draft/new"
            className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New document</span>
          </Link>
        </div>
      </div>

      {/* Pending Diff Approvals Alert Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950">
              3 Pending Diff Requests Awaiting Project Admin Sign-Off
            </h3>
            <p className="text-[11px] text-emerald-800">
              Updates to parking bays and owner profiles from OCR and Grid are held in the Diff Queue.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/approvals"
          className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs w-fit cursor-pointer"
        >
          <span>Open Diff Queue</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        </Link>
      </div>

      {/* 4 KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Documents */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Total documents</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              05
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              Across your active projects
            </span>
          </div>
        </div>

        {/* Card 2: Awaiting Signature */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Awaiting signature</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              02
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              Issued to customers
            </span>
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Completed</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              01
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              Signed by allottees
            </span>
          </div>
        </div>

        {/* Card 4: In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">In progress</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              02
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              Drafts and review
            </span>
          </div>
        </div>
      </div>

      {/* Recent Documents Container */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Recent documents</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track the paperwork moving through your apartment sales.
            </p>
          </div>

          <Link
            href="/dashboard/generate"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, unit, or document"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
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
                  "px-3 py-1.5 rounded-lg font-medium transition-colors spring-snap",
                  isSelected
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
              <tr className="border-b border-[#E5E7EB] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 font-semibold">Document</th>
                <th className="py-3 font-semibold">Customer</th>
                <th className="py-3 font-semibold">Unit</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Updated</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
                  {/* Document Column */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{doc.subtitle}</div>
                      </div>
                    </div>
                  </td>

                  {/* Customer Column */}
                  <td className="py-3.5 pr-4 text-slate-700 font-medium">
                    {doc.customer}
                  </td>

                  {/* Unit Column */}
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                      {doc.unit}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="py-3.5 pr-4">
                    <span
                      className={clsx(
                        "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                        doc.status === "Sent" && "bg-sky-50 text-sky-700 border border-sky-200",
                        doc.status === "Ready" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                        doc.status === "Signed" && "bg-emerald-100 text-emerald-800 border border-emerald-300",
                        doc.status === "Draft" && "bg-slate-100 text-slate-600 border border-slate-200"
                      )}
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          doc.status === "Sent" && "bg-sky-500",
                          doc.status === "Ready" && "bg-emerald-500",
                          doc.status === "Signed" && "bg-emerald-600",
                          doc.status === "Draft" && "bg-slate-400"
                        )}
                      />
                      <span>{doc.status}</span>
                    </span>
                  </td>

                  {/* Updated Column */}
                  <td className="py-3.5 pr-4 text-slate-400 font-mono text-[11px]">
                    {doc.updated}
                  </td>

                  {/* Action Link Column */}
                  <td className="py-3.5 text-right">
                    {doc.downloadUrl ? (
                      <a
                        href={doc.downloadUrl}
                        download
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 inline-flex transition-colors"
                        title="Download .DOCX"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href="/dashboard/generate"
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 inline-flex transition-colors"
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
