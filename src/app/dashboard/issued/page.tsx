"use client";

import React from "react";
import Link from "next/link";
import { Send, ArrowUpRight, Plus, Building } from "lucide-react";

export default function IssuedPage() {
  const issued = [
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            <span className="w-3 h-[2px] bg-emerald-600 rounded-full" />
            <span>Outbound Agreements</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Issued Documents<span className="text-emerald-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Documents dispatched to buyers and banks awaiting digital signature or stamp reconciliation.
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
            <h2 className="text-base font-bold text-slate-900">Active Dispatches (2)</h2>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
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
              {issued.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
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
                  <td className="py-3.5 pr-4 text-slate-700 font-medium">{doc.customer}</td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                      {doc.unit}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-400 font-mono text-[11px]">{doc.updated}</td>
                  <td className="py-3.5 text-right">
                    <a
                      href={doc.downloadUrl}
                      download
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 inline-flex transition-colors"
                      title="Download .DOCX"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
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
