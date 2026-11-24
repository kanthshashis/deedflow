"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { PlusCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { getValidSession } from "@/lib/authStore";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = getValidSession();

      if (!session) {
        // Unauthenticated -> redirect to login with return URL
        setIsAuthenticated(false);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Strict Super Admin Clearance Check
      const user = session.user;
      const isSuperAdmin =
        user?.role === "super_admin" || user?.accessibleRoles?.includes("super_admin");

      if (!isSuperAdmin) {
        // Role Access Denied -> bounce unauthorized role to workspace dashboard
        setIsAuthenticated(false);
        router.replace("/dashboard");
        return;
      }

      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans text-[#24060B]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#821A2A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#5C4A4D] uppercase tracking-wider">
            Authenticating Super-Admin Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24060B] flex flex-col font-sans relative selection:bg-[#821A2A] selection:text-white">
      {/* Dynamic Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[450px] pointer-events-none ambient-glow-ivory opacity-85" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-50" />

      {/* Top Super-Admin Header - Subtle, Luminous Ivory Glass */}
      <header className="bg-[#FAF7F2]/95 border-b border-[#E8DFD3] text-[#24060B] sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Logo href="/super-admin" size="sm" badge="Admin" />

            <span className="text-[#DECFC0] hidden sm:inline">|</span>

            <nav className="hidden sm:flex items-center space-x-1.5 text-xs">
              <Link
                href="/super-admin"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  pathname === "/super-admin"
                    ? "bg-[#821A2A]/10 text-[#821A2A] font-bold border border-[#821A2A]/20 shadow-2xs"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                }`}
              >
                Project Portfolio
              </Link>
              <Link
                href="/super-admin/provision"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname === "/super-admin/provision"
                    ? "bg-[#821A2A]/10 text-[#821A2A] font-bold border border-[#821A2A]/20 shadow-2xs"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>1-Click Provision Matrix</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs shrink-0">
            <Link
              href="/dashboard"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#DECFC0] bg-[#FFFDFB] text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC] transition-colors flex items-center space-x-1.5 shadow-2xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#821A2A]" />
              <span className="hidden sm:inline">Go to Project Workspace</span>
              <span className="sm:hidden text-[11px]">Workspace</span>
            </Link>

            <Link
              href="/login"
              className="w-7 h-7 rounded-full bg-[#821A2A] text-white flex items-center justify-center font-bold text-xs shadow-xs"
              title="Super Admin Profile"
            >
              SA
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar for Super-Admin */}
        <div className="sm:hidden flex items-center space-x-1 pt-2 mt-2 border-t border-[#E8DFD3]/60 text-xs">
          <Link
            href="/super-admin"
            className={`flex-1 py-1 px-2 text-center rounded-lg font-medium transition-colors text-[11px] ${
              pathname === "/super-admin"
                ? "bg-[#821A2A]/10 text-[#821A2A] font-bold border border-[#821A2A]/20"
                : "text-[#5C4A4D] hover:bg-[#F8F2EC]"
            }`}
          >
            Project Portfolio
          </Link>
          <Link
            href="/super-admin/provision"
            className={`flex-1 py-1 px-2 text-center rounded-lg font-medium transition-colors text-[11px] flex items-center justify-center space-x-1 ${
              pathname === "/super-admin/provision"
                ? "bg-[#821A2A]/10 text-[#821A2A] font-bold border border-[#821A2A]/20"
                : "text-[#5C4A4D] hover:bg-[#F8F2EC]"
            }`}
          >
            <PlusCircle className="w-3 h-3 text-[#821A2A]" />
            <span>Provision Matrix</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>
    </div>
  );
}
