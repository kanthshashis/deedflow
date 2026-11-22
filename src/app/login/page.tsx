"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Lock,
  Sparkles,
  Building2,
  Scale,
  Car,
  Landmark,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Shield,
  HelpCircle,
} from "lucide-react";
import { DEMO_USERS } from "@/lib/mockData";
import { UserRole } from "@/lib/types";
import { loginUser } from "@/lib/authStore";

export default function LoginPage() {
  const router = useRouter();

  // Mode: Instant Demo Persona vs Direct Corporate Email Login
  const [authMode, setAuthMode] = useState<"persona" | "direct">("persona");
  const [selectedRole, setSelectedRole] = useState<UserRole>("project_admin");
  const [email, setEmail] = useState("aidan@sobha.com");
  const [password, setPassword] = useState("Prestige@2026!Deed");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const personas: {
    role: UserRole;
    name: string;
    designation: string;
    email: string;
    icon: any;
    badge: string;
    description: string;
  }[] = [
    {
      role: "super_admin",
      name: "Shashi Shekar",
      designation: "VP of Platform Engineering",
      email: "shashi@deedflow.in",
      icon: Sparkles,
      badge: "Global Platform",
      description: "Provision builder organizations, manage project licenses, system matrix health.",
    },
    {
      role: "promoter_executive",
      name: "Vikramaditya Rao",
      designation: "Managing Director & Promoter",
      email: "vikramaditya@sobha.com",
      icon: Building2,
      badge: "Executive Leadership",
      description: "Executive cash inflow monitoring, overview KPIs, read-only promoter oversight.",
    },
    {
      role: "project_admin",
      name: "Aidan Morgan",
      designation: "Head of CRM & Post-Sales",
      email: "aidan@sobha.com",
      icon: KeyRound,
      badge: "Omni Authority",
      description: "Master schedule imports, Diff Review Queue approver, slot swap authority.",
    },
    {
      role: "legal_counsel",
      name: "Advocate Krishnamurthy",
      designation: "Chief Legal Counsel & Title Officer",
      email: "krishnamurthy.legal@sobha.com",
      icon: Scale,
      badge: "Title & RERA",
      description: "Template Studio authority, RERA Form N compliance, legal version rollback.",
    },
    {
      role: "project_operator",
      name: "Pooja Hegde",
      designation: "Senior Post-Sales Executive",
      email: "pooja.post_sales@sobha.com",
      icon: Car,
      badge: "Site CRM Desk",
      description: "KYC card scanning, 2-click document generation, auto-routes edits to Diff Queue.",
    },
    {
      role: "bank_auditor",
      name: "Ramesh Kumar",
      designation: "SBI RACPC Home Loan Auditor",
      email: "ramesh.kumar@sbi.co.in",
      icon: Landmark,
      badge: "Bank Consortium",
      description: "Verifies mortgage NOCs, payment milestone UTRs, title clearance hashes.",
    },
  ];

  const handlePersonaSelect = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword("Prestige@2026!Deed");
    setErrorMessage(null);
  };

  const executeSignIn = (roleToLogin: UserRole, emailToLogin: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      loginUser(emailToLogin, password, roleToLogin);
      setIsLoading(false);

      if (roleToLogin === "super_admin") {
        router.push("/super-admin");
      } else {
        router.push("/dashboard");
      }
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter a valid corporate email address.");
      return;
    }
    executeSignIn(selectedRole, email);
  };

  const handleQuickPersonaSignIn = (role: UserRole, personaEmail: string) => {
    setSelectedRole(role);
    setEmail(personaEmail);
    executeSignIn(role, personaEmail);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotSubmitted(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#821A2A] selection:text-white font-sans text-[#24060B]">
      {/* Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none ambient-glow-ivory opacity-90" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-60" />

      {/* Brand Header */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Logo href="/" size="lg" className="justify-center" />

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#24060B]">
          Institutional Real Estate Workspace Sign In
        </h1>
        <p className="mt-1 text-xs text-[#5C4A4D] max-w-md mx-auto">
          Post-Sales Title Assurance, Basement Grid Concurrency &amp; Bank Kit Studio
        </p>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 inline-flex p-1 rounded-xl bg-[#EFE7DE] border border-[#DECFC0] shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode("persona");
              setErrorMessage(null);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              authMode === "persona"
                ? "bg-[#821A2A] text-white shadow-xs font-bold"
                : "text-[#5C4A4D] hover:text-[#24060B]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E5C178]" />
            <span>1-Click Persona Access</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("direct");
              setErrorMessage(null);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              authMode === "direct"
                ? "bg-[#821A2A] text-white shadow-xs font-bold"
                : "text-[#5C4A4D] hover:text-[#24060B]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Builder Login</span>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="glossy-card bg-[#FFFDFB] py-7 px-6 sm:px-8 border border-[#DECFC0] rounded-2xl shadow-xs space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: 1-Click Interactive Persona Switcher */}
          {authMode === "persona" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase font-bold text-[#8C777A]">
                <span>Choose Enterprise Persona to Launch:</span>
                <span className="text-[#B88E3E] flex items-center space-x-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Role-Gated RBAC</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personas.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedRole === p.role;
                  return (
                    <div
                      key={p.role}
                      onClick={() => handlePersonaSelect(p.role)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FDF9F3] border-[#821A2A] ring-2 ring-[#821A2A]/20 shadow-xs"
                          : "bg-white border-[#E8DFD3] hover:border-[#821A2A]/40 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isSelected
                                  ? "bg-[#821A2A] text-white"
                                  : "bg-[#F3EAE0] text-[#821A2A] group-hover:bg-[#821A2A] group-hover:text-white transition-colors"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#24060B] leading-tight">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-[#8C777A] font-mono">
                                {p.designation}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              isSelected
                                ? "bg-[#821A2A] text-white"
                                : "bg-[#F8F2EC] text-[#5C4A4D] border border-[#DECFC0]"
                            }`}
                          >
                            {p.badge}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#5C4A4D] line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#F0E8DD] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#8C777A] truncate max-w-[130px]">
                          {p.email}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickPersonaSignIn(p.role, p.email);
                          }}
                          disabled={isLoading}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-[#821A2A] hover:bg-[#6E1220] transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                        >
                          <span>Launch</span>
                          <ArrowRight className="w-3 h-3 text-[#E5C178]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => executeSignIn(selectedRole, email)}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white glossy-btn-burgundy hover:brightness-105 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating Workspace...</span>
                ) : (
                  <>
                    <span>
                      Sign In as{" "}
                      {personas.find((p) => p.role === selectedRole)?.name || "Selected Persona"}{" "}
                      ({personas.find((p) => p.role === selectedRole)?.designation})
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#E5C178]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Direct Corporate Email Form */}
          {authMode === "direct" && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C4A4D] uppercase tracking-wider mb-1">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vikram.m@prestigeconstructions.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A] bg-white shadow-xs font-sans"
                  />
                  <Mail className="w-4 h-4 text-[#8C777A] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#5C4A4D] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] text-[#821A2A] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A] bg-white shadow-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[#8C777A] hover:text-[#24060B] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Target Workspace Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#5C4A4D] uppercase tracking-wider mb-1">
                  Workspace Access Scope
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A] bg-white shadow-xs font-medium cursor-pointer"
                >
                  <option value="project_admin">Project Admin (Head of CRM &amp; Operations)</option>
                  <option value="promoter_executive">Promoter / Managing Director (Executive KPI View)</option>
                  <option value="legal_counsel">Legal Counsel &amp; RERA Advocate</option>
                  <option value="project_operator">Site CRM Executive (Document Studio &amp; Parking)</option>
                  <option value="bank_auditor">SBI RACPC Bank Auditor (Mortgage Clearance)</option>
                  <option value="super_admin">Super-Admin (Platform Architecture Center)</option>
                </select>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs text-[#5C4A4D] pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#DECFC0] text-[#821A2A] focus:ring-[#821A2A] cursor-pointer"
                  />
                  <span>Keep session active on this workstation</span>
                </label>
                <span className="text-[11px] font-mono text-[#8C777A]">256-Bit SSL Encrypted</span>
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
                    <span>Sign In to DeedFlow Workspace</span>
                    <ArrowRight className="w-4 h-4 text-[#E5C178]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Badges */}
          <div className="border-t border-[#F0E8DD] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C777A]">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>UIDAI Aadhaar Redaction Compliant</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>RERA Title Assurance</span>
              </span>
            </div>
            <Link href="/" className="hover:text-[#821A2A] font-semibold transition-colors">
              ← Back to Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DECFC0] p-6 max-w-md w-full shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#821A2A]">
                <KeyRound className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#24060B]">Reset Workstation Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[#8C777A] hover:text-[#24060B] text-sm"
              >
                ✕
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Temporary Access Token Dispatched</span>
                </div>
                <p>
                  A one-time cryptographic reset token has been dispatched to <strong>{forgotEmail}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-[#5C4A4D]">
                  Enter your registered corporate builder email address to receive an instant recovery link.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#5C4A4D] mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. aidan@sobha.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#DECFC0] text-[#5C4A4D] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#821A2A] hover:bg-[#6E1220]"
                  >
                    Dispatch Reset Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
