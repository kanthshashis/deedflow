"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Settings, ShieldCheck } from "lucide-react";
import { UserRole } from "@/lib/types";

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
  const [role, setRole] = useState<UserRole>("project_admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("deedflow_active_role") as UserRole | null;
      if (storedRole) {
        setRole(storedRole);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3] w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 sm:p-2 text-[#5C4A4D] hover:text-[#24060B] rounded-lg hover:bg-[#F3EAE0] transition-colors shrink-0"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-[#8C777A] font-medium min-w-0">
            <span className="text-[#8C777A] hidden sm:inline">Workspace</span>
            <span className="text-[#DECFC0] hidden sm:inline">/</span>
            <span className="text-[#24060B] font-bold truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              Sobha Royal Pavilion
            </span>
            <span className="text-[#DECFC0]">/</span>
            <span className="text-[#5C4A4D] font-mono text-[10px] sm:text-[11px] bg-[#F8F2EC] px-1.5 sm:px-2 py-0.5 rounded border border-[#E8DFD3] shrink-0 font-semibold">
              Tower B
            </span>
          </div>
        </div>

        {/* Right: Settings, Role Badge & User Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <Link
            href="/dashboard/settings"
            className="p-1.5 sm:p-2 text-[#5C4A4D] hover:text-[#821A2A] rounded-xl hover:bg-[#F3EAE0] transition-colors"
            title="Enterprise Settings & Profile"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#DECFC0] text-[#5C4A4D] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#B88E3E] animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#24060B]">
              Role: {ROLE_LABELS[role] || role}
            </span>
          </div>

          <Link
            href="/dashboard/settings"
            className="w-8 h-8 rounded-full bg-[#821A2A] text-white border border-[#821A2A]/30 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-[#821A2A]/40 transition-all shrink-0 cursor-pointer"
            title="My Profile & Settings"
          >
            {ROLE_INITIALS[role] || "DF"}
          </Link>
        </div>
      </div>
    </header>
  );
}
