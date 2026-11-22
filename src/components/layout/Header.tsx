"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { UserRole } from "@/lib/types";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

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

        {/* Right: Workspace Tag & Role Badge */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#DECFC0] text-[#5C4A4D] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#B88E3E] animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#24060B]">
              Role: {role.replace("_", " ")}
            </span>
          </div>

          <Link
            href="/login"
            className="w-8 h-8 rounded-full bg-[#821A2A] text-white border border-[#821A2A]/30 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-[#821A2A]/40 transition-all shrink-0"
            title="Switch User Role / Logout"
          >
            {role === "super_admin" ? "SA" : role === "project_admin" ? "AM" : "OP"}
          </Link>
        </div>
      </div>
    </header>
  );
}
