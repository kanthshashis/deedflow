"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlusCircle, Building, CheckCircle2, AlertTriangle, Key, Copy, Share2, Layers, Car, FileText } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mockData";
import { ProjectMetadata } from "@/lib/types";

export default function SuperAdminPage() {
  const [projects, setProjects] = useState<ProjectMetadata[]>(MOCK_PROJECTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleProjectStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "suspended" : "active" }
          : p
      )
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E] animate-pulse" />
            <span>Global Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Builder Workspaces &amp; Matrix Provisioning
          </h1>
          <p className="text-xs text-[#5C4A4D] mt-0.5">
            Manage multi-tenant real estate developments, structural flat/parking matrices, and Project Admin credentials.
          </p>
        </div>

        <Link
          href="/super-admin/provision"
          className="px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4 text-[#D4B989]" />
          <span>Provision New Project Matrix</span>
        </Link>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Active Projects</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1">
            {projects.filter((p) => p.status === "active").length} / {projects.length}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 flex items-center space-x-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>100% RERA verified</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Total Flats Managed</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1">320 Units</div>
          <div className="text-[10px] text-[#5C4A4D] mt-0.5">Across Towers A, B &amp; C</div>
        </div>

        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Basement Parking Bays</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1">400 Bays</div>
          <div className="text-[10px] text-[#B88E3E] mt-0.5 font-medium">Zero double allocations</div>
        </div>

        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Total Documents Generated</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1">1,482 Docs</div>
          <div className="text-[10px] text-[#5C4A4D] mt-0.5">Bank Kits + Sale Deeds</div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#E8DFD3] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#F8F2EC]/40">
          <h2 className="text-sm font-bold font-serif text-[#24060B]">Configured Real Estate Projects</h2>
          <span className="text-xs text-[#8C777A] font-mono">Real-Time Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F2EC] border-b border-[#E8DFD3] text-[#5C4A4D] uppercase tracking-wider font-semibold text-[10px] font-mono">
              <tr>
                <th className="px-5 py-3">Project &amp; Developer</th>
                <th className="px-5 py-3">RERA Registration</th>
                <th className="px-5 py-3">Location &amp; Taluk</th>
                <th className="px-5 py-3">Units / Bays</th>
                <th className="px-5 py-3">Access Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#F8F2EC]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#24060B] text-sm group-hover:text-[#821A2A]">{proj.name}</div>
                    <div className="text-[11px] text-[#8C777A]">{proj.legalName}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-[#4A3538]">
                    {proj.reraNumber}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[#24060B]">{proj.taluk}, {proj.district}</div>
                    <div className="text-[10px] text-[#8C777A] font-mono truncate max-w-xs">{proj.location}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="bg-[#F8F2EC] px-2 py-0.5 rounded text-[#24060B] font-semibold border border-[#E8DFD3]">{proj.totalUnits} Flats</span>
                      <span className="bg-[#F8F2EC] px-2 py-0.5 rounded text-[#24060B] font-semibold border border-[#E8DFD3]">{proj.totalParkingSlots} Bays</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleProjectStatus(proj.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all ${
                        proj.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${proj.status === "active" ? "bg-emerald-600" : "bg-rose-600"}`} />
                      <span className="capitalize">{proj.status}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleCopy(proj.id, `Project: ${proj.name}\nRERA: ${proj.reraNumber}\nLogin URL: http://localhost:3000/login\nProject ID: ${proj.id}`)}
                        className="p-1.5 hover:bg-[#F8F2EC] text-[#8C777A] hover:text-[#24060B] rounded-lg transition-colors cursor-pointer"
                        title="Copy Project Details"
                      >
                        {copiedId === proj.id ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <Link
                        href="/dashboard"
                        className="px-3 py-1 glossy-btn-ivory text-[#24060B] border-[#DECFC0] rounded-lg text-xs font-semibold transition-colors"
                      >
                        Open Workspace
                      </Link>
                    </div>
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
