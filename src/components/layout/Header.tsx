"use client";

import React from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ onToggleMobileMenu, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F9FA]/90 backdrop-blur-md border-b border-[#E5E7EB] md:pl-64">
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
            <span>Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Northline Homes</span>
          </div>
        </div>

        {/* Right: Workspace Tag & User Avatar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-slate-600 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-mono text-[10px] tracking-wider text-slate-700">SAMPLE WORKSPACE</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs shadow-2xs">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
