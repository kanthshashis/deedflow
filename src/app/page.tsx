"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  FileCheck2,
  ShieldCheck,
  Car,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Compass,
  Download,
  DollarSign,
  FileText,
} from "lucide-react";
import clsx from "clsx";
import { InteractiveStudioMockup } from "@/components/mockup/InteractiveStudioMockup";
import { ArchitecturalBlueprintGrid } from "@/components/mockup/ArchitecturalBlueprintGrid";
import { IsometricGarage3D } from "@/components/canvas/IsometricGarage3D";
import { LaserDocScannerHUD } from "@/components/canvas/LaserDocScannerHUD";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { ClerkVsDeedflowComparison } from "@/components/landing/ClerkVsDeedflowComparison";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

type ShowcaseTab = "studio" | "cad" | "3d" | "laser";

export default function LandingPage() {
  const [activeShowcase, setActiveShowcase] = useState<ShowcaseTab>("studio");

  return (
    <div className="min-h-screen relative font-sans theme-ivory bg-[#FAF7F2] text-[#24060B] selection:bg-[#821A2A] selection:text-white">
      {/* Dynamic Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[650px] pointer-events-none ambient-glow-ivory opacity-95" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-60" />

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo Consistent with App */}
          <Logo href="/" size="md" />

          {/* Navigation Anchors */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-[#5C4A4D]">
            <a href="#showcase" className="hover:text-[#821A2A] transition-colors">
              Live Studio
            </a>
            <a href="#matrix" className="hover:text-[#821A2A] transition-colors">
              Workflow Friction
            </a>
            <a href="#capabilities" className="hover:text-[#821A2A] transition-colors">
              Institutional Specs
            </a>
            <a href="#roi" className="hover:text-[#821A2A] transition-colors">
              ROI Simulator
            </a>
            <a href="#faq" className="hover:text-[#821A2A] transition-colors">
              FAQ
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border glossy-pill text-[#821A2A] border-[#DECFC0] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#821A2A] animate-pulse" />
              <span>Launch Partner: Free Beta</span>
            </div>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 spring-snap cursor-pointer glossy-btn-burgundy text-[#FAF7F2]"
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-2xs glossy-pill border-[#DECFC0] text-[#821A2A]">
            <span className="w-2 h-2 rounded-full bg-[#821A2A] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
              Royal Title Assurance • RERA Section 11 &amp; 17 Standard
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.08] text-[#24060B]">
            Automate Post-Sales Legal Dossiers. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#821A2A] via-[#B88E3E] to-[#6E1220]">
              Accelerate Home Loan Disbursements.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-[#5C4A4D]">
            Zero clerical typos in words. Lock basement parking bays without dual-allotments. Deliver 100% first-pass bank-ready home loan NOCs for SBI, HDFC, and ICICI in 12 seconds.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 spring-snap cursor-pointer glossy-btn-burgundy text-[#FAF7F2]"
            >
              <Zap className="w-4 h-4 text-[#E5C178]" />
              <span>Launch Live Workstation</span>
            </Link>

            <a
              href="/templates/car-parking-allotment.docx"
              download
              className="w-full sm:w-auto px-6 py-3.5 border font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 spring-snap cursor-pointer glossy-btn-ivory text-[#821A2A] hover:border-[#821A2A]/40 transition-colors"
            >
              <Download className="w-4 h-4 text-[#821A2A]" />
              <span>Download Sample Bank Kit (.docx)</span>
            </a>
          </div>

          {/* Trust Ticker Row */}
          <div className="pt-8 border-t border-[#E8DFD3] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#24060B]">₹2,400+ Cr</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">Asset Inventory Tracked</div>
            </div>
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#821A2A]">12 Seconds</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">Average Bank Kit Creation</div>
            </div>
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#B88E3E]">0 Disputes</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">Parking Bay Double-Allotment</div>
            </div>
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#24060B]">100% RERA</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">&amp; UIDAI Circular Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Showcase Hub */}
      <section id="showcase" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="space-y-6">
          {/* Header & Stage Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DFD3] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center space-x-1.5 text-[#821A2A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Software Sandbox</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24060B]">
                Experience DeedFlow Live Above The Fold
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4A4D]">
                Toggle through all 4 proprietary engines. Real data, real deterministic rendering, zero mockups.
              </p>
            </div>

            {/* Showcase Stage Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-[#DECFC0] bg-[#FFFDFB] shadow-2xs">
              <button
                onClick={() => setActiveShowcase("studio")}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium spring-snap transition-all flex items-center space-x-1.5 cursor-pointer",
                  activeShowcase === "studio"
                    ? "bg-[#821A2A] text-white font-bold shadow-xs border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
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
                    ? "bg-[#821A2A] text-white font-bold shadow-xs border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
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
                    ? "bg-[#821A2A] text-white font-bold shadow-xs border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
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
                    ? "bg-[#821A2A] text-white font-bold shadow-xs border border-[#821A2A]"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC]"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Laser KYC OCR HUD</span>
              </button>
            </div>
          </div>

          {/* Active Interactive Stage */}
          <div className="pt-2 animate-fade-in">
            {activeShowcase === "studio" && <InteractiveStudioMockup theme="stripe" />}
            {activeShowcase === "cad" && <ArchitecturalBlueprintGrid theme="stripe" />}
            {activeShowcase === "3d" && <IsometricGarage3D />}
            {activeShowcase === "laser" && <LaserDocScannerHUD />}
          </div>
        </div>
      </section>

      {/* Comparison: The Clerk Friction vs. DeedFlow */}
      <section id="matrix" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <ClerkVsDeedflowComparison />
      </section>

      {/* Bento Grid: 4 Core Capabilities */}
      <section id="capabilities" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#821A2A]">
              Proprietary Reliability Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24060B]">
              Engineered for Institutional Developers &amp; Banks
            </h2>
            <p className="text-xs sm:text-sm max-w-xl mx-auto text-[#5C4A4D]">
              Built with mathematical guarantees, zero hallucinated numbers, and total UIDAI compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Bento Card 1 */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0]">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#FBF2F3] border-[#DECFC0] text-[#821A2A]">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Deterministic Currency Words</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                ₹1,85,42,000 is converted via algorithmic Indian numbering into exact legal text without LLM guessing.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#821A2A] font-semibold">
                Rupees One Crore Eighty-Five Lakhs Forty-Two Thousand Only.
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0]">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Atomic Concurrency Lock</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                PostgreSQL row locks prevent race conditions when 10 sales reps close bookings on token launch day.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#24060B]">
                SELECT * FROM parking_slots FOR UPDATE;
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0]">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#FBF2F3] border-[#DECFC0] text-[#821A2A]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Preflight Linter &amp; docxtemplater</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Preserves builder corporate letterhead, margins, and watermarks while verifying all 22 required tags.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#5C4A4D]">
                Zero formatting degradation (.docx + .pdf)
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0]">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Zero PII Storage</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                ID images are evaluated in-memory and wiped from RAM. First 8 Aadhaar digits are permanently masked.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#F7F1E6] border-[#DFD1B8] text-[#8C6D2D]">
                UIDAI Circular 2018/02 Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Simulator Section */}
      <section id="roi" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <RoiCalculator />
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <FaqAccordion />
      </section>

      {/* High-Craft Footer */}
      <footer className="border-t border-[#DECFC0] bg-[#F4ECE3] py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Logo href="/" size="sm" />
            <span className="text-[10px] font-mono text-[#8C777A] block sm:border-l sm:border-[#DECFC0] sm:pl-4">
              © 2026 DeedFlow Systems • Bengaluru, Karnataka
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-[#5C4A4D]">
            <Link href="/dashboard" className="hover:text-[#821A2A] transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/parking" className="hover:text-[#821A2A] transition-colors">
              Basement Grid
            </Link>
            <Link href="/dashboard/draft/new" className="hover:text-[#821A2A] transition-colors">
              Verification Studio
            </Link>
            <a href="/templates/car-parking-allotment.docx" download className="hover:text-[#821A2A] transition-colors">
              Sample .DOCX
            </a>
          </div>

          <div className="text-[10px] font-mono flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border glossy-pill border-[#DECFC0] text-[#821A2A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#821A2A] animate-pulse" />
            <span className="font-semibold">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
