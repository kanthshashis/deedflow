"use client";

import React, { useState, useEffect } from "react";
import { MOCK_PROJECT, DEMO_USERS } from "@/lib/mockData";
import { UserProfile, UserRole, hasPermission } from "@/lib/types";
import { getCurrentAuthUser, switchActiveRole } from "@/lib/authStore";
import { getAllAuditRecords, exportAuditRecordsCsv, AuditRecord } from "@/lib/auditStore";
import {
  User,
  Shield,
  Users,
  Building2,
  FileCheck2,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  LogOut,
  Clock,
  Search,
  Filter,
  Check,
  X,
  RefreshCw,
  Share2,
  Download,
  ShieldCheck,
  FileText,
} from "lucide-react";
import clsx from "clsx";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "team" | "project" | "audit">("profile");
  const [currentRole, setCurrentRole] = useState<UserRole>("project_admin");
  const [perspectiveRole, setPerspectiveRole] = useState<UserRole | "omni">("omni");
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.project_admin);

  // Profile Form State
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone || "+91 98450 11223");
  const [notification, setNotification] = useState<string | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<"15" | "30" | "60">("15");

  // Team Management State
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>(Object.values(DEMO_USERS));
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("project_operator");

  // Audit Logs State
  const [auditSearch, setAuditSearch] = useState("");
  const [forensicWatermark, setForensicWatermark] = useState(true);

  const syncState = () => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("deedflow_active_role") as UserRole | null;
      const storedPerspective = localStorage.getItem("deedflow_perspective_role") as (UserRole | "omni") | null;

      const primaryRole = storedRole || "project_admin";
      setCurrentRole(primaryRole);

      const effective: UserRole =
        (primaryRole === "project_admin" || primaryRole === "super_admin") && storedPerspective && storedPerspective !== "omni"
          ? storedPerspective
          : primaryRole;

      setPerspectiveRole(storedPerspective || "omni");

      const authUser = getCurrentAuthUser();
      if (authUser) {
        setCurrentUser(authUser);
        setFullName(authUser.fullName);
        setPhone(authUser.phone || "+91 98450 11223");
      } else if (DEMO_USERS[effective]) {
        setCurrentUser(DEMO_USERS[effective]);
        setFullName(DEMO_USERS[effective].fullName);
        setPhone(DEMO_USERS[effective].phone || "+91 98450 11223");
      }
    }
  };

  useEffect(() => {
    syncState();
    const handleRoleChanged = () => syncState();
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

  const canManageTeam = hasPermission(effectiveRole, "invite_team_members");
  const canViewStatutory =
    hasPermission(effectiveRole, "configure_statutory_profile") ||
    effectiveRole === "legal_counsel" ||
    effectiveRole === "promoter_executive";
  const canEditStatutory = hasPermission(effectiveRole, "configure_statutory_profile");
  const canViewAudit = hasPermission(effectiveRole, "view_audit_stream");

  // Auto-fallback if active tab is restricted for current role
  useEffect(() => {
    if (activeTab === "team" && !canManageTeam) setActiveTab("profile");
    if (activeTab === "project" && !canViewStatutory) setActiveTab("profile");
    if (activeTab === "audit" && !canViewAudit) setActiveTab("profile");
  }, [activeTab, canManageTeam, canViewStatutory, canViewAudit]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-rose-500" };
    if (score <= 4) return { score, label: "Moderate", color: "bg-amber-500" };
    return { score, label: "Strong & Compliant", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Personal Profile successfully updated.");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNotification("Password updated successfully. All other active sessions verified.");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newMember: UserProfile = {
      id: `usr_${Date.now()}`,
      role: inviteRole,
      fullName: inviteName,
      email: inviteEmail,
      phone: "+91 98000 00000",
      designation: inviteRole === "legal_counsel" ? "Legal Officer" : inviteRole === "project_admin" ? "Assistant CRM Manager" : "Site Executive",
      department: "Customer Operations",
      status: "active",
      lastLogin: "Invitation Sent",
      twoFactorEnabled: false,
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsInviteModalOpen(false);
    setInviteEmail("");
    setInviteName("");
    setNotification(`Invitation successfully sent to ${newMember.email} with ${inviteRole.replace("_", " ")} permissions.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleToggleMemberStatus = (id: string) => {
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
      )
    );
  };

  const [liveAuditRecords, setLiveAuditRecords] = useState<AuditRecord[]>([]);

  useEffect(() => {
    const records = getAllAuditRecords();
    setLiveAuditRecords(records);
    const handleAuditUpdate = () => setLiveAuditRecords(getAllAuditRecords());
    window.addEventListener("deedflow_audit_logged", handleAuditUpdate);
    return () => window.removeEventListener("deedflow_audit_logged", handleAuditUpdate);
  }, []);

  const handleExportProjectAuditCsv = () => {
    const csvData = exportAuditRecordsCsv(filteredAuditRecords);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DeedFlow_Project_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAuditRecords = liveAuditRecords.filter(
    (ev) =>
      ev.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (ev.builderName && ev.builderName.toLowerCase().includes(auditSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#821A2A] uppercase">
          <span className="w-3 h-[2px] bg-[#821A2A] rounded-full" />
          <span>Account &amp; Enterprise Governance</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
          Settings &amp; Security Command Center<span className="text-[#B88E3E]">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4A4D] mt-0.5">
          Manage your personal profile, security credentials, active team permissions, and compliance audit trail.
        </p>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="bg-[#FFF9EE] border border-[#F2E4C4] text-[#821A2A] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[#8C777A] hover:text-[#24060B] text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Role-Gated Tab Navigation Bar */}
      <div className="flex items-center space-x-1.5 border-b border-[#DECFC0] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={clsx(
            "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0",
            activeTab === "profile"
              ? "bg-[#821A2A] text-white shadow-xs"
              : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
          )}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={clsx(
            "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0",
            activeTab === "security"
              ? "bg-[#821A2A] text-white shadow-xs"
              : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
          )}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security &amp; Password</span>
        </button>

        {canManageTeam && (
          <button
            onClick={() => setActiveTab("team")}
            className={clsx(
              "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0",
              activeTab === "team"
                ? "bg-[#821A2A] text-white shadow-xs"
                : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team &amp; Roles</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 text-current">
              {teamMembers.length}
            </span>
          </button>
        )}

        {canViewStatutory && (
          <button
            onClick={() => setActiveTab("project")}
            className={clsx(
              "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0",
              activeTab === "project"
                ? "bg-[#821A2A] text-white shadow-xs"
                : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Project &amp; Statutory</span>
          </button>
        )}

        {canViewAudit && (
          <button
            onClick={() => setActiveTab("audit")}
            className={clsx(
              "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0",
              activeTab === "audit"
                ? "bg-[#821A2A] text-white shadow-xs"
                : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#FAF7F2]"
            )}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Audit Stream &amp; Forensic</span>
          </button>
        )}
      </div>

      {/* Tab 1: My Profile */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-[#821A2A] text-white font-bold text-2xl flex items-center justify-center shadow-md">
                {currentUser.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold font-serif text-base text-[#24060B]">{currentUser.fullName}</h3>
                <p className="text-xs text-[#8C777A]">{currentUser.designation}</p>
                <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8] text-[11px] font-mono font-bold uppercase">
                  <span>{currentRole.replace("_", " ")}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F0E8DD] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#5C4A4D]">
                <span className="text-[#8C777A]">Department:</span>
                <span className="font-semibold text-[#24060B]">{currentUser.department}</span>
              </div>
              <div className="flex justify-between text-[#5C4A4D]">
                <span className="text-[#8C777A]">Assigned Workspace:</span>
                <span className="font-semibold text-[#24060B]">{currentUser.projectName || "Sobha Royal Pavilion"}</span>
              </div>
              <div className="flex justify-between text-[#5C4A4D]">
                <span className="text-[#8C777A]">2FA Status:</span>
                <span className="font-semibold text-emerald-700">Enforced &amp; Active</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="lg:col-span-2 glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#F0E8DD] pb-3">
              <h3 className="font-bold font-serif text-base text-[#24060B]">Personal Information</h3>
              <p className="text-xs text-[#5C4A4D]">Update your contact details for official system audit logging.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">Official Corporate Email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#F5EFE8] text-[#8C777A] cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">Phone / WhatsApp Number (Alerts)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">Designation &amp; Role</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.designation} (${currentRole.replace("_", " ")})`}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#F5EFE8] text-[#8C777A] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0E8DD] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* RBAC Security Clearance Card */}
          <div className="lg:col-span-3 glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8DD] pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#821A2A]" />
                  <h3 className="font-bold font-serif text-base text-[#24060B]">
                    Active Security Clearance &amp; RBAC Roles
                  </h3>
                </div>
                <p className="text-xs text-[#5C4A4D] mt-0.5">
                  Your identity has been granted clearance across the following operational personas. Select any authorized role to dynamically switch your active workspace permissions.
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono text-[#8C777A]">Active Clearance:</span>
                <span className="px-2.5 py-1 rounded-full bg-[#821A2A] text-white text-xs font-mono font-bold uppercase">
                  {currentRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  roleKey: "project_admin" as UserRole,
                  title: "Project Admin",
                  desc: "Omni-module operations, cadastral parking allocation, and team oversight.",
                  badge: "Omni Admin",
                },
                {
                  roleKey: "promoter_executive" as UserRole,
                  title: "Promoter Executive",
                  desc: "Executive financial KPIs, collection dashboards, and milestone tracking.",
                  badge: "C-Suite",
                },
                {
                  roleKey: "legal_counsel" as UserRole,
                  title: "Legal Counsel",
                  desc: "ATS Form N legal templates, diff audit trail, and statutory sign-offs.",
                  badge: "Legal",
                },
                {
                  roleKey: "project_operator" as UserRole,
                  title: "CRM Operator",
                  desc: "Buyer KYC OCR, Aadhaar masking, agreement drafting, and customer dispatch.",
                  badge: "Operations",
                },
                {
                  roleKey: "bank_auditor" as UserRole,
                  title: "Bank Auditor",
                  desc: "Read-only mortgage disbursement, QR cryptographic verification, and compliance.",
                  badge: "Empanelled",
                },
                {
                  roleKey: "super_admin" as UserRole,
                  title: "Super Admin",
                  desc: "Multi-builder tenant provisioning, architectural matrix, and global audit stream.",
                  badge: "Platform Admin",
                },
              ].map((item) => {
                const isCleared =
                  currentUser.accessibleRoles?.includes(item.roleKey) ||
                  currentRole === item.roleKey ||
                  currentUser.role === item.roleKey ||
                  currentUser.role === "super_admin" ||
                  currentUser.role === "project_admin";
                const isCurrent = currentRole === item.roleKey;

                return (
                  <div
                    key={item.roleKey}
                    className={clsx(
                      "p-4 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-3",
                      isCurrent
                        ? "bg-[#FAF0F2] border-[#821A2A] ring-1 ring-[#821A2A]/40"
                        : isCleared
                        ? "bg-white border-[#E8DFD3] hover:border-[#DECFC0]"
                        : "bg-[#FBF8F5] border-[#EAE3DA] opacity-60"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-[#24060B]">{item.title}</span>
                        <span
                          className={clsx(
                            "text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold",
                            isCurrent
                              ? "bg-[#821A2A] text-white"
                              : isCleared
                              ? "bg-[#F3EAE0] text-[#821A2A]"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[#5C4A4D] leading-relaxed text-[11px]">{item.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-[#F0E8DD] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8C777A]">
                        {isCurrent ? "Currently Active" : isCleared ? "Clearance Granted" : "Restricted"}
                      </span>
                      {isCleared && !isCurrent ? (
                        <button
                          type="button"
                          onClick={() => {
                            switchActiveRole(item.roleKey);
                            setCurrentRole(item.roleKey);
                            setNotification(`Switched active operational clearance to ${item.title}`);
                            setTimeout(() => setNotification(null), 4000);
                          }}
                          className="px-3 py-1 bg-white border border-[#DECFC0] hover:border-[#821A2A] text-[#821A2A] font-semibold rounded-lg text-[11px] shadow-2xs hover:bg-[#FAF0F2] transition-colors cursor-pointer"
                        >
                          Switch Role
                        </button>
                      ) : isCurrent ? (
                        <span className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px] font-medium">Requires Clearance</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documentation & User Manual Card */}
          <div className="lg:col-span-3 glossy-card bg-gradient-to-r from-[#FAF0F2] to-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#821A2A]" />
                <h4 className="font-bold font-serif text-base text-[#24060B]">
                  DeedFlow Enterprise System Documentation &amp; User Manual
                </h4>
              </div>
              <p className="text-xs text-[#5C4A4D] max-w-2xl">
                Comprehensive reference covering Maker-Checker workflows, biometric KYC OCR masking, basement parking allocation, and Indian legal ATS generation.
              </p>
            </div>
            <a
              href="/docs/DeedFlow_Enterprise_User_Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 glossy-btn-burgundy text-white font-semibold text-xs rounded-xl flex items-center space-x-2 shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Guide</span>
            </a>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Authentication */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-fade-in">
          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#F0E8DD] pb-3">
              <h3 className="font-bold font-serif text-base text-[#24060B]">Change Account Password</h3>
              <p className="text-xs text-[#5C4A4D]">
                Ensure your password meets institutional real estate compliance guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">New Secure Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min 10 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#5C4A4D] mb-1">Confirm New Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8C777A]">Password Strength:</span>
                  <span className="font-bold text-[#24060B]">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-[#E8DFD3] rounded-full overflow-hidden">
                  <div
                    className={clsx("h-full transition-all", strength.color)}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#821A2A] hover:underline flex items-center space-x-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? "Hide passwords" : "Show passwords"}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* 2FA & Session Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2FA Configuration */}
            <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-[#821A2A]" />
                  <h3 className="font-bold font-serif text-sm text-[#24060B]">Two-Factor Authentication (2FA)</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {twoFactorEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>

              <p className="text-xs text-[#5C4A4D] leading-relaxed">
                Requires an SMS / WhatsApp OTP verification when dispatching contracts or changing parking slot allocations.
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-[#24060B]">Enforce 2FA on my login</span>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#821A2A] cursor-pointer"
                />
              </div>
            </div>

            {/* Inactivity Session Timeout */}
            <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#821A2A]" />
                  <h3 className="font-bold font-serif text-sm text-[#24060B]">Site Desk Inactivity Lock</h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C777A]">Compliance Default: 15m</span>
              </div>

              <p className="text-xs text-[#5C4A4D] leading-relaxed">
                Prevents unauthorized access when staff step away from site office shared computers.
              </p>

              <div className="flex items-center space-x-2 pt-1">
                {(["15", "30", "60"] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setSessionTimeout(mins);
                      setNotification(`Auto-lock timeout updated to ${mins} minutes.`);
                      setTimeout(() => setNotification(null), 3000);
                    }}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                      sessionTimeout === mins
                        ? "bg-[#821A2A] text-white shadow-2xs"
                        : "bg-[#FAF7F2] text-[#5C4A4D] border border-[#DECFC0] hover:bg-[#FAF0F2]"
                    )}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Sessions List */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8DD] pb-3">
              <div>
                <h3 className="font-bold font-serif text-sm text-[#24060B]">Active Device Sessions</h3>
                <p className="text-xs text-[#5C4A4D]">All terminals currently authenticated with your builder credentials.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNotification("All other sessions terminated. Current session preserved.");
                  setTimeout(() => setNotification(null), 4000);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF0F2] text-[#821A2A] hover:bg-[#F2E0E4] border border-[#E8C4C8] transition-colors cursor-pointer w-fit"
              >
                Log Out All Other Devices
              </button>
            </div>

            <div className="divide-y divide-[#F0E8DD] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold text-[#24060B] flex items-center space-x-1.5">
                      <span>Windows 11 PC (Chrome 131)</span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        ACTIVE NOW
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C777A]">Bengaluru, Karnataka, India • IP: 103.21.144.18</p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold font-mono">Current Terminal</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-[#8C777A]" />
                  <div>
                    <div className="font-bold text-[#24060B]">Apple iPhone 16 Pro (Safari Mobile)</div>
                    <p className="text-[11px] text-[#8C777A]">Sarjapur Road, Bengaluru • IP: 49.207.210.92</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#8C777A]">2 hours ago</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0E8DD] flex items-center justify-between">
              <span className="text-[11px] text-[#5C4A4D]">Need to log out from this browser?</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("deedflow_auth_session");
                    localStorage.removeItem("deedflow_active_role");
                    window.location.href = "/login";
                  }
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Sign Out Current Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team Management & Roles - Restricted to Project Admin */}
      {canManageTeam && activeTab === "team" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold font-serif text-lg text-[#24060B]">Project Team &amp; Access Hierarchy</h3>
              <p className="text-xs text-[#5C4A4D]">
                Enforce Maker-Checker segregation of duties across CRM executives and Legal advocates.
              </p>
            </div>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4 text-[#D4B989]" />
              <span>Invite New Team Member</span>
            </button>
          </div>

          {/* Team Roster Table */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Team Member</th>
                    <th className="px-4 py-3.5 font-bold">Designation &amp; Dept</th>
                    <th className="px-4 py-3.5 font-bold">Access Role</th>
                    <th className="px-4 py-3.5 font-bold">Status</th>
                    <th className="px-4 py-3.5 font-bold">Last Activity</th>
                    <th className="px-5 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DD]">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#821A2A] text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {member.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-[#24060B]">{member.fullName}</div>
                            <div className="text-[11px] text-[#8C777A] font-mono">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[#5C4A4D]">
                        <div className="font-medium text-[#24060B]">{member.designation}</div>
                        <div className="text-[10px] text-[#8C777A]">{member.department}</div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8] font-mono text-[10px] font-bold uppercase">
                          {member.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={clsx(
                            "inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            member.status === "active"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          )}
                        >
                          <span>{member.status || "active"}</span>
                        </span>
                      </td>

                      <td className="px-4 py-4 font-mono text-[11px] text-[#8C777A]">
                        {member.lastLogin || "Today, 10:30 AM"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleToggleMemberStatus(member.id)}
                          className="text-[11px] font-semibold text-[#821A2A] hover:underline cursor-pointer"
                        >
                          {member.status === "active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Project & Statutory Profile */}
      {canViewStatutory && activeTab === "project" && (
        <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-[#F0E8DD] pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold font-serif text-lg text-[#24060B]">Project Statutory Credentials</h3>
              <p className="text-xs text-[#5C4A4D]">
                These statutory values are permanently locked and auto-injected into RERA Agreements for Sale and Kaveri 2.0 Sale Deeds.
              </p>
            </div>
            {!canEditStatutory && (
              <span className="px-2.5 py-1 rounded-full bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8] text-[10px] font-mono font-bold flex items-center space-x-1 shrink-0">
                <Lock className="w-3 h-3 text-[#821A2A]" />
                <span>Statutory Read-Only Mode</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#8C777A] mb-1">Commercial Project Name</label>
              <input
                type="text"
                disabled={!canEditStatutory}
                defaultValue={MOCK_PROJECT.name}
                className={clsx(
                  "w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-semibold",
                  !canEditStatutory ? "bg-[#F5EFE8] cursor-not-allowed text-[#5C4A4D]" : "bg-[#FAF7F2]"
                )}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8C777A] mb-1">Registered Legal Entity</label>
              <input
                type="text"
                disabled={!canEditStatutory}
                defaultValue={MOCK_PROJECT.legalName}
                className={clsx(
                  "w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-semibold",
                  !canEditStatutory ? "bg-[#F5EFE8] cursor-not-allowed text-[#5C4A4D]" : "bg-[#FAF7F2]"
                )}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8C777A] mb-1">Project RERA Registration #</label>
              <input
                type="text"
                disabled={!canEditStatutory}
                defaultValue={MOCK_PROJECT.reraNumber}
                className={clsx(
                  "w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold",
                  !canEditStatutory ? "bg-[#F5EFE8] cursor-not-allowed text-[#5C4A4D]" : "bg-[#FAF7F2]"
                )}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8C777A] mb-1">Sanction Plan Approval #</label>
              <input
                type="text"
                disabled={!canEditStatutory}
                defaultValue={MOCK_PROJECT.sanctionPlanNo}
                className={clsx(
                  "w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono",
                  !canEditStatutory ? "bg-[#F5EFE8] cursor-not-allowed text-[#5C4A4D]" : "bg-[#FAF7F2]"
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#8C777A] mb-1">RERA Master Escrow Bank Account</label>
              <input
                type="text"
                disabled={!canEditStatutory}
                defaultValue="State Bank of India • A/C No: 918020034827101 (IFSC: SBIN0004120)"
                className={clsx(
                  "w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold",
                  !canEditStatutory ? "bg-[#F5EFE8] cursor-not-allowed text-[#5C4A4D]" : "bg-[#FAF7F2]"
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#8C777A] mb-1">Site Office Physical Address</label>
              <input
                type="text"
                disabled={!canEditStatutory}
                defaultValue={MOCK_PROJECT.location}
                className={clsx(
                  "w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B]",
                  !canEditStatutory ? "bg-[#F5EFE8] cursor-not-allowed text-[#5C4A4D]" : "bg-[#FAF7F2]"
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Trail & Forensic Compliance */}
      {canViewAudit && activeTab === "audit" && (
        <div className="space-y-6 animate-fade-in">
          {/* Forensic Watermark Controls */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#821A2A]" />
                <h3 className="font-bold font-serif text-sm text-[#24060B]">Forensic Anti-Poaching Watermark</h3>
              </div>
              <p className="text-xs text-[#5C4A4D] max-w-xl">
                Automatically imprints the logged-in CRM operator's email, timestamp, and IP address diagonally across all draft documents to prevent customer database leaks.
              </p>
            </div>

            <label className="flex items-center space-x-2 text-xs font-bold text-[#821A2A] cursor-pointer">
              <input
                type="checkbox"
                checked={forensicWatermark}
                onChange={(e) => setForensicWatermark(e.target.checked)}
                className="w-4 h-4 accent-[#821A2A]"
              />
              <span>Forensic Watermarking Active</span>
            </label>
          </div>

          {/* Search Audit Stream & Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C777A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by user, action, flat number, or IP..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DECFC0] bg-[#FFFDFB] text-[#24060B] placeholder-[#8C777A] text-xs focus:outline-none focus:border-[#821A2A] shadow-2xs"
              />
            </div>
            <button
              type="button"
              onClick={handleExportProjectAuditCsv}
              className="px-4 py-2.5 glossy-btn-ivory border border-[#DECFC0] hover:border-[#821A2A] text-[#24060B] rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#821A2A]" />
              <span>Export CSV ({filteredAuditRecords.length})</span>
            </button>
          </div>

          {/* Audit Stream Table */}
          <div className="glossy-card bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F2EC] text-[10px] uppercase font-mono tracking-wider text-[#5C4A4D] border-b border-[#DECFC0]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Operator &amp; Role</th>
                    <th className="px-4 py-3.5 font-bold">Logged Operation</th>
                    <th className="px-4 py-3.5 font-bold">Target Contract / Flat</th>
                    <th className="px-4 py-3.5 font-bold">Timestamp &amp; Terminal</th>
                    <th className="px-5 py-3.5 font-bold text-right">Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DD]">
                  {filteredAuditRecords.map((ev) => (
                    <tr key={ev.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#24060B]">{ev.userName}</div>
                        <div className="text-[10px] text-[#8C777A] font-mono uppercase">{ev.userRole.replace("_", " ")}</div>
                      </td>

                      <td className="px-4 py-3.5 text-[#24060B] font-medium">{ev.action}</td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono font-semibold text-[#821A2A] bg-[#FAF0F2] px-2 py-0.5 rounded border border-[#E8C4C8]">
                          {ev.target}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[#5C4A4D] font-mono text-[11px]">
                        <div>
                          {new Date(ev.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[10px] text-[#8C777A]">{ev.ipAddress}</div>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 text-[10px] font-bold font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFB] border border-[#DECFC0] rounded-2xl max-w-md w-full shadow-2xl animate-fade-in overflow-hidden">
            <div className="p-5 border-b border-[#F0E8DD] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#821A2A]" />
                <h3 className="font-serif font-bold text-sm text-[#24060B]">Invite Team Member</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 text-[#8C777A] hover:text-[#24060B] rounded-lg hover:bg-[#F2EAE0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.sharma@sobha.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] focus:outline-none focus:border-[#821A2A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8C777A] block mb-1">Access Role &amp; Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DECFC0] bg-[#FAF7F2] text-[#24060B] font-medium focus:outline-none focus:border-[#821A2A]"
                >
                  <option value="project_operator">CRM Operator (Pooja - Maker)</option>
                  <option value="legal_counsel">Legal Counsel (Advocate - Template Authority)</option>
                  <option value="project_admin">Project Admin (CRM Head - Checker)</option>
                  <option value="promoter_executive">Promoter Executive (MD - Read-Only)</option>
                  <option value="bank_auditor">Bank Auditor (SBI RACPC - Restricted)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#DECFC0] text-[11px] text-[#5C4A4D] space-y-1">
                <span className="font-bold text-[#24060B] block">Role Permissions:</span>
                {inviteRole === "project_operator" && (
                  <p>Can drop KYC, allot available parking bays, and generate draft documents. Cannot overwrite locked records.</p>
                )}
                {inviteRole === "legal_counsel" && (
                  <p>Can upload and publish legal templates (.docx) and manage version rollbacks.</p>
                )}
                {inviteRole === "project_admin" && (
                  <p>Approver for Diff Review Queue, pricing tiers, and master spreadsheet imports.</p>
                )}
                {inviteRole === "promoter_executive" && (
                  <p>Executive overview and cash flow monitoring. Read-only permissions.</p>
                )}
                {inviteRole === "bank_auditor" && (
                  <p>Restricted to QR authenticity verification and approved bank loan kits.</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#DECFC0] text-[#5C4A4D] font-semibold text-xs hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl glossy-btn-burgundy hover:brightness-105 text-white font-semibold text-xs shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
