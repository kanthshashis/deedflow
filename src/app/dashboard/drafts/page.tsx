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
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-3 h-[2px] bg-[#7D1826] rounded-full" />
            <span>Workspace Drafts</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Unsaved &amp; In-Progress Drafts<span className="text-[#B88E3E]">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4A4D] mt-0.5">
            Continue editing or finalize pending buyer contracts.
          </p>
        </div>

        <Link
          href="/dashboard/draft/new"
          className="px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors w-fit"
        >
          <Plus className="w-4 h-4 text-[#D4B989]" />
          <span>New document</span>
        </Link>
      </div>

      <div className="glossy-card bg-[#FFFDFB] rounded-2xl border border-[#DECFC0] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold font-serif text-[#24060B]">Pending Drafts (1)</h2>
            <span className="w-2 h-2 rounded-full bg-[#B88E3E]" />
          </div>
        </div>

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
              {drafts.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8F2EC]/60 group transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#F2E4C4] flex items-center justify-center text-[#B88E3E] shrink-0">
                        <FileEdit className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#24060B] group-hover:text-[#7D1826] transition-colors">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-[#8C777A] mt-0.5">{doc.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-[#4A3538] font-medium">{doc.customer}</td>
                  <td className="py-3.5 px-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#F8F2EC] text-[#24060B] font-mono text-[11px] font-semibold border border-[#E8DFD3]">
                      {doc.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8F2EC] text-[#5C4A4D] border border-[#DECFC0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C777A]" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-[#8C777A] font-mono text-[11px]">{doc.updated}</td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href="/dashboard/draft/new"
                      className="p-1.5 text-[#8C777A] hover:text-[#4A0E17] rounded-lg hover:bg-[#FAF0F2] inline-flex transition-colors"
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
