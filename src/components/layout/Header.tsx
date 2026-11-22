"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Settings,
  ShieldCheck,
  Eye,
  ChevronDown,
  RotateCcw,
  LogOut,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { UserRole, ProjectMetadata, UserProfile } from "@/lib/types";
import { getActiveProject } from "@/lib/projectStore";
import { getCurrentAuthUser, logoutUser } from "@/lib/authStore";
import { DEMO_USERS } from "@/lib/mockData";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

const ROLE_INITIALS: Record<UserRole, string> = {
  super_admin: "SA",
  promoter_executive: "VR",
  project_admin: "AM",
  legal_counsel: "KM",
  project_operator: "PH",
  bank_auditor: "RK",
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  promoter_executive: "Promoter MD",
  project_admin: "Project Admin",
  legal_counsel: "Legal Counsel",
  project_operator: "CRM Operator",
  bank_auditor: "Bank Auditor",
};

export function Header({ onToggleMobileMenu, isMobileMenuOpen }: HeaderProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("project_admin");
  const [perspective, setPerspective] = useState<UserRole | "omni">("omni");
  const [activeProject, setActiveProject] = useState<ProjectMetadata | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.project_admin);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const syncState = () => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("deedflow_active_role") as UserRole | null;
      if (storedRole) {
        setRole(storedRole);
      }
      const storedPerspective = localStorage.getItem("deedflow_perspective_role") as (UserRole | "omni") | null;
      if (storedPerspective) {
        setPerspective(storedPerspective);
      } else {
        setPerspective("omni");
      }
      setActiveProject(getActiveProject());
      setCurrentUser(getCurrentAuthUser());
    }
  };

  useEffect(() => {
    syncState();
    const handleRoleChanged = () => syncState();
    window.addEventListener("deedflow_role_changed", handleRoleChanged);
    window.addEventListener("deedflow_auth_changed", handleRoleChanged);
    window.addEventListener("deedflow_project_changed", handleRoleChanged);
    window.addEventListener("storage", handleRoleChanged);

    // Close user menu on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("deedflow_role_changed", handleRoleChanged);
      window.removeEventListener("deedflow_auth_changed", handleRoleChanged);
      window.removeEventListener("deedflow_project_changed", handleRoleChanged);
      window.removeEventListener("storage", handleRoleChanged);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePerspectiveChange = (newPerspective: UserRole | "omni") => {
    setPerspective(newPerspective);
    if (typeof window !== "undefined") {
      localStorage.setItem("deedflow_perspective_role", newPerspective);
      window.dispatchEvent(new Event("deedflow_role_changed"));
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const isOmniAdmin = role === "project_admin" || role === "super_admin";

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3] w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 sm:p-2 text-[#5C4A4D] hover:text-[#24060B] rounded-lg hover:bg-[#F3EAE0] transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-[#8C777A] font-medium min-w-0">
            <span className="text-[#8C777A] hidden sm:inline">Workspace</span>
            <span className="text-[#DECFC0] hidden sm:inline">/</span>
            <span className="text-[#24060B] font-bold truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {activeProject?.name || "Sobha Royal Pavilion - Tower B"}
            </span>
            <span className="text-[#DECFC0]">/</span>
            <span className="text-[#5C4A4D] font-mono text-[10px] sm:text-[11px] bg-[#F8F2EC] px-1.5 sm:px-2 py-0.5 rounded border border-[#E8DFD3] shrink-0 font-semibold">
              {activeProject?.towers?.length ? `Tower ${activeProject.towers[0]}` : "Tower B"}
            </span>
          </div>
        </div>

        {/* Right: Perspective Switcher, Settings, Role Badge & User Avatar with Dropdown */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Project Admin Omni Perspective Switcher */}
          {isOmniAdmin && (
            <div className="flex items-center space-x-1.5 bg-white border border-[#DECFC0] rounded-xl px-2.5 py-1 text-xs shadow-2xs">
              <Eye className="w-3.5 h-3.5 text-[#821A2A]" />
              <span className="text-[10px] font-mono uppercase text-[#8C777A] hidden lg:inline">View As:</span>
              <select
                value={perspective}
                onChange={(e) => handlePerspectiveChange(e.target.value as any)}
                className="text-xs font-semibold text-[#24060B] bg-transparent border-none outline-none cursor-pointer py-0.5 pr-1"
                title="Project Admin: Preview the workspace through any role's narrowed-down interface"
              >
                <option value="omni">Omni Admin (All 11 Modules)</option>
                <option value="project_operator">Clerk (Pooja - 3 Modules)</option>
                <option value="legal_counsel">Legal Counsel (Advocate - 3 Modules)</option>
                <option value="bank_auditor">Bank Auditor (Read-Only Disbursal)</option>
                <option value="promoter_executive">Promoter MD (Executive Overview)</option>
              </select>
              {perspective !== "omni" && (
                <button
                  onClick={() => handlePerspectiveChange("omni")}
                  className="ml-1 p-0.5 text-[#821A2A] hover:bg-[#F3EAE0] rounded cursor-pointer"
                  title="Reset to Omni Admin View"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <Link
            href="/dashboard/settings"
            className="p-1.5 sm:p-2 text-[#5C4A4D] hover:text-[#821A2A] rounded-xl hover:bg-[#F3EAE0] transition-colors"
            title="Enterprise Settings & Profile"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* User Profile & Menu Container */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-[#F3EAE0] transition-colors cursor-pointer select-none"
              title="Open Account Menu"
            >
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white border border-[#DECFC0] text-[#5C4A4D] text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#B88E3E] animate-pulse" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#24060B]">
                  {ROLE_LABELS[role] || role}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8C777A]" />
              </div>

              <div className="w-8 h-8 rounded-full bg-[#821A2A] text-white border border-[#821A2A]/30 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-[#821A2A]/40 transition-all shrink-0">
                {ROLE_INITIALS[role] || "DF"}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DECFC0] rounded-2xl shadow-lg p-2 z-50 animate-fade-in text-xs text-[#24060B]">
                {/* User Info Header */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3] space-y-1 mb-2">
                  <div className="font-bold text-[#24060B] leading-tight flex items-center justify-between">
                    <span>{currentUser.fullName}</span>
                    <span className="text-[9px] font-mono font-bold bg-[#821A2A] text-white px-1.5 py-0.2 rounded uppercase">
                      {ROLE_LABELS[role] || role}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5C4A4D] truncate">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-[#8C777A] truncate">
                    {currentUser.organizationName || "Sobha Limited"}
                  </div>
                </div>

                {/* Quick Nav Links */}
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#F8F2EC] text-[#5C4A4D] hover:text-[#24060B] font-medium transition-colors"
                  >
                    <User className="w-4 h-4 text-[#8C777A]" />
                    <span>My Profile &amp; Security</span>
                  </Link>

                  <Link
                    href="/super-admin"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#F8F2EC] text-[#5C4A4D] hover:text-[#24060B] font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#B88E3E]" />
                    <span>Super-Admin Center</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#F8F2EC] text-[#5C4A4D] hover:text-[#24060B] font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-[#8C777A]" />
                    <span>Switch Role Persona</span>
                  </Link>
                </div>

                {/* Sign Out Divider */}
                <div className="border-t border-[#F0E8DD] mt-2 pt-1.5">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 font-semibold transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out of Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
