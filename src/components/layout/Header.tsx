"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Shield } from "lucide-react";
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
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3] md:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-[#5C4A4D] hover:text-[#24060B] rounded-lg hover:bg-[#F3EAE0] transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs text-[#8C777A] font-medium">
            <span className="text-[#8C777A]">Workspace</span>
            <span className="text-[#DECFC0]">/</span>
            <span className="text-[#24060B] font-bold">Sobha Royal Pavilion</span>
            <span className="text-[#DECFC0]">/</span>
            <span className="text-[#5C4A4D] font-mono text-[11px] bg-[#F8F2EC] px-2 py-0.5 rounded border border-[#E8DFD3]">Tower B</span>
          </div>
        </div>

        {/* Right: Workspace Tag & Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#DECFC0] text-[#5C4A4D] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#B88E3E] animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#24060B]">
              Role: {role.replace("_", " ")}
            </span>
          </div>

          <Link
            href="/login"
            className="w-8 h-8 rounded-full bg-[#4A0E17] text-[#FAF7F2] border border-[#7D1826]/30 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-[#B88E3E]/60 transition-all"
            title="Switch User Role / Logout"
          >
            {role === "super_admin" ? "SA" : role === "project_admin" ? "AM" : "OP"}
          </Link>
        </div>
      </div>
    </header>
  );
}
