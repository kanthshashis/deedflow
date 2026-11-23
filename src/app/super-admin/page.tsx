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
  FileCheck2,
  Download,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { ProjectMetadata } from "@/lib/types";
import {
  getStoredProjects,
  toggleStoredProjectStatus,
  setActiveProjectId,
} from "@/lib/projectStore";
import {
  getAllAuditRecords,
  filterAuditRecords,
  exportAuditRecordsCsv,
  AuditRecord,
  AuditScope,
  AuditSeverity,
  AuditCategory,
} from "@/lib/auditStore";
import clsx from "clsx";

export default function SuperAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectProject, setInspectProject] = useState<ProjectMetadata | null>(null);

  // View state: Projects Matrix vs Enterprise Audit Stream
  const [viewMode, setViewMode] = useState<"projects" | "audit">("projects");
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [auditSearch, setAuditSearch] = useState("");
  const [selectedScope, setSelectedScope] = useState<AuditScope | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | "all">("all");

  const loadProjects = () => {
    setProjects(getStoredProjects());
  };

  const loadAuditRecords = () => {
    setAuditRecords(getAllAuditRecords());
  };

  useEffect(() => {
    loadProjects();
    loadAuditRecords();
    const handleProjectsChanged = () => loadProjects();
    const handleAuditLogged = () => loadAuditRecords();
    window.addEventListener("deedflow_projects_changed", handleProjectsChanged);
    window.addEventListener("deedflow_audit_logged", handleAuditLogged);
    window.addEventListener("storage", handleProjectsChanged);
    return () => {
      window.removeEventListener("deedflow_projects_changed", handleProjectsChanged);
      window.removeEventListener("deedflow_audit_logged", handleAuditLogged);
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

  const handleExportAuditCsv = () => {
    const csvData = exportAuditRecordsCsv(filteredAudit);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DeedFlow_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAudit = filterAuditRecords(auditRecords, {
    scope: selectedScope === "all" ? undefined : selectedScope,
    severity: selectedSeverity === "all" ? undefined : selectedSeverity,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: auditSearch,
  });

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

      {/* Top View Mode Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#DECFC0] pb-1">
        <button
          onClick={() => setViewMode("projects")}
          className={clsx(
            "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer",
            viewMode === "projects"
              ? "bg-[#821A2A] text-white shadow-xs"
              : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
          )}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Configured Projects &amp; Matrices</span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 text-current">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setViewMode("audit")}
          className={clsx(
            "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer",
            viewMode === "audit"
              ? "bg-[#821A2A] text-white shadow-xs"
              : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
          )}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span>Global Enterprise Audit Stream</span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Live
          </span>
        </button>
      </div>

      {/* View 1: Projects Table */}
      {viewMode === "projects" && (
        <div className="glossy-card bg-[#FFFDFB] border border-[#E8DFD3] rounded-2xl shadow-xs overflow-hidden animate-fade-in">
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
      )}

      {/* View 2: Global Enterprise Audit Stream */}
      {viewMode === "audit" && (
        <div className="space-y-4 animate-fade-in">
          {/* Audit Controls & Filter Bar */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#8C777A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user, action, target, builder..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#DECFC0] rounded-xl text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              {/* Scope Filter */}
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value as any)}
                className="text-xs bg-[#FAF7F2] border border-[#DECFC0] rounded-xl px-2.5 py-1.5 text-[#24060B] focus:outline-none cursor-pointer"
              >
                <option value="all">All Scopes (Global + Project)</option>
                <option value="global">Global Tenant Events</option>
                <option value="project">Project Workspace Events</option>
              </select>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as any)}
                className="text-xs bg-[#FAF7F2] border border-[#DECFC0] rounded-xl px-2.5 py-1.5 text-[#24060B] focus:outline-none cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="text-xs bg-[#FAF7F2] border border-[#DECFC0] rounded-xl px-2.5 py-1.5 text-[#24060B] focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="system">System &amp; Provisioning</option>
                <option value="compliance">RERA &amp; Compliance</option>
                <option value="parking">Cadastral Parking</option>
                <option value="document">Document &amp; ATS</option>
                <option value="security">Security &amp; Auth</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportAuditCsv}
              className="px-3.5 py-1.5 glossy-btn-ivory border-[#DECFC0] hover:border-[#821A2A] text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#821A2A]" />
              <span>Export Forensic CSV ({filteredAudit.length})</span>
            </button>
          </div>

          {/* Audit Ledger Table */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#E8DFD3] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#F8F2EC]/40">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#821A2A]" />
                <h2 className="text-sm font-bold font-serif text-[#24060B]">
                  Two-Tier Cross-Tenant Forensic Audit Trail
                </h2>
              </div>
              <span className="text-xs font-mono text-[#8C777A]">
                Showing {filteredAudit.length} of {auditRecords.length} recorded events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F2EC] border-b border-[#E8DFD3] text-[#5C4A4D] uppercase tracking-wider font-semibold text-[10px] font-mono">
                  <tr>
                    <th className="px-4 py-3">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Scope &amp; Builder</th>
                    <th className="px-4 py-3">User &amp; Role</th>
                    <th className="px-4 py-3">Action &amp; Target</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DD]">
                  {filteredAudit.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#8C777A]">
                        No audit events match your selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAudit.map((record) => (
                      <tr key={record.id} className="hover:bg-[#F8F2EC]/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-[11px] text-[#4A3538] whitespace-nowrap">
                          {new Date(record.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#24060B]">{record.builderName || "DeedFlow Global"}</div>
                          <div className="text-[10px] font-mono text-[#8C777A] flex items-center space-x-1">
                            <span
                              className={clsx(
                                "px-1.5 py-0.2 rounded font-bold uppercase",
                                record.scope === "global"
                                  ? "bg-[#FAF0F2] text-[#821A2A]"
                                  : "bg-[#F3EAE0] text-[#5C4A4D]"
                              )}
                            >
                              {record.scope}
                            </span>
                            {record.projectName && <span className="truncate max-w-[140px]">{record.projectName}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#24060B]">{record.userName}</div>
                          <div className="text-[10px] font-mono text-[#8C777A] uppercase">{record.userRole.replace("_", " ")}</div>
                        </td>
                        <td className="px-4 py-3 max-w-sm">
                          <div className="font-medium text-[#24060B]">{record.action}</div>
                          <div className="text-[11px] text-[#8C777A] font-mono truncate">{record.target}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#DECFC0] text-[#5C4A4D]">
                            {record.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={clsx(
                              "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full",
                              record.severity === "critical"
                                ? "bg-rose-100 text-rose-800"
                                : record.severity === "warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            )}
                          >
                            {record.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-[#8C777A] whitespace-nowrap">
                          {record.ipAddress}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
