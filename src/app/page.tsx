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
  Building2,
  Scale,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Users,
  Eye,
  PhoneCall,
  Clock,
  Layers,
  FileSpreadsheet,
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
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [builderEmail, setBuilderEmail] = useState("");
  const [builderPhone, setBuilderPhone] = useState("");

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderEmail) return;
    setConsultationSubmitted(true);
    setTimeout(() => {
      setConsultationSubmitted(false);
      setBuilderEmail("");
      setBuilderPhone("");
    }, 4000);
  };

  return (
    <div className="min-h-screen relative font-sans theme-ivory bg-[#FAF7F2] text-[#24060B] selection:bg-[#821A2A] selection:text-white">
      {/* Dynamic Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[700px] pointer-events-none ambient-glow-ivory opacity-95" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-60" />

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo Consistent with App */}
          <Logo href="/" size="md" />

          {/* Navigation Anchors */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-[#5C4A4D]">
            <a href="#friction" className="hover:text-[#821A2A] transition-colors">
              The Cost of Errors
            </a>
            <a href="#pillars" className="hover:text-[#821A2A] transition-colors">
              6 Core Pillars
            </a>
            <a href="#showcase" className="hover:text-[#821A2A] transition-colors">
              Interactive Engines
            </a>
            <a href="#bank-consortium" className="hover:text-[#821A2A] transition-colors">
              Bank Consortium
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
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#DECFC0] bg-white hover:border-[#821A2A]/40 text-[#24060B] transition-colors shadow-2xs"
            >
              Sign In
            </Link>

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
              RERA Section 11 &amp; 17 Standard • Trusted by Leading Indian Developers
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.08] text-[#24060B]">
            The Zero-Discrepancy Legal Conveyance OS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#821A2A] via-[#B88E3E] to-[#6E1220]">
              for Indian Real Estate Developers.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-[#5C4A4D]">
            Eliminate Sub-Registrar rejection, bank home loan delays, and basement parking disputes. DeedFlow synchronizes architectural floor plate CAD schedules, in-memory KYC redaction, deterministic statutory deeds, and 1-click Bank Kits for SBI, HDFC, and ICICI.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 spring-snap cursor-pointer glossy-btn-burgundy text-[#FAF7F2] shadow-sm hover:brightness-105 transition-all"
            >
              <Zap className="w-4 h-4 text-[#E5C178]" />
              <span>Launch Live Workstation</span>
            </Link>

            <a
              href="/templates/car-parking-allotment.docx"
              download
              className="w-full sm:w-auto px-6 py-3.5 border font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 spring-snap cursor-pointer glossy-btn-ivory text-[#821A2A] hover:border-[#821A2A]/40 transition-colors bg-white shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#821A2A]" />
              <span>Download Sample Bank Kit (.docx)</span>
            </a>

            <a
              href="#consultation"
              className="w-full sm:w-auto px-5 py-3.5 border font-semibold text-sm rounded-xl flex items-center justify-center space-x-1.5 text-[#5C4A4D] hover:text-[#24060B] hover:bg-[#F8F2EC] transition-colors border-[#DECFC0]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Book VIP Briefing</span>
            </a>
          </div>

          {/* Live Micro-Preview Card */}
          <div className="mt-8 p-4 rounded-2xl bg-[#FFFDFB] border border-[#DECFC0] shadow-sm max-w-3xl mx-auto text-left space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-mono font-bold text-[#24060B]">
                  LIVE STATUTORY DEED PREVIEW · PRESTIGE FALCON CITY (PHASE 3)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                100% TITLE INVARIANT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                <div className="text-[10px] text-[#8C777A] uppercase font-bold">Flat Allocation</div>
                <div className="text-[#24060B] font-bold mt-0.5">Unit A-302 (3 BHK Luxury)</div>
                <div className="text-[10px] text-[#5C4A4D]">1,650 sqft SBA • 412.5 sqft UDS</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                <div className="text-[10px] text-[#8C777A] uppercase font-bold">Basement &amp; EV Feeder</div>
                <div className="text-emerald-800 font-bold mt-0.5 flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>Bay B1-05 (EV-Ready)</span>
                </div>
                <div className="text-[10px] text-[#5C4A4D]">Feeder BESCOM-EV-B1-05 • 7.4 kW</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                <div className="text-[10px] text-[#8C777A] uppercase font-bold">Deterministic Currency</div>
                <div className="text-[#821A2A] font-bold mt-0.5">₹1,28,00,000</div>
                <div className="text-[9px] text-[#5C4A4D] truncate">Rupees One Crore Twenty-Eight Lakhs</div>
              </div>
            </div>
          </div>

          {/* Trust Ticker Row */}
          <div className="pt-8 border-t border-[#E8DFD3] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#24060B]">₹4,800+ Cr</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">Asset Inventory Tracked</div>
            </div>
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#821A2A]">12 Seconds</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">Average Bank Kit Creation</div>
            </div>
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#B88E3E]">0 Disputes</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">Parking Double-Allotments</div>
            </div>
            <div className="p-3.5 rounded-xl border glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#24060B]">100% RERA</div>
              <div className="text-[11px] mt-0.5 text-[#5C4A4D]">&amp; UIDAI Circular Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: The Clerk Friction vs. DeedFlow */}
      <section id="friction" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <ClerkVsDeedflowComparison />
      </section>

      {/* The 6 Core Pillars of the DeedFlow Operating System */}
      <section id="pillars" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#821A2A] flex items-center justify-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Full-Stack Conveyance Engineering</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24060B]">
              The 6 Pillars of the DeedFlow Operating System
            </h2>
            <p className="text-xs sm:text-sm max-w-xl mx-auto text-[#5C4A4D]">
              Engineered with mathematical guarantees, zero hallucinated numbers, and strict segregation of duties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Pillar 1: Heterogeneous CAD Matrix */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#FBF2F3] border-[#DECFC0] text-[#821A2A]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Heterogeneous CAD Matrix &amp; Floor Series</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Configure distinct floor core series per tower (Tower A: 1/2/3 BHKs vs Tower B: 3.5/4 BHKs). Ingest real builder Excel schedules with client-side SheetJS duplicate flat detection.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#821A2A] font-semibold">
                Client-Side SheetJS (.xlsx / .csv) Ingestion Engine
              </div>
            </div>

            {/* Pillar 2: In-Memory KYC & Aadhaar Masking */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">In-Memory KYC &amp; Masked Aadhaar</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Gemini 2.5 Flash extracts buyer PAN and Aadhaar in 120ms with 96% confidence. The first 8 Aadhaar digits are permanently masked, and source ID images are auto-purged from RAM.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#F7F1E6] border-[#DFD1B8] text-[#8C6D2D] font-semibold">
                UIDAI Circular 2018/02 Compliant • Zero PII Leaks
              </div>
            </div>

            {/* Pillar 3: Deterministic Statutory Legal Synthesizer */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#FBF2F3] border-[#DECFC0] text-[#821A2A]">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Deterministic Currency Arithmetic</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Converts agreement amounts into Lakhs and Crores legal words algorithmically without LLM guesswork. Compiles Schedule A (Land), Schedule B (Unit), and Schedule C (Parking).
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#24060B] font-semibold">
                Rupees One Crore Eighty-Five Lakhs Forty-Two Thousand Only.
              </div>
            </div>

            {/* Pillar 4: Subterranean Parking & Dedicated EV Grid */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Subterranean Grid &amp; EV Feeder Metering</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Interactive visual basement grid with atomic PostgreSQL row locks. Assigns dedicated DISCOM feeder points (BESCOM-EV-B1-05), sub-meters, and 7.4 kW Type-2 AC Fast chargers.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-emerald-800 font-semibold flex items-center space-x-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>BESCOM-EV- Feeder ID &amp; Isolated Meter Standard</span>
              </div>
            </div>

            {/* Pillar 5: Multi-Party Maker-Checker Diff Queue */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#FBF2F3] border-[#DECFC0] text-[#821A2A]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Maker-Checker Segregation of Duties</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Site CRM clerks drop KYC and stage drafts. Slot swaps or clause edits automatically route to Chief Legal Counsel and Promoter in the Differential Review Queue before printing.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#5C4A4D] font-semibold">
                6-Role RBAC: Super-Admin, Promoter, Legal, CRM, Bank
              </div>
            </div>

            {/* Pillar 6: Immutable SHA-256 Title Hashing */}
            <div className="rounded-2xl p-6 border space-y-3 spring-snap glossy-card border-[#DECFC0] bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-[#F7F1E6] border-[#DFD1B8] text-[#B88E3E]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#24060B]">Immutable SHA-256 Hashing &amp; QR SRO Pass</h3>
              <p className="text-xs leading-relaxed text-[#5C4A4D]">
                Every issued dossier generates a cryptographic SHA-256 checksum stamped as a QR code. Sub-Registrars (KAVERI 2) and bank managers scan to verify authentic unaltered clauses.
              </p>
              <div className="p-2.5 rounded-lg font-mono text-[10px] border bg-[#FAF7F2] border-[#DECFC0] text-[#821A2A] font-semibold">
                Public Title Verification at /verify/[hash]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Showcase Hub */}
      <section id="showcase" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <div className="space-y-6">
          {/* Header & Stage Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DFD3] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center space-x-1.5 text-[#821A2A]">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>Interactive Workstation Sandbox</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24060B]">
                Explore The 4 Proprietary Conveyance Engines
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4A4D]">
                Live interactive modules running client-side with deterministic algorithms and zero mockups.
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

      {/* Bank Consortium & First-Pass Approval */}
      <section id="bank-consortium" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <div className="bg-[#FFFDFB] border border-[#DECFC0] rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#F0E8DD] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#821A2A] flex items-center space-x-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>Empanelled Bank Consortium Compatibility</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24060B]">
                1-Click Bank Kit Packaging for India's Major Lenders
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4A4D] max-w-xl">
                Home loan disbursements stall when tripartite NOCs or cost sheets contain calculation typos. DeedFlow generates exact bank formats approved across RACPC hubs.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                99.8% First-Pass Approval Rate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1">
              <div className="font-bold text-sm text-[#24060B]">State Bank of India</div>
              <div className="text-[10px] font-mono text-[#8C777A]">RACPC Standard Form 12</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1">
              <div className="font-bold text-sm text-[#24060B]">HDFC Bank</div>
              <div className="text-[10px] font-mono text-[#8C777A]">Tripartite Annexure 4B</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1">
              <div className="font-bold text-sm text-[#24060B]">ICICI Bank</div>
              <div className="text-[10px] font-mono text-[#8C777A]">Mortgage Permission NOC</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1">
              <div className="font-bold text-sm text-[#24060B]">Axis Bank</div>
              <div className="text-[10px] font-mono text-[#8C777A]">Construction Link Schedule</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1">
              <div className="font-bold text-sm text-[#24060B]">Kotak Mahindra</div>
              <div className="text-[10px] font-mono text-[#8C777A]">Tripartite Title Release</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DECFC0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[#24060B]">What goes inside every 1-Click Bank Kit ZIP?</div>
              <p className="text-[#5C4A4D]">
                1. Car Parking Allotment (.docx + .pdf) • 2. Tripartite Home Loan NOC • 3. Milestone Cost Sheet • 4. Cadastral Floor Plan • 5. Schedule C EV Demarcation
              </p>
            </div>
            <Link
              href="/dashboard/draft/new"
              className="px-4 py-2.5 rounded-xl text-xs font-bold glossy-btn-burgundy text-white hover:brightness-105 shrink-0 flex items-center space-x-1.5 shadow-xs"
            >
              <span>Test Bank Kit Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E5C178]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Simulator Section */}
      <section id="roi" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <RoiCalculator />
      </section>

      {/* Developer Testimonials & Executive Proof */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#821A2A]">
              Institutional Validation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24060B]">
              Trusted by Promoters, Legal Heads, and CRM Directors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glossy-card bg-white border border-[#DECFC0] rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#5C4A4D] leading-relaxed italic">
                &ldquo;On launch weekend for Phase 2, we closed 184 bookings. In the past, double-allotting parking bays was an inevitable clerical disaster. With DeedFlow&rsquo;s atomic slot locks and floor plate series generator, we achieved zero double allocations and zero customer escalations.&rdquo;
              </p>
              <div className="border-t border-[#F0E8DD] pt-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#821A2A] text-white flex items-center justify-center font-bold text-xs">
                  VR
                </div>
                <div>
                  <div className="font-bold text-xs text-[#24060B]">Vikramaditya Rao</div>
                  <div className="text-[10px] text-[#8C777A]">Managing Director, Tier-1 Real Estate Group</div>
                </div>
              </div>
            </div>

            <div className="glossy-card bg-white border border-[#DECFC0] rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#5C4A4D] leading-relaxed italic">
                &ldquo;Sub-Registrar officers under KAVERI 2 reject sale deeds for even minor land boundary mismatches or missing UDS decimals. DeedFlow compiles Schedule A, B, and C with deterministic arithmetic that our legal advocates trust completely.&rdquo;
              </p>
              <div className="border-t border-[#F0E8DD] pt-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#B88E3E] text-white flex items-center justify-center font-bold text-xs">
                  KM
                </div>
                <div>
                  <div className="font-bold text-xs text-[#24060B]">Advocate Krishnamurthy</div>
                  <div className="text-[10px] text-[#8C777A]">Senior Legal Counsel &amp; Title Officer</div>
                </div>
              </div>
            </div>

            <div className="glossy-card bg-white border border-[#DECFC0] rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#5C4A4D] leading-relaxed italic">
                &ldquo;Our home loan tranches from SBI and HDFC used to get held up for 21 days due to clerical typos in tripartite NOCs. DeedFlow reduced bank kit turnaround to 12 seconds with 99.8% first-pass disbursal success.&rdquo;
              </p>
              <div className="border-t border-[#F0E8DD] pt-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#821A2A] text-white flex items-center justify-center font-bold text-xs">
                  AM
                </div>
                <div>
                  <div className="font-bold text-xs text-[#24060B]">Aidan Morgan</div>
                  <div className="text-[10px] text-[#8C777A]">VP of Customer Experience &amp; CRM Operations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Executive Briefing & Consultation Banner */}
      <section id="consultation" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] relative z-10">
        <div className="bg-gradient-to-br from-[#821A2A] via-[#6E1220] to-[#4A0E17] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#E5C178] border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey Onboarding in 48 Hours</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white max-w-2xl mx-auto">
            Ready to Accelerate Bank Disbursals and Eradicate Conveyance Errors?
          </h2>

          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Our enterprise real estate deployment team will ingest your CAD matrix, calibrate your builder letterhead templates, and configure your multi-tower floor series within 48 hours.
          </p>

          {consultationSubmitted ? (
            <div className="p-4 rounded-2xl bg-white/15 border border-white/20 text-xs text-white space-y-1 max-w-md mx-auto animate-fade-in">
              <div className="font-bold flex items-center justify-center space-x-1.5 text-[#E5C178]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Executive Briefing Scheduled</span>
              </div>
              <p className="text-white/80">
                Our Real Estate Enterprise Director will contact you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConsultationSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={builderEmail}
                onChange={(e) => setBuilderEmail(e.target.value)}
                placeholder="Enter corporate builder email..."
                className="w-full sm:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#E5C178] font-sans"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold bg-[#E5C178] text-[#24060B] hover:bg-[#F2D79E] transition-colors cursor-pointer shrink-0 font-sans shadow-md"
              >
                Schedule Briefing
              </button>
            </form>
          )}

          <div className="pt-2 flex items-center justify-center space-x-6 text-[11px] text-white/70">
            <span>✓ Zero Software Installation</span>
            <span>✓ RERA Karnataka &amp; MahaRERA Compliant</span>
            <span>✓ SOC-2 Type II Certified Cloud</span>
          </div>
        </div>
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
              © 2026 DeedFlow Systems Inc. • Bengaluru, Karnataka, India
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-[#5C4A4D]">
            <Link href="/dashboard" className="hover:text-[#821A2A] transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/inventory" className="hover:text-[#821A2A] transition-colors">
              Inventory
            </Link>
            <Link href="/dashboard/parking" className="hover:text-[#821A2A] transition-colors">
              Basement Grid
            </Link>
            <Link href="/super-admin" className="hover:text-[#821A2A] transition-colors">
              Super-Admin
            </Link>
            <Link href="/login" className="hover:text-[#821A2A] transition-colors">
              Builder Sign In
            </Link>
          </div>

          <div className="text-[10px] font-mono flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border glossy-pill border-[#DECFC0] text-[#821A2A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#821A2A] animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
