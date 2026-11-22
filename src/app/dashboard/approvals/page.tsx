"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Clock, AlertTriangle, ShieldCheck, ArrowRight, Filter, Search, FileText } from "lucide-react";
import { MOCK_CHANGE_REQUESTS, MOCK_AUDIT_LOGS } from "@/lib/mockData";
import { ChangeRequest, AuditLog } from "@/lib/types";

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "audit">("pending");
  const [requests, setRequests] = useState<ChangeRequest[]>(MOCK_CHANGE_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const filteredRequests = pendingRequests.filter((r) => {
    const matchesSearch = r.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesSource = filterSource === "all" || r.changeSource === filterSource;
    return matchesSearch && matchesSource;
  });

  const handleApprove = (req: ChangeRequest) => {
    // 1. Mark request as approved
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: "approved", reviewedBy: "Aidan Morgan (Project Admin)", reviewedAt: new Date().toISOString() }
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
      appliedBy: "Aidan Morgan (Project Admin)",
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
          ? { ...r, status: "rejected", reviewNotes: reason, reviewedBy: "Aidan Morgan (Project Admin)", reviewedAt: new Date().toISOString() }
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

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Maker-Checker Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Diff Review &amp; Approval Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict gatekeeping: all edits to existing owners, units, or parking slots require Project Admin verification before committing.
          </p>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#0F172A] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>Pending Approvals</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeTab === "pending" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            {pendingRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "audit"
              ? "bg-[#0F172A] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Audit Trail &amp; Time-Machine Rollback</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS QUEUE */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search flat or proposer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-slate-500 font-medium">Source:</span>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
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
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Zero Pending Diff Requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All flat inventory, owner assignments, and basement parking slots are currently verified and committed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  {/* Header Bar */}
                  <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] text-white font-mono font-bold text-xs">
                        Flat {req.flatNumber}
                      </span>
                      <span className="text-xs text-slate-600">
                        Proposed by <strong className="text-slate-900">{req.requestedBy}</strong>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
                        Source: {req.changeSource.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Red/Green Side-by-Side Diff Table */}
                  <div className="p-5 space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2.5 w-1/4">Modified Field</th>
                            <th className="px-4 py-2.5 w-3/8 text-rose-700 bg-rose-50/40">Current Live State (Old)</th>
                            <th className="px-4 py-2.5 w-3/8 text-emerald-800 bg-emerald-50/40">Proposed Update (New)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {req.diffSummary.map((diff, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-sans font-semibold text-slate-800">
                                {diff.label}
                              </td>
                              <td className="px-4 py-3 bg-rose-50/20 text-rose-800">
                                <span className="line-through opacity-75">{String(diff.oldValue)}</span>
                              </td>
                              <td className="px-4 py-3 bg-emerald-50/20 text-emerald-800 font-bold">
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
                        className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Reject with Reason</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Audit Trail</h3>
              <p className="text-[11px] text-slate-500">Every approved mutation is snapshot-logged with instant 1-click rollback.</p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Zero Unlogged Mutates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Flat &amp; Entity</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Committed Change Snapshot</th>
                  <th className="px-5 py-3">Approved By</th>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3 text-right">Time-Machine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      Flat {log.flatNumber}
                      <span className="text-[10px] text-slate-500 font-mono block font-normal">{log.entityType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-700">
                      <div className="max-w-md truncate">
                        {JSON.stringify(log.snapshotAfter)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-800 font-medium">
                      {log.appliedBy}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                      {new Date(log.appliedAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {log.canRollback ? (
                        <button
                          onClick={() => handleRollback(log)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-rose-400 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold flex items-center space-x-1.5 ml-auto cursor-pointer transition-colors"
                          title="Restore previous snapshot"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                          <span>Rollback</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 italic">
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
