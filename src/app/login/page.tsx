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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#0F172A] selection:text-white font-sans text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-md">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 lowercase font-sans">
            deedflow<span className="text-emerald-600">.</span>
          </span>
        </Link>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Institutional Builder Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
          Post-Sales Title Assurance, Basement Grid Concurrency &amp; Bank Kit Studio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200/80 rounded-2xl shadow-sm space-y-6">
          {/* Fast Role Switcher Tabs for QA & Testing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-slate-500">
              <span>Select Active Workspace Role:</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Instant Login</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => handleRoleSelect("super_admin")}
                className={`py-2 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  selectedRole === "super_admin"
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                Super-Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("project_admin")}
                className={`py-2 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  selectedRole === "project_admin"
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                Project Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("project_operator")}
                className={`py-2 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  selectedRole === "project_operator"
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                Site Operator
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600">
              {selectedRole === "super_admin" && (
                <span>
                  <strong>Global Platform Owner:</strong> Provision builder projects, generate tower/parking matrices, issue credentials.
                </span>
              )}
              {selectedRole === "project_admin" && (
                <span>
                  <strong>Sobha Royal Pavilion Head:</strong> Gatekeeper for change approvals, 1-click rollback, bulk Sale Deed issuance.
                </span>
              )}
              {selectedRole === "project_operator" && (
                <span>
                  <strong>Site CRM Executive:</strong> Drafts documents, uploads KYC OCR. Changes automatically route to Diff Approval Queue.
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent bg-white shadow-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo Auto-Filled</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent bg-white shadow-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-[#0F172A] hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-md shadow-[#0F172A]/15 cursor-pointer disabled:opacity-50"
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
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>UIDAI &amp; RERA Compliant</span>
            </span>
            <Link href="/" className="hover:text-slate-900 font-medium">
              ← Back to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
