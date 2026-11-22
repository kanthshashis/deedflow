"use client";

import React from "react";
import Link from "next/link";
import { FileEdit, ArrowUpRight, Plus, Building } from "lucide-react";

export default function DraftsPage() {
  const drafts = [
    {
      id: "doc-4",
      name: "Unit Cost Sheet & RERA Schedule",
      subtitle: "Milestone payment breakdown • Draft v1.2",
      customer: "Rohit Menon (GPA Suresh)",
      unit: "C-1202",
      status: "Draft",
      updated: "3 hours ago",
      downloadUrl: "/templates/unit-cost-sheet.docx",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            <span className="w-3 h-[2px] bg-emerald-600 rounded-full" />
            <span>Workspace Drafts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Unsaved &amp; In-Progress Drafts<span className="text-emerald-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Continue editing or finalize pending buyer contracts.
          </p>
        </div>

        <Link
          href="/dashboard/generate"
          className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New document</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">Pending Drafts (1)</h2>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
        </div>

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
              {drafts.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                        <FileEdit className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{doc.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-700 font-medium">{doc.customer}</td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                      {doc.unit}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-400 font-mono text-[11px]">{doc.updated}</td>
                  <td className="py-3.5 text-right">
                    <Link
                      href="/dashboard/generate"
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 inline-flex transition-colors"
                      title="Continue Editing"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
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
