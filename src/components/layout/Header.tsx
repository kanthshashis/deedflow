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
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 md:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span className="text-slate-400">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Sobha Royal Pavilion</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-mono text-[11px]">Tower B</span>
          </div>
        </div>

        {/* Right: Workspace Tag & Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-800">
              Role: {role.replace("_", " ")}
            </span>
          </div>

          <Link
            href="/login"
            className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-emerald-400 transition-all"
            title="Switch Workspace Role"
          >
            AM
          </Link>
        </div>
      </div>
    </header>
  );
}
