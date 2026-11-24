"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Shield,
  Building2,
} from "lucide-react";
import { loginUser } from "@/lib/authStore";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const executeSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your corporate builder email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your workstation password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginUser(email.trim(), password);
      setIsLoading(false);

      if (result.success) {
        const redirectTarget = searchParams.get("redirect");
        if (redirectTarget && redirectTarget.startsWith("/")) {
          router.push(redirectTarget);
        } else if (result.user.role === "super_admin") {
          router.push("/super-admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage("Authentication failed. Please verify your corporate credentials.");
      }
    }, 600);
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
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo href="/" size="lg" className="justify-center" />

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#24060B]">
          Institutional Workstation Sign In
        </h1>
        <p className="mt-1 text-xs text-[#5C4A4D] max-w-sm mx-auto">
          Post-Sales Title Assurance, Basement Grid Concurrency &amp; Bank Kit Studio
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glossy-card bg-[#FFFDFB] py-8 px-6 sm:px-8 border border-[#DECFC0] rounded-2xl shadow-xs space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={executeSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5C4A4D] uppercase tracking-wider mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aidan.morgan@sobha.com"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A] bg-white shadow-xs font-sans transition-all"
                />
                <Mail className="w-4 h-4 text-[#8C777A] absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
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
                  placeholder="Enter your workstation password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A] bg-white shadow-xs font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#8C777A] hover:text-[#24060B] cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                <span>Remember me on this terminal</span>
              </label>
              <span className="text-[10px] font-mono text-[#8C777A] flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>256-Bit SSL</span>
              </span>
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

          {/* Test Credentials Reference Callout */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-[11px] text-[#5C4A4D] space-y-1">
            <div className="font-bold text-[#24060B] flex items-center justify-between">
              <span>Builder Test Accounts Reference:</span>
              <span className="font-mono text-[10px] text-[#821A2A]">Password: Prestige@2026!Deed</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] font-mono text-[#8C777A] pt-1">
              <div>• Project Admin: <span className="text-[#24060B]">aidan@sobha.com</span></div>
              <div>• Super-Admin: <span className="text-[#24060B]">shashi@deedflow.in</span></div>
              <div>• Promoter MD: <span className="text-[#24060B]">vikramaditya@sobha.com</span></div>
              <div>• Legal Head: <span className="text-[#24060B]">krishnamurthy.legal@sobha.com</span></div>
            </div>
            <p className="text-[10px] text-[#8C777A] pt-1">
              Once signed in, multi-role users can toggle their active RBAC clearance directly from the header.
            </p>
          </div>

          {/* Security & Compliance Badges */}
          <div className="border-t border-[#F0E8DD] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C777A]">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>UIDAI Aadhaar Redacted</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>RERA Title Invariant</span>
              </span>
            </div>
            <Link href="/" className="hover:text-[#821A2A] font-semibold transition-colors">
              ← Overview
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
                className="text-[#8C777A] hover:text-[#24060B] text-sm cursor-pointer"
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
                  A cryptographic reset token has been dispatched to <strong>{forgotEmail}</strong>.
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
                    placeholder="e.g. aidan.morgan@sobha.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECFC0] text-xs text-[#24060B] focus:outline-none focus:ring-2 focus:ring-[#821A2A]/30 focus:border-[#821A2A]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#DECFC0] text-[#5C4A4D] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#821A2A] hover:bg-[#6E1220] cursor-pointer"
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans text-[#24060B]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#821A2A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#5C4A4D] uppercase tracking-wider">
              Loading Workspace Sign In...
            </p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
