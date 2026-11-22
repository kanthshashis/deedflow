"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, PlusCircle, LayoutGrid, ArrowLeft, Shield, CheckCircle2 } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24060B] flex flex-col font-sans relative selection:bg-[#4A0E17] selection:text-white">
      {/* Dynamic Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[450px] pointer-events-none ambient-glow-ivory opacity-85" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-50" />

      {/* Top Super-Admin Header */}
      <header className="bg-[#1A0508] border-b border-[#34070E] text-white sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/super-admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#4A0E17] border border-[#7D1826]/50 flex items-center justify-center text-[#D4B989] font-bold shadow-inner">
                <Shield className="w-4 h-4 text-[#D4B989]" />
              </div>
              <span className="font-bold tracking-tight text-white font-sans text-base">
                DeedFlow <span className="text-xs font-mono uppercase bg-[#B88E3E]/20 text-[#E5C98F] px-2 py-0.5 rounded border border-[#B88E3E]/40 font-bold">Super-Admin</span>
              </span>
            </Link>

            <span className="text-[#4E0E19]">|</span>

            <nav className="hidden sm:flex items-center space-x-1.5 text-xs">
              <Link
                href="/super-admin"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  pathname === "/super-admin"
                    ? "bg-[#4A0E17] text-white font-bold border border-[#7D1826]/50 shadow-xs"
                    : "text-[#C4A9AD] hover:text-white hover:bg-[#25060B]"
                }`}
              >
                Project Portfolio
              </Link>
              <Link
                href="/super-admin/provision"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname === "/super-admin/provision"
                    ? "bg-[#4A0E17] text-white font-bold border border-[#7D1826]/50 shadow-xs"
                    : "text-[#C4A9AD] hover:text-white hover:bg-[#25060B]"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#D4B989]" />
                <span>1-Click Provision Matrix</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg border border-[#3E0C14] bg-[#28070D] text-[#E5D7D9] hover:text-white hover:bg-[#34070E] transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4B989]" />
              <span className="hidden sm:inline">Go to Project Workspace</span>
              <span className="sm:hidden">Workspace</span>
            </Link>

            <Link
              href="/login"
              className="w-7 h-7 rounded-full bg-[#4A0E17] border border-[#7D1826]/50 text-[#D4B989] flex items-center justify-center font-bold text-xs"
              title="Super Admin Profile"
            >
              SA
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>
    </div>
  );
}
