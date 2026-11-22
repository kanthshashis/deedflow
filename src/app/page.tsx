"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  FileCheck2,
  ShieldCheck,
  Car,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  Compass,
  Download,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  FileText,
  Sun,
  Moon,
  Landmark,
} from "lucide-react";
import clsx from "clsx";
import { InteractiveStudioMockup } from "@/components/mockup/InteractiveStudioMockup";
import { ArchitecturalBlueprintGrid } from "@/components/mockup/ArchitecturalBlueprintGrid";
import { IsometricGarage3D } from "@/components/canvas/IsometricGarage3D";
import { LaserDocScannerHUD } from "@/components/canvas/LaserDocScannerHUD";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { ClerkVsDeedflowComparison } from "@/components/landing/ClerkVsDeedflowComparison";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

type ThemeMode = "ivory" | "linear" | "luxury";
type ShowcaseTab = "studio" | "cad" | "3d" | "laser";

export default function LandingPage() {
  const [theme, setTheme] = useState<ThemeMode>("ivory");
  const [activeShowcase, setActiveShowcase] = useState<ShowcaseTab>("studio");

  const isIvory = theme === "ivory";
  const isDark = theme === "linear";
  const isLuxury = theme === "luxury";

  return (
    <div
      className={clsx(
        "min-h-screen relative font-sans transition-colors duration-300",
        isIvory && "theme-ivory bg-[#FAF7F2] text-[#24060B] selection:bg-[#4A0E17] selection:text-white",
        isDark && "theme-dark bg-[#08090A] text-slate-100 selection:bg-[#5E6AD2] selection:text-white",
        isLuxury && "theme-luxury bg-[#F5F4F0] text-stone-900 selection:bg-stone-900 selection:text-white"
      )}
    >
      {/* Dynamic Ambient Horizon Glow */}
      {isIvory && <div className="absolute top-0 inset-x-0 h-[650px] pointer-events-none ambient-glow-ivory opacity-95" />}
      {isDark && <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none ambient-glow-dark opacity-80" />}
      {isLuxury && <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none ambient-glow-luxury opacity-70" />}

      {/* Grid Pattern Overlay */}
      <div
        className={clsx(
          "absolute top-0 inset-x-0 h-full pointer-events-none",
          isIvory && "bg-grid-ivory opacity-60",
          isDark && "bg-grid-dark opacity-35",
          isLuxury && "bg-grid-luxury opacity-45"
        )}
      />

      {/* Top 3-Way UX Direction Switcher Banner */}
      <aside aria-label="UX Direction Switcher" className={clsx(
        "sticky top-0 z-50 border-b py-2 px-4 backdrop-blur-xl transition-colors",
        isIvory && "bg-[#FAF7F2]/95 border-[#E8DFD3] shadow-xs",
        isDark && "bg-[#08090A]/90 border-white/10 shadow-md",
        isLuxury && "bg-[#F5F4F0]/90 border-stone-200 shadow-xs"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#7D1826] animate-pulse" />
            <span className="font-semibold text-[11px] uppercase tracking-wider opacity-75">
              Live UX Direction:
            </span>
            <span className={clsx("font-bold text-[11px]", isIvory ? "text-[#7D1826]" : isDark ? "text-indigo-400" : "text-amber-800")}>
              {isIvory && "1. Royal White Ivory & Burgundy (Ultra-Premium Estate Dossier)"}
              {isDark && "2. Linear Dark Precision (Obsidian Void)"}
              {isLuxury && "3. Apple / Architectural Minimal Stone"}
            </span>
          </div>

          {/* The 3 Clickable World-Class Buttons */}
          <div className={clsx(
            "flex items-center space-x-1 p-1 rounded-xl border spring-snap",
            isIvory ? "bg-[#F8F2EC] border-[#DECFC0]" : isDark ? "bg-white/5 border-white/10" : "bg-stone-100 border-stone-200"
          )}>
            <button
              onClick={() => setTheme("ivory")}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold spring-snap flex items-center space-x-1.5 transition-all cursor-pointer",
                isIvory
                  ? "bg-[#4A0E17] text-[#FAF7F2] font-bold shadow-md shadow-[#4A0E17]/20 border border-[#6B1B26]"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <Sun className="w-3.5 h-3.5 text-[#E5C178]" />
              <span>1. Ivory &amp; Burgundy</span>
            </button>

            <button
              onClick={() => setTheme("linear")}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold spring-snap flex items-center space-x-1.5 transition-all cursor-pointer",
                isDark
                  ? "bg-[#5E6AD2] text-white font-bold shadow-[0_0_15px_rgba(94,106,210,0.4)]"
                  : isIvory
                  ? "text-[#5C4A4D] hover:text-[#4A0E17]"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>2. Linear Dark</span>
            </button>

            <button
              onClick={() => setTheme("luxury")}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold spring-snap flex items-center space-x-1.5 transition-all cursor-pointer",
                isLuxury
                  ? "bg-stone-900 text-white font-bold shadow-sm"
                  : isIvory
                  ? "text-[#5C4A4D] hover:text-[#4A0E17]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>3. Minimal Stone</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Navigation Bar */}
      <nav className={clsx(
        "border-b transition-colors",
        isIvory && "bg-[#FAF7F2]/90 border-[#E8DFD3]",
        isDark && "bg-[#08090A]/80 border-white/10",
        isLuxury && "bg-[#F5F4F0]/80 border-stone-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div
              className={clsx(
                "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 spring-snap",
                isIvory && "bg-[#4A0E17] text-[#E5C178] border border-[#6B1B26] shadow-sm",
                isDark && "bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-indigo-400 shadow-[0_0_15px_rgba(94,106,210,0.3)]",
                isLuxury && "bg-stone-900 text-white"
              )}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className={clsx("text-base font-extrabold tracking-tight", isIvory && "text-[#24060B]", isLuxury && "font-serif")}>
                DeedFlow
              </span>
              <span className="text-[9px] font-mono opacity-60 uppercase tracking-wider -mt-0.5">
                {isIvory && "Royal Burgundy Edition"}
                {isDark && "Institutional Core"}
                {isLuxury && "Stone Monolith Edition"}
              </span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold opacity-75">
            <a href="#showcase" className="hover:opacity-100 transition-opacity">
              Live Studio
            </a>
            <a href="#matrix" className="hover:opacity-100 transition-opacity">
              Workflow Friction
            </a>
            <a href="#capabilities" className="hover:opacity-100 transition-opacity">
              Institutional Specs
            </a>
            <a href="#roi" className="hover:opacity-100 transition-opacity">
              ROI Simulator
            </a>
            <a href="#faq" className="hover:opacity-100 transition-opacity">
              FAQ
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <div className={clsx(
              "hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
              isIvory && "glossy-pill text-[#7D1826] border-[#E8C8CC]",
              isDark && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              isLuxury && "bg-stone-100 text-stone-800 border-stone-200"
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7D1826] animate-pulse" />
              <span>Launch Partner: Free Beta</span>
            </div>

            <Link
              href="/dashboard"
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 spring-snap shadow-sm cursor-pointer",
                isIvory && "glossy-btn-burgundy text-[#FAF7F2]",
                isDark && "bg-[#5E6AD2] hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(94,106,210,0.4)]",
                isLuxury && "bg-stone-900 hover:bg-black text-white"
              )}
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E5C178]" />
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow Pill */}
          <div
            className={clsx(
              "inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-xs",
              isIvory && "glossy-pill border-[#E8C8CC] text-[#7D1826]",
              isDark && "bg-surface border-border text-indigo-300",
              isLuxury && "bg-stone-100 border-stone-300 text-stone-800"
            )}
          >
            <span className={clsx("w-2 h-2 rounded-full animate-pulse", isIvory ? "bg-[#7D1826]" : isDark ? "bg-indigo-500" : "bg-stone-800")} />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {isIvory && "Royal Title Assurance • RERA Section 11 & 17 Standard"}
              {isDark && "Deterministic Post-Sales Automation & Inventory Twin"}
              {isLuxury && "Architectural Drawing Reconciliation & Title Precision"}
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={clsx(
              "text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.08]",
              isIvory && "text-[#24060B]",
              isLuxury && "font-serif"
            )}
          >
            {isIvory && (
              <>
                Automate Post-Sales Legal Dossiers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7D1826] via-[#B88E3E] to-[#4A0E17]">
                  Accelerate Home Loan Disbursements.
                </span>
              </>
            )}
            {isDark && (
              <>
                Eliminate Deed Rework. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-emerald-300">
                  Reconcile Parking in 12 Seconds.
                </span>
              </>
            )}
            {isLuxury && (
              <>
                Flawless Title Documentation. <br />
                <span className="text-stone-700 font-serif italic">
                  Architectural Parking Precision.
                </span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className={clsx("text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed", isIvory ? "text-[#5C4A4D]" : "opacity-80")}>
            {isIvory &&
              "Zero clerical typos in words. Lock basement parking bays without dual-allotments. Deliver 100% first-pass bank-ready home loan NOCs for SBI, HDFC, and ICICI in 12 seconds."}
            {isDark &&
              "Replace manual Word copy-pasting, previous buyer data leaks, and basement parking clashes. DeedFlow generates RERA-compliant deed dossiers and locks bays with atomic concurrency."}
            {isLuxury &&
              "Ensuring every multi-crore residential allotment matches structural BBMP sanctioned drawings and institutional bank compliance with zero discrepancies."}
          </p>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className={clsx(
                "w-full sm:w-auto px-6 py-3.5 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 spring-snap cursor-pointer",
                isIvory && "glossy-btn-burgundy text-[#FAF7F2]",
                isDark && "bg-[#5E6AD2] hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(94,106,210,0.4)]",
                isLuxury && "bg-stone-900 hover:bg-black text-white"
              )}
            >
              <Zap className={clsx("w-4 h-4", isIvory ? "text-[#E5C178]" : "text-white")} />
              <span>Launch Live Workstation</span>
            </Link>

            <a
              href="/templates/car-parking-allotment.docx"
              download
              className={clsx(
                "w-full sm:w-auto px-6 py-3.5 border font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 spring-snap cursor-pointer",
                isIvory && "glossy-btn-ivory text-[#4A0E17]",
                isDark && "bg-surface hover:bg-surface-muted text-ink border-border shadow-card",
                isLuxury && "bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs"
              )}
            >
              <Download className={clsx("w-4 h-4", isIvory ? "text-[#7D1826]" : "text-emerald-600")} />
              <span>Download Sample Bank Kit (.docx)</span>
            </a>
          </div>

          {/* Trust Ticker Row */}
          <div className={clsx(
            "pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-center",
            isIvory ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-300"
          )}>
            <div className={clsx(
              "p-3.5 rounded-xl border",
              isIvory ? "glossy-card border-[#DECFC0]" : isDark ? "bg-surface/50 border-border/50" : "bg-white border-stone-200"
            )}>
              <div className={clsx("font-mono text-xl sm:text-2xl font-bold", isIvory ? "text-[#24060B]" : "text-slate-900")}>₹2,400+ Cr</div>
              <div className={clsx("text-[11px] mt-0.5", isIvory ? "text-[#5C4A4D]" : "opacity-70")}>Asset Inventory Tracked</div>
            </div>
            <div className={clsx(
              "p-3.5 rounded-xl border",
              isIvory ? "glossy-card border-[#E8C8CC]" : isDark ? "bg-surface/50 border-border/50 text-emerald-400" : "bg-white border-stone-200 text-emerald-800"
            )}>
              <div className={clsx("font-mono text-xl sm:text-2xl font-bold", isIvory ? "text-[#7D1826]" : "")}>12 Seconds</div>
              <div className={clsx("text-[11px] mt-0.5", isIvory ? "text-[#5C4A4D]" : "opacity-70")}>Average Bank Kit Creation</div>
            </div>
            <div className={clsx(
              "p-3.5 rounded-xl border",
              isIvory ? "glossy-card border-[#DFD1B8]" : isDark ? "bg-surface/50 border-border/50 text-indigo-300" : "bg-white border-stone-200 text-amber-900"
            )}>
              <div className={clsx("font-mono text-xl sm:text-2xl font-bold", isIvory ? "text-[#8C6D2D]" : "")}>0 Disputes</div>
              <div className={clsx("text-[11px] mt-0.5", isIvory ? "text-[#5C4A4D]" : "opacity-70")}>Parking Bay Double-Allotment</div>
            </div>
            <div className={clsx(
              "p-3.5 rounded-xl border",
              isIvory ? "glossy-card border-[#DECFC0]" : isDark ? "bg-surface/50 border-border/50" : "bg-white border-stone-200"
            )}>
              <div className={clsx("font-mono text-xl sm:text-2xl font-bold", isIvory ? "text-[#24060B]" : "text-slate-900")}>100% RERA</div>
              <div className={clsx("text-[11px] mt-0.5", isIvory ? "text-[#5C4A4D]" : "opacity-70")}>&amp; UIDAI Circular Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Showcase Hub */}
      <section id="showcase" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="space-y-6">
          {/* Header & Stage Switcher */}
          <div className={clsx("flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6", isIvory ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-300")}>
            <div className="space-y-1">
              <span className={clsx("text-xs font-mono uppercase tracking-wider font-semibold flex items-center space-x-1.5", isIvory ? "text-[#7D1826]" : isDark ? "text-indigo-400" : "text-amber-800")}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Software Sandbox</span>
              </span>
              <h2 className={clsx("text-2xl sm:text-3xl font-extrabold tracking-tight", isIvory && "text-[#24060B]", isLuxury && "font-serif")}>
                Experience DeedFlow Live Above The Fold
              </h2>
              <p className={clsx("text-xs sm:text-sm", isIvory ? "text-[#5C4A4D]" : "opacity-75")}>
                Toggle through all 4 proprietary engines. Real data, real deterministic rendering, zero mockups.
              </p>
            </div>

            {/* Showcase Stage Selector Tabs */}
            <div className={clsx(
              "flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border shadow-xs",
              isIvory ? "bg-[#F8F2EC] border-[#DECFC0]" : isDark ? "bg-surface border-border" : "bg-stone-100 border-stone-200"
            )}>
              <button
                onClick={() => setActiveShowcase("studio")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium spring-snap transition-all flex items-center space-x-1.5 cursor-pointer",
                  activeShowcase === "studio"
                    ? isIvory ? "bg-[#4A0E17] text-[#FAF7F2] font-bold shadow-md shadow-[#4A0E17]/15 border border-[#6B1B26]" : isDark ? "bg-[#5E6AD2] text-white font-semibold shadow-[0_0_15px_rgba(94,106,210,0.3)]" : "bg-stone-900 text-white font-bold"
                    : isIvory ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#F3EAE0]" : "opacity-70 hover:opacity-100"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Legal Deed Synthesizer</span>
              </button>

              <button
                onClick={() => setActiveShowcase("cad")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium spring-snap transition-all flex items-center space-x-1.5 cursor-pointer",
                  activeShowcase === "cad"
                    ? isIvory ? "bg-[#4A0E17] text-[#FAF7F2] font-bold shadow-md shadow-[#4A0E17]/15 border border-[#6B1B26]" : isDark ? "bg-[#5E6AD2] text-white font-semibold shadow-[0_0_15px_rgba(94,106,210,0.3)]" : "bg-stone-900 text-white font-bold"
                    : isIvory ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#F3EAE0]" : "opacity-70 hover:opacity-100"
                )}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Basement CAD Grid</span>
              </button>

              <button
                onClick={() => setActiveShowcase("3d")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium spring-snap transition-all flex items-center space-x-1.5 cursor-pointer",
                  activeShowcase === "3d"
                    ? isIvory ? "bg-[#4A0E17] text-[#FAF7F2] font-bold shadow-md shadow-[#4A0E17]/15 border border-[#6B1B26]" : isDark ? "bg-[#5E6AD2] text-white font-semibold shadow-[0_0_15px_rgba(94,106,210,0.3)]" : "bg-stone-900 text-white font-bold"
                    : isIvory ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#F3EAE0]" : "opacity-70 hover:opacity-100"
                )}
              >
                <Car className="w-3.5 h-3.5" />
                <span>3D Isometric Twin</span>
              </button>

              <button
                onClick={() => setActiveShowcase("laser")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium spring-snap transition-all flex items-center space-x-1.5 cursor-pointer",
                  activeShowcase === "laser"
                    ? isIvory ? "bg-[#4A0E17] text-[#FAF7F2] font-bold shadow-md shadow-[#4A0E17]/15 border border-[#6B1B26]" : isDark ? "bg-[#5E6AD2] text-white font-semibold shadow-[0_0_15px_rgba(94,106,210,0.3)]" : "bg-stone-900 text-white font-bold"
                    : isIvory ? "text-[#5C4A4D] hover:text-[#4A0E17] hover:bg-[#F3EAE0]" : "opacity-70 hover:opacity-100"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Laser KYC OCR HUD</span>
              </button>
            </div>
          </div>

          {/* Active Interactive Stage */}
          <div className="pt-2 animate-fade-in">
            {activeShowcase === "studio" && <InteractiveStudioMockup theme={isIvory ? "stripe" : theme} />}
            {activeShowcase === "cad" && <ArchitecturalBlueprintGrid theme={isIvory ? "stripe" : theme} />}
            {activeShowcase === "3d" && <IsometricGarage3D />}
            {activeShowcase === "laser" && <LaserDocScannerHUD />}
          </div>
        </div>
      </section>

      {/* Comparison: The Clerk Friction vs. DeedFlow */}
      <section id="matrix" className={clsx("py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t relative z-10", isIvory ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-300")}>
        <ClerkVsDeedflowComparison />
      </section>

      {/* Bento Grid: 4 Core Capabilities */}
      <section id="capabilities" className={clsx("py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t relative z-10", isIvory ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-300")}>
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className={clsx("text-xs font-mono uppercase tracking-wider font-semibold", isIvory ? "text-[#7D1826]" : isDark ? "text-emerald-400" : "text-amber-800")}>
              Proprietary Reliability Architecture
            </span>
            <h2 className={clsx("text-2xl sm:text-3xl font-extrabold tracking-tight", isIvory && "text-[#24060B]", isLuxury && "font-serif")}>
              Engineered for Institutional Developers &amp; Banks
            </h2>
            <p className={clsx("text-xs sm:text-sm max-w-xl mx-auto", isIvory ? "text-[#5C4A4D]" : "opacity-75")}>
              Built with mathematical guarantees, zero hallucinated numbers, and total UIDAI compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Bento Card 1 */}
            <div className={clsx(
              "rounded-2xl p-6 border space-y-3 spring-snap",
              isIvory ? "glossy-card border-[#E8DFD3]" : isDark ? "surface-card border-border shadow-card" : "bg-white border-stone-200 shadow-xs"
            )}>
              <div className={clsx(
                "w-10 h-10 rounded-xl border flex items-center justify-center font-bold",
                isIvory ? "bg-[#FBF2F3] border-[#E8C8CC] text-[#7D1826]" : isDark ? "bg-brand/15 border-brand/30 text-indigo-400" : "bg-stone-100 border-stone-300 text-stone-800"
              )}>
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className={clsx("text-base font-bold", isIvory && "text-[#24060B]")}>Deterministic Currency Words</h3>
              <p className={clsx("text-xs leading-relaxed", isIvory ? "text-[#5C4A4D]" : "opacity-75")}>
                ₹1,85,42,000 is converted via algorithmic Indian numbering into exact legal text without LLM guessing.
              </p>
              <div className={clsx(
                "p-2.5 rounded-lg font-mono text-[10px] border",
                isIvory ? "bg-[#FAF7F2] border-[#DECFC0] text-[#7D1826] font-semibold" : isDark ? "bg-surface-muted border-border text-emerald-400" : "bg-stone-50 border-stone-200 text-emerald-800"
              )}>
                Rupees One Crore Eighty-Five Lakhs Forty-Two Thousand Only.
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className={clsx(
              "rounded-2xl p-6 border space-y-3 spring-snap",
              isIvory ? "glossy-card border-[#E8DFD3]" : isDark ? "surface-card border-border shadow-card" : "bg-white border-stone-200 shadow-xs"
            )}>
              <div className={clsx(
                "w-10 h-10 rounded-xl border flex items-center justify-center font-bold",
                isIvory ? "bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]" : isDark ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-800"
              )}>
                <Lock className="w-5 h-5" />
              </div>
              <h3 className={clsx("text-base font-bold", isIvory && "text-[#24060B]")}>Atomic Concurrency Lock</h3>
              <p className={clsx("text-xs leading-relaxed", isIvory ? "text-[#5C4A4D]" : "opacity-75")}>
                PostgreSQL row locks prevent race conditions when 10 sales reps close bookings on token launch day.
              </p>
              <div className={clsx(
                "p-2.5 rounded-lg font-mono text-[10px] border",
                isIvory ? "bg-[#FAF7F2] border-[#DECFC0] text-[#24060B]" : isDark ? "bg-surface-muted border-border text-indigo-300" : "bg-stone-50 border-stone-200 text-stone-800"
              )}>
                SELECT * FROM parking_slots FOR UPDATE;
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className={clsx(
              "rounded-2xl p-6 border space-y-3 spring-snap",
              isIvory ? "glossy-card border-[#E8DFD3]" : isDark ? "surface-card border-border shadow-card" : "bg-white border-stone-200 shadow-xs"
            )}>
              <div className={clsx(
                "w-10 h-10 rounded-xl border flex items-center justify-center font-bold",
                isIvory ? "bg-[#FBF2F3] border-[#E8C8CC] text-[#7D1826]" : isDark ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" : "bg-stone-100 border-stone-300 text-stone-800"
              )}>
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className={clsx("text-base font-bold", isIvory && "text-[#24060B]")}>Preflight Linter &amp; docxtemplater</h3>
              <p className={clsx("text-xs leading-relaxed", isIvory ? "text-[#5C4A4D]" : "opacity-75")}>
                Preserves builder corporate letterhead, margins, and watermarks while verifying all 22 required tags.
              </p>
              <div className={clsx(
                "p-2.5 rounded-lg font-mono text-[10px] border",
                isIvory ? "bg-[#FAF7F2] border-[#DECFC0] text-[#5C4A4D]" : isDark ? "bg-surface-muted border-border opacity-75" : "bg-stone-50 border-stone-200 opacity-75"
              )}>
                Zero formatting degradation (.docx + .pdf)
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className={clsx(
              "rounded-2xl p-6 border space-y-3 spring-snap",
              isIvory ? "glossy-card border-[#E8DFD3]" : isDark ? "surface-card border-border shadow-card" : "bg-white border-stone-200 shadow-xs"
            )}>
              <div className={clsx(
                "w-10 h-10 rounded-xl border flex items-center justify-center font-bold",
                isIvory ? "bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]" : isDark ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-300 text-amber-800"
              )}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className={clsx("text-base font-bold", isIvory && "text-[#24060B]")}>Zero PII Storage</h3>
              <p className={clsx("text-xs leading-relaxed", isIvory ? "text-[#5C4A4D]" : "opacity-75")}>
                ID images are evaluated in-memory and wiped from RAM. First 8 Aadhaar digits are permanently masked.
              </p>
              <div className={clsx(
                "p-2.5 rounded-lg font-mono text-[10px] border",
                isIvory ? "bg-[#F7F1E6] border-[#DFD1B8] text-[#8C6D2D]" : isDark ? "bg-surface-muted border-border text-amber-300" : "bg-stone-50 border-stone-200 text-amber-900"
              )}>
                UIDAI Circular 2018/02 Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Simulator Section */}
      <section id="roi" className={clsx("py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t relative z-10", isIvory ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-300")}>
        <RoiCalculator />
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className={clsx("py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t relative z-10", isIvory ? "border-[#E8DFD3]" : isDark ? "border-border" : "border-stone-300")}>
        <FaqAccordion />
      </section>

      {/* High-Craft Footer */}
      <footer className={clsx(
        "border-t py-12 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors",
        isIvory && "border-[#DECFC0] bg-[#F4ECE3]",
        isDark && "border-white/10 bg-[#070809]",
        isLuxury && "border-stone-300 bg-[#F5F5F3]"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
              isIvory ? "bg-[#4A0E17] text-[#E5C178] border border-[#6B1B26]" : isDark ? "bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-indigo-400" : "bg-stone-900 text-white"
            )}>
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className={clsx("text-sm font-bold", isIvory && "text-[#24060B]")}>DeedFlow</span>
              <span className="text-[10px] font-mono opacity-60 block -mt-0.5">
                © 2026 DeedFlow Systems • Bengaluru, Karnataka
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs opacity-75">
            <Link href="/dashboard" className="hover:opacity-100">
              Dashboard
            </Link>
            <Link href="/dashboard/parking" className="hover:opacity-100">
              Basement Grid
            </Link>
            <Link href="/dashboard/generate" className="hover:opacity-100">
              Bank Kit Studio
            </Link>
            <a href="/templates/car-parking-allotment.docx" download className="hover:opacity-100">
              Sample .DOCX
            </a>
          </div>

          <div className={clsx(
            "text-[10px] font-mono flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border",
            isIvory ? "glossy-pill border-[#E8C8CC] text-[#7D1826]" : isDark ? "bg-surface border-border text-emerald-400" : "bg-white border-stone-300 text-emerald-800"
          )}>
            <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", isIvory ? "bg-[#7D1826]" : "bg-emerald-600")} />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
