"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, RotateCcw, Clock, AlertTriangle, ShieldCheck, ArrowRight, Filter, Search, FileText, Lock } from "lucide-react";
import { MOCK_CHANGE_REQUESTS, MOCK_AUDIT_LOGS, DEMO_USERS } from "@/lib/mockData";
import { ChangeRequest, AuditLog, UserRole, hasPermission } from "@/lib/types";

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "audit">("pending");
  const [requests, setRequests] = useState<ChangeRequest[]>(MOCK_CHANGE_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>("project_admin");
  const [perspectiveRole, setPerspectiveRole] = useState<UserRole | "omni">("omni");

  const syncRole = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("deedflow_active_role") as UserRole | null;
      if (stored) setCurrentRole(stored);
      const storedPerspective = localStorage.getItem("deedflow_perspective_role") as (UserRole | "omni") | null;
      if (storedPerspective) setPerspectiveRole(storedPerspective);
      else setPerspectiveRole("omni");
    }
  };

  useEffect(() => {
    syncRole();
    const handleRoleChanged = () => syncRole();
    window.addEventListener("deedflow_role_changed", handleRoleChanged);
    window.addEventListener("storage", handleRoleChanged);
    return () => {
      window.removeEventListener("deedflow_role_changed", handleRoleChanged);
      window.removeEventListener("storage", handleRoleChanged);
    };
  }, []);

  const effectiveRole: UserRole =
    (currentRole === "project_admin" || currentRole === "super_admin") && perspectiveRole !== "omni"
      ? perspectiveRole
      : currentRole;

  const canApprove = hasPermission(effectiveRole, "approve_diff_queue");
  const activeUser = DEMO_USERS[effectiveRole] || DEMO_USERS.project_admin;
  const reviewerLabel = `${activeUser.fullName} (${activeUser.designation || effectiveRole})`;

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const filteredRequests = pendingRequests.filter((r) => {
    const matchesSearch = r.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesSource = filterSource === "all" || r.changeSource === filterSource;
    return matchesSearch && matchesSource;
  });

  const handleApprove = (req: ChangeRequest) => {
    // 1. Mark request as approved with dynamic reviewer attribution
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: "approved", reviewedBy: reviewerLabel, reviewedAt: new Date().toISOString() }
          : r
      )
    );

    // 2. Add to audit trail with rollback capability
    const newAuditLog: AuditLog = {
      id: `aud_${Date.now()}`,
      projectId: req.projectId,
      changeRequestId: req.id,
      entityType: req.entityType,
      entityId: req.entityId,
      flatNumber: req.flatNumber,
      action: req.action,
      snapshotBefore: req.oldData,
      snapshotAfter: req.newData,
      appliedBy: reviewerLabel,
      appliedAt: new Date().toISOString(),
      canRollback: true,
    };

    setAuditLogs((prev) => [newAuditLog, ...prev]);
    setActionNotice(`Approved change for Flat ${req.flatNumber}. Changes committed to live database with audit log.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReject = (req: ChangeRequest) => {
    const reason = prompt("Enter rejection reason for operator:", "Discrepancy with sanctioned drawing");
    if (!reason) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: "rejected", reviewNotes: reason, reviewedBy: reviewerLabel, reviewedAt: new Date().toISOString() }
          : r
      )
    );

    setActionNotice(`Rejected change for Flat ${req.flatNumber}. Operator notified.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRollback = (log: AuditLog) => {
    if (!confirm(`Are you sure you want to rollback changes for Flat ${log.flatNumber}? This will revert the record to its prior state.`)) {
      return;
    }

    setAuditLogs((prev) =>
      prev.map((l) =>
        l.id === log.id
          ? { ...l, canRollback: false, rolledBackAt: new Date().toISOString() }
          : l
      )
    );

    setActionNotice(`Time-Machine Rollback completed for Flat ${log.flatNumber}. Snapshot restored.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  if (!canApprove) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#24060B]">
          Restricted Governance Area
        </h2>
        <p className="text-xs text-[#5C4A4D] leading-relaxed">
          The Diff Review &amp; Approval Queue is restricted to Legal Counsel and Project Administrators under the Maker-Checker compliance policy. Your current role (<span className="font-mono font-semibold text-[#821A2A]">{effectiveRole}</span>) does not have sign-off authority.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Return to Workspace Overview</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E] animate-pulse" />
            <span>Maker-Checker Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
            Diff Review &amp; Approval Queue
          </h1>
          <p className="text-xs text-[#5C4A4D] mt-0.5">
            Strict gatekeeping: all edits to existing owners, units, or parking slots require Project Admin verification before committing.
          </p>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3 bg-[#FFFDFB] border border-[#DECFC0] text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E8DFD3] pb-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#821A2A] text-white shadow-xs"
              : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#F8F2EC]"
          }`}
        >
          <span>Pending Approvals</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeTab === "pending" ? "bg-[#B88E3E] text-white" : "bg-[#F8F2EC] text-[#5C4A4D]"
          }`}>
            {pendingRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "audit"
              ? "bg-[#821A2A] text-white shadow-xs"
              : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#F8F2EC]"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#D4B989]" />
          <span>Audit Trail &amp; Time-Machine Rollback</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#F8F2EC] text-[#5C4A4D]">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS QUEUE */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="glossy-card bg-[#FFFDFB] p-3.5 rounded-xl border border-[#DECFC0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#8C777A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search flat or proposer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A] text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-[#5C4A4D] font-medium">Source:</span>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#DECFC0] bg-white text-[#24060B] text-xs focus:outline-none focus:border-[#821A2A]"
              >
                <option value="all">All Sources</option>
                <option value="parking_grid_swap">Basement Grid Swap</option>
                <option value="register_vision_ocr">Physical Register OCR</option>
                <option value="excel_sync">Excel Bulk Sync</option>
                <option value="manual_edit">Manual Edit</option>
              </select>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="glossy-card bg-[#FFFDFB] p-12 text-center rounded-2xl border border-[#DECFC0] space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold font-serif text-[#24060B]">Zero Pending Diff Requests</h3>
              <p className="text-xs text-[#5C4A4D] max-w-sm mx-auto">
                All flat inventory, owner assignments, and basement parking slots are currently verified and committed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="glossy-card bg-[#FFFDFB] rounded-2xl border border-[#DECFC0] shadow-xs overflow-hidden transition-all"
                >
                  {/* Header Bar */}
                  <div className="p-4 bg-[#F8F2EC]/60 border-b border-[#E8DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#821A2A] text-white font-mono font-bold text-xs shadow-xs">
                        Flat {req.flatNumber}
                      </span>
                      <span className="text-xs text-[#5C4A4D]">
                        Proposed by <strong className="text-[#24060B]">{req.requestedBy}</strong>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#4A3538] border border-[#DECFC0] capitalize">
                        Source: {req.changeSource.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-[#8C777A] font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Red/Green Side-by-Side Diff Table */}
                  <div className="p-5 space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-[#DECFC0] rounded-xl overflow-hidden">
                        <thead className="bg-[#F8F2EC] text-[10px] font-mono uppercase tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
                          <tr>
                            <th className="px-4 py-2.5 w-1/4">Modified Field</th>
                            <th className="px-4 py-2.5 w-3/8 text-[#7D1826] bg-[#FAF0F2]">Current Live State (Old)</th>
                            <th className="px-4 py-2.5 w-3/8 text-emerald-800 bg-emerald-50">Proposed Update (New)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0E8DD] font-mono">
                          {req.diffSummary.map((diff, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-sans font-semibold text-[#24060B]">
                                {diff.label}
                              </td>
                              <td className="px-4 py-3 bg-[#FAF0F2]/50 text-[#7D1826]">
                                <span className="line-through opacity-75">{String(diff.oldValue)}</span>
                              </td>
                              <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900 font-bold">
                                {String(diff.newValue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        onClick={() => handleReject(req)}
                        className="px-4 py-2 rounded-xl border border-[#F0D5D9] bg-white text-[#7D1826] hover:bg-[#FAF0F2] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-[#7D1826]" />
                        <span>Reject with Reason</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req)}
                        className="px-5 py-2 rounded-xl glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D4B989]" />
                        <span>Approve &amp; Commit Live</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL & TIME-MACHINE ROLLBACK */}
      {activeTab === "audit" && (
        <div className="glossy-card bg-[#FFFDFB] rounded-2xl border border-[#DECFC0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#F8F2EC]/40">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#24060B]">Immutable Audit Trail</h3>
              <p className="text-[11px] text-[#5C4A4D]">Every approved mutation is snapshot-logged with instant 1-click rollback.</p>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
              Zero Unlogged Mutates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
                <tr>
                  <th className="px-5 py-3">Flat &amp; Entity</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Committed Change Snapshot</th>
                  <th className="px-5 py-3">Approved By</th>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3 text-right">Time-Machine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DD]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8F2EC]/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#24060B]">
                      Flat {log.flatNumber}
                      <span className="text-[10px] text-[#8C777A] font-mono block font-normal">{log.entityType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F8F2EC] text-[#24060B] border border-[#DECFC0]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-[#4A3538]">
                      <div className="max-w-md truncate">
                        {JSON.stringify(log.snapshotAfter)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#24060B] font-medium">
                      {log.appliedBy}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-[#8C777A]">
                      {new Date(log.appliedAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {log.canRollback ? (
                        <button
                          onClick={() => handleRollback(log)}
                          className="px-3 py-1.5 rounded-lg border border-[#DECFC0] hover:border-[#7D1826] hover:bg-[#FAF0F2] text-[#5C4A4D] hover:text-[#7D1826] text-xs font-semibold flex items-center space-x-1.5 ml-auto cursor-pointer transition-colors"
                          title="Restore previous snapshot"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#7D1826]" />
                          <span>Rollback</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8C777A] italic">
                          Rolled Back
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
