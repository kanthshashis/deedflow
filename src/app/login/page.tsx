"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Building2, UserCheck, Lock, Sparkles } from "lucide-react";
import { DEMO_USERS } from "@/lib/mockData";
import { UserRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("project_admin");
  const [email, setEmail] = useState("aidan@sobha.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword("••••••••••••");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("deedflow_active_role", selectedRole);
      localStorage.setItem("deedflow_user_email", email);
    }

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === "super_admin") {
        router.push("/super-admin");
      } else {
        router.push("/dashboard");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#4A0E17] selection:text-white font-sans text-[#24060B]">
      {/* Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none ambient-glow-ivory opacity-90" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-60" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        <Link href="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#4A0E17] border border-[#7D1826]/40 text-[#D4B989] flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-5 h-5 text-[#D4B989]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#24060B] lowercase font-sans">
            deedflow<span className="text-[#B88E3E]">.</span>
          </span>
        </Link>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#24060B]">
          Institutional Builder Sign In
        </h2>
        <p className="mt-1 text-xs text-[#5C4A4D] max-w-xs mx-auto">
          Post-Sales Title Assurance, Basement Grid Concurrency &amp; Bank Kit Studio
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glossy-card bg-[#FFFDFB] py-8 px-6 sm:px-8 border border-[#DECFC0] rounded-2xl shadow-xs space-y-6">
          {/* Fast Role Switcher Tabs for QA & Testing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-[#8C777A]">
              <span>Select Active Workspace Role:</span>
              <span className="text-[#B88E3E] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#B88E3E]" />
                <span>Instant Demo</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F8F2EC] border border-[#E8DFD3] text-xs">
              <button
                type="button"
                onClick={() => handleRoleSelect("super_admin")}
                className={`py-2 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  selectedRole === "super_admin"
                    ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                    : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-white/60"
                }`}
              >
                Super-Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("project_admin")}
                className={`py-2 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  selectedRole === "project_admin"
                    ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                    : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-white/60"
                }`}
              >
                Project Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("project_operator")}
                className={`py-2 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  selectedRole === "project_operator"
                    ? "bg-[#4A0E17] text-white shadow-xs font-bold"
                    : "text-[#5C4A4D] hover:text-[#24060B] hover:bg-white/60"
                }`}
              >
                Site Operator
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[11px] text-[#5C4A4D]">
              {selectedRole === "super_admin" && (
                <span>
                  <strong className="text-[#24060B]">Global Platform Owner:</strong> Provision builder projects, generate tower/parking matrices, issue credentials.
                </span>
              )}
              {selectedRole === "project_admin" && (
                <span>
                  <strong className="text-[#24060B]">Sobha Royal Pavilion Head:</strong> Gatekeeper for change approvals, 1-click rollback, bulk Sale Deed issuance.
                </span>
              )}
              {selectedRole === "project_operator" && (
                <span>
                  <strong className="text-[#24060B]">Site CRM Executive:</strong> Drafts documents, uploads KYC OCR. Changes automatically route to Diff Approval Queue.
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5C4A4D] uppercase tracking-wider mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#4A0E17]/30 focus:border-[#4A0E17] bg-white shadow-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#5C4A4D] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-[#8C777A]">Demo Auto-Filled</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#4A0E17]/30 focus:border-[#4A0E17] bg-white shadow-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white glossy-btn-burgundy hover:brightness-105 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Workspace...</span>
              ) : (
                <>
                  <span>
                    Sign In as{" "}
                    {selectedRole === "super_admin"
                      ? "Super-Admin"
                      : selectedRole === "project_admin"
                      ? "Project Admin"
                      : "Operator"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#D4B989]" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-[#F0E8DD] pt-4 flex items-center justify-between text-[11px] text-[#8C777A]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>UIDAI &amp; RERA Compliant</span>
            </span>
            <Link href="/" className="hover:text-[#4A0E17] font-semibold transition-colors">
              ← Back to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
