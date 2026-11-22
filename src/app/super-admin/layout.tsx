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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Top Super-Admin Header */}
      <header className="bg-[#090D10] border-b border-white/10 text-white sticky top-0 z-30 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/super-admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold tracking-tight text-white font-sans text-base">
                DeedFlow <span className="text-xs font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Super-Admin</span>
              </span>
            </Link>

            <span className="text-white/20">|</span>

            <nav className="hidden sm:flex items-center space-x-1 text-xs">
              <Link
                href="/super-admin"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  pathname === "/super-admin"
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Project Portfolio
              </Link>
              <Link
                href="/super-admin/provision"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname === "/super-admin/provision"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>1-Click Provision Matrix</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Enter Project Dashboard</span>
            </Link>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Switch Role
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
