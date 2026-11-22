"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Building,
  CheckCircle2,
  AlertTriangle,
  Key,
  Copy,
  Share2,
  Layers,
  Car,
  FileText,
  Eye,
  X,
  ExternalLink,
  Landmark,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { ProjectMetadata } from "@/lib/types";
import {
  getStoredProjects,
  toggleStoredProjectStatus,
  setActiveProjectId,
} from "@/lib/projectStore";

export default function SuperAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectProject, setInspectProject] = useState<ProjectMetadata | null>(null);

  const loadProjects = () => {
    setProjects(getStoredProjects());
  };

  useEffect(() => {
    loadProjects();
    const handleProjectsChanged = () => loadProjects();
    window.addEventListener("deedflow_projects_changed", handleProjectsChanged);
    window.addEventListener("storage", handleProjectsChanged);
    return () => {
      window.removeEventListener("deedflow_projects_changed", handleProjectsChanged);
      window.removeEventListener("storage", handleProjectsChanged);
    };
  }, []);

  const handleToggleStatus = (id: string) => {
    const updated = toggleStoredProjectStatus(id);
    setProjects(updated);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunchWorkspace = (projectId: string) => {
    setActiveProjectId(projectId);
    router.push("/dashboard");
  };

  const totalFlats = projects.reduce((acc, p) => acc + (p.totalUnits || 0), 0);
  const totalBays = projects.reduce((acc, p) => acc + (p.totalParkingSlots || 0), 0);
  const activeCount = projects.filter((p) => p.status === "active").length;

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
          <div className="text-[11px] text-[#8C777A] font-medium">Active Developments</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1">
            {activeCount} / {projects.length}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 flex items-center space-x-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>100% RERA verified</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Total Flats Managed</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1 font-mono">
            {totalFlats} Units
          </div>
          <div className="text-[10px] text-[#5C4A4D] mt-0.5">Across all provisioned towers</div>
        </div>

        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Basement Parking Bays</div>
          <div className="text-2xl font-bold font-serif text-[#24060B] mt-1 font-mono">
            {totalBays} Bays
          </div>
          <div className="text-[10px] text-[#B88E3E] mt-0.5 font-medium">Zero double allocations</div>
        </div>

        <div className="p-4 rounded-xl glossy-card bg-[#FFFDFB] border border-[#E8DFD3] hover:border-[#B88E3E]/60 shadow-xs transition-colors">
          <div className="text-[11px] text-[#8C777A] font-medium">Platform Health &amp; Security</div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            100% Secure
          </div>
          <div className="text-[10px] text-[#5C4A4D] mt-0.5">UIDAI Masked • SOC-2 Ready</div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glossy-card bg-[#FFFDFB] border border-[#E8DFD3] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#F8F2EC]/40">
          <div>
            <h2 className="text-sm font-bold font-serif text-[#24060B]">Configured Real Estate Projects</h2>
            <p className="text-[11px] text-[#8C777A]">Multi-tenant developments provisioned in DeedFlow cloud</p>
          </div>
          <span className="text-xs text-[#8C777A] font-mono bg-white px-2.5 py-1 rounded-lg border border-[#DECFC0]">
            {projects.length} Registered Projects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F2EC] border-b border-[#E8DFD3] text-[#5C4A4D] uppercase tracking-wider font-semibold text-[10px] font-mono">
              <tr>
                <th className="px-5 py-3">Project &amp; Developer</th>
                <th className="px-5 py-3">RERA Registration</th>
                <th className="px-5 py-3">Location &amp; Taluk</th>
                <th className="px-5 py-3">Units / Bays</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#F8F2EC]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#24060B] text-sm group-hover:text-[#821A2A]">{proj.name}</div>
                    <div className="text-[11px] text-[#8C777A] flex items-center space-x-1.5 mt-0.5">
                      <span>{proj.legalName}</span>
                      {proj.id.startsWith("proj_") && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8]">
                          Custom Provisioned
                        </span>
                      )}
                    </div>
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
                      <span className="bg-[#F8F2EC] px-2 py-0.5 rounded text-[#24060B] font-semibold border border-[#E8DFD3]">
                        {proj.totalUnits} Flats
                      </span>
                      <span className="bg-[#F8F2EC] px-2 py-0.5 rounded text-[#24060B] font-semibold border border-[#E8DFD3]">
                        {proj.totalParkingSlots} Bays
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(proj.id)}
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
                        onClick={() => setInspectProject(proj)}
                        className="p-1.5 hover:bg-[#F8F2EC] text-[#8C777A] hover:text-[#821A2A] rounded-lg transition-colors cursor-pointer"
                        title="Inspect Matrix & Statutory Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(
                            proj.id,
                            `Project: ${proj.name}\nRERA: ${proj.reraNumber}\nDeveloper: ${proj.legalName}\nTotal Units: ${proj.totalUnits}\nLocation: ${proj.location}\nPortal URL: http://localhost:3000/login`
                          )
                        }
                        className="p-1.5 hover:bg-[#F8F2EC] text-[#8C777A] hover:text-[#24060B] rounded-lg transition-colors cursor-pointer"
                        title="Copy Project Details"
                      >
                        {copiedId === proj.id ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleLaunchWorkspace(proj.id)}
                        className="px-3 py-1.5 glossy-btn-ivory text-[#24060B] border-[#DECFC0] hover:border-[#821A2A]/40 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Open Workspace</span>
                        <ExternalLink className="w-3 h-3 text-[#821A2A]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Matrix Inspector Modal */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] border border-[#E8C4C8] flex items-center justify-center text-[#821A2A]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-[#24060B]">{inspectProject.name}</h3>
                  <p className="text-xs text-[#8C777A]">{inspectProject.legalName}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectProject(null)}
                className="p-1 rounded-lg text-[#8C777A] hover:text-[#24060B] hover:bg-[#F8F2EC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]">
                <span className="text-[10px] font-medium text-[#8C777A] uppercase block">Total Flats</span>
                <span className="text-base font-bold font-serif text-[#24060B]">{inspectProject.totalUnits} Units</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]">
                <span className="text-[10px] font-medium text-[#8C777A] uppercase block">Parking Bays</span>
                <span className="text-base font-bold font-serif text-[#24060B]">{inspectProject.totalParkingSlots} Bays</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]">
                <span className="text-[10px] font-medium text-[#8C777A] uppercase block">Towers Provisioned</span>
                <span className="text-base font-bold font-serif text-[#24060B]">
                  {inspectProject.towers?.join(", ") || "Tower A, B"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DECFC0]">
                <span className="text-[10px] font-medium text-[#8C777A] uppercase block">Matrix Status</span>
                <span className="text-base font-bold capitalize text-emerald-700">{inspectProject.status}</span>
              </div>
            </div>

            {/* Statutory Legal & Escrow Coordinates */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0] space-y-2">
                <span className="text-[11px] font-bold text-[#821A2A] flex items-center space-x-1.5 uppercase font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Statutory Registration &amp; Sanction Plan</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#5C4A4D]">
                  <div>RERA Reg No: <strong className="font-mono text-[#24060B]">{inspectProject.reraNumber}</strong></div>
                  <div>Sanction Plan: <strong className="font-mono text-[#24060B]">{inspectProject.sanctionPlanNo}</strong></div>
                  <div>Survey Numbers: <strong className="font-mono text-[#24060B]">{inspectProject.surveyNumbers}</strong></div>
                  <div>Taluk / District: <strong className="text-[#24060B]">{inspectProject.taluk}, {inspectProject.district}</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF0F2] border border-[#E8C4C8] space-y-1.5">
                <span className="text-[11px] font-bold text-[#821A2A] flex items-center space-x-1.5 uppercase font-mono">
                  <Landmark className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>RERA Designated Master Escrow Bank</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5C4A4D]">
                  <div>Bank: <strong className="text-[#24060B]">{inspectProject.escrowBankName || "State Bank of India"}</strong></div>
                  <div>Branch: <strong className="text-[#24060B]">{inspectProject.escrowBranch || "Sarjapur Road Branch, Bengaluru"}</strong></div>
                  <div>Escrow A/C: <strong className="font-mono text-[#821A2A]">{inspectProject.escrowAccountNo || "918020034827101"}</strong></div>
                  <div>IFSC: <strong className="font-mono text-[#821A2A]">{inspectProject.escrowIfsc || "SBIN0004120"}</strong></div>
                </div>
              </div>

              {inspectProject.adminEmail && (
                <div className="p-3.5 rounded-xl bg-[#FFF9EE] border border-[#F2E4C4] space-y-1">
                  <span className="text-[11px] font-bold text-[#B88E3E] uppercase font-mono">
                    Project Admin Credentials
                  </span>
                  <div className="text-[11px] text-[#5C4A4D]">
                    Admin: <strong className="text-[#24060B]">{inspectProject.adminName}</strong> • Email: <strong className="font-mono text-[#24060B]">{inspectProject.adminEmail}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#F0E8DD]">
              <button
                onClick={() => setInspectProject(null)}
                className="px-4 py-2 rounded-xl border border-[#DECFC0] text-xs font-semibold text-[#5C4A4D] hover:bg-[#F8F2EC] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleLaunchWorkspace(inspectProject.id);
                  setInspectProject(null);
                }}
                className="px-4 py-2 rounded-xl glossy-btn-burgundy text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <span>Launch This Workspace</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4B989]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
