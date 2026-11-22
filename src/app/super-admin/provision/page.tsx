"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlusCircle, Building2, Layers, Car, Key, Copy, CheckCircle2, Share2, Sparkles, ArrowRight } from "lucide-react";

export default function ProvisionMatrixPage() {
  // Project Details
  const [developerName, setDeveloperName] = useState("Prestige Estates Projects Ltd");
  const [projectName, setProjectName] = useState("Prestige Falcon City - Phase 3");
  const [reraNumber, setReraNumber] = useState("PRM/KA/RERA/1251/310/PR/2026/009182");
  const [location, setLocation] = useState("Kanakapura Road, Bengaluru");

  // Structural Matrix
  const [towers, setTowers] = useState("A, B");
  const [floorsPerTower, setFloorsPerTower] = useState(5);
  const [flatsPerFloor, setFlatsPerFloor] = useState(4);
  const [carpetArea, setCarpetArea] = useState(1150);
  const [sbaArea, setSbaArea] = useState(1620);
  const [udsArea, setUdsArea] = useState(485.5);
  const [basePrice, setBasePrice] = useState(14500000);

  // Parking Matrix
  const [basementLevels, setBasementLevels] = useState<"B1" | "B1, B2">("B1, B2");
  const [slotsPerBasement, setSlotsPerBasement] = useState(20);

  // Admin Credentials
  const [adminName, setAdminName] = useState("Vikram Malhotra");
  const [adminEmail, setAdminEmail] = useState("vikram.m@prestigeconstructions.com");
  const [adminPassword, setAdminPassword] = useState("Prestige@2026!Deed");

  // Output State
  const [isProvisioned, setIsProvisioned] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Calculations
  const towerList = towers.split(",").map((t) => t.trim()).filter(Boolean);
  const totalFlats = towerList.length * floorsPerTower * flatsPerFloor;
  const totalSlots = (basementLevels === "B1, B2" ? 2 : 1) * slotsPerBasement;

  const handleGenerateMatrix = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioned(true);
  };

  const whatsappMessage = `*DeedFlow Builder Workspace Credentials*\n\n` +
    `Hello ${adminName},\n` +
    `Your DeedFlow workspace for *${projectName}* is now live.\n\n` +
    `*Login Portal:* http://localhost:3000/login\n` +
    `*Admin Email:* ${adminEmail}\n` +
    `*Password:* ${adminPassword}\n` +
    `*Role:* Project Admin\n\n` +
    `*Provisioned Matrix:*\n` +
    `• Towers: ${towers} (${totalFlats} Flats)\n` +
    `• Basement Parking: ${totalSlots} Bays (${basementLevels})\n\n` +
    `Please log in to review your master flat schedule and approve post-sales change requests.`;

  const copyForWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <Link href="/super-admin" className="text-xs text-[#8C777A] hover:text-[#821A2A] font-semibold transition-colors">
          ← Back to Project Portfolio
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-2">
          1-Click Project &amp; Matrix Provisioning
        </h1>
        <p className="text-xs text-[#5C4A4D] mt-1">
          Automate the generation of hundreds of flats, basement parking bays, and secure Project Admin credentials in a single step.
        </p>
      </div>

      <form onSubmit={handleGenerateMatrix} className="space-y-6">
        {/* Step 1: Project Metadata */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826] border-b border-[#F0E8DD] pb-3">
            <Building2 className="w-4 h-4 text-[#7D1826]" />
            <span>1. Developer &amp; Project Entity Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Developer Legal Entity Name</label>
              <input
                type="text"
                required
                value={developerName}
                onChange={(e) => setDeveloperName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Project Commercial Name</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">RERA Registration Number</label>
              <input
                type="text"
                required
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Location &amp; Taluk</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Structural Flat Schedule Matrix */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826] border-b border-[#F0E8DD] pb-3">
            <Layers className="w-4 h-4 text-[#B88E3E]" />
            <span>2. Structural Tower &amp; Flat Schedule Matrix</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Towers (Comma-separated)</label>
              <input
                type="text"
                value={towers}
                onChange={(e) => setTowers(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
                placeholder="A, B, C"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Floors per Tower</label>
              <input
                type="number"
                min={1}
                max={50}
                value={floorsPerTower}
                onChange={(e) => setFloorsPerTower(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Flats per Floor</label>
              <input
                type="number"
                min={1}
                max={12}
                value={flatsPerFloor}
                onChange={(e) => setFlatsPerFloor(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3]">
              <span className="text-[10px] text-[#8C777A] block uppercase font-mono">Default Carpet</span>
              <span className="font-bold text-[#24060B] font-mono text-sm">{carpetArea} sq.ft</span>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3]">
              <span className="text-[10px] text-[#8C777A] block uppercase font-mono">Default SBA</span>
              <span className="font-bold text-[#24060B] font-mono text-sm">{sbaArea} sq.ft</span>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3]">
              <span className="text-[10px] text-[#8C777A] block uppercase font-mono">Default UDS</span>
              <span className="font-bold text-[#24060B] font-mono text-sm">{udsArea} sq.ft</span>
            </div>
            <div className="p-3 bg-[#FFF9EE] rounded-xl border border-[#F2E4C4]">
              <span className="text-[10px] text-[#B88E3E] block uppercase font-mono">Generated Flats</span>
              <span className="font-bold text-[#24060B] font-mono text-sm">{totalFlats} Units</span>
            </div>
          </div>
        </div>

        {/* Step 3: Basement Parking Configuration */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826] border-b border-[#F0E8DD] pb-3">
            <Car className="w-4 h-4 text-[#B88E3E]" />
            <span>3. Basement Parking Matrix &amp; EV Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Basement Levels</label>
              <select
                value={basementLevels}
                onChange={(e) => setBasementLevels(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              >
                <option value="B1">Basement 1 Only (Upper)</option>
                <option value="B1, B2">Basement 1 &amp; Basement 2 (Dual Levels)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Slots per Basement Level</label>
              <input
                type="number"
                min={5}
                max={100}
                value={slotsPerBasement}
                onChange={(e) => setSlotsPerBasement(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3] text-xs text-[#5C4A4D] flex items-center justify-between">
            <span>
              Total Bays to Provision: <strong className="font-mono text-[#24060B]">{totalSlots} Bays</strong> (Every 5th slot automatically tagged as <em>Covered EV-Ready</em>)
            </span>
          </div>
        </div>

        {/* Step 4: Project Admin Credentials */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826] border-b border-[#F0E8DD] pb-3">
            <Key className="w-4 h-4 text-[#7D1826]" />
            <span>4. Project Admin Credential Provisioning</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Project Admin Full Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Admin Corporate Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">One-Time Password</label>
              <input
                type="text"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white glossy-btn-burgundy hover:brightness-105 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D4B989]" />
          <span>Generate Full Project &amp; Matrix ({totalFlats} Flats + {totalSlots} Bays)</span>
        </button>
      </form>

      {/* Output Handover Card on Provision */}
      {isProvisioned && (
        <div className="glossy-card bg-[#FFFDFB] border border-[#B88E3E]/60 p-6 sm:p-8 rounded-2xl shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#821A2A] text-[#D4B989] flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-[#24060B]">
                  Project Workspace &amp; Matrix Successfully Provisioned!
                </h3>
                <p className="text-xs text-[#5C4A4D]">
                  {projectName} is now active with {totalFlats} units and {totalSlots} parking slots.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF9EE] border border-[#F2E4C4] text-[#B88E3E] font-mono">
              Ready for Handover
            </span>
          </div>

          {/* Credential WhatsApp Copy Box */}
          <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B] uppercase font-mono">
                Project Admin WhatsApp Handover Card
              </span>
              <span className="text-[11px] text-[#8C777A] font-mono">1-Click Format</span>
            </div>

            <pre className="p-4 rounded-lg bg-[#1A0508] text-[#FAF7F2] border border-[#34070E] font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
              {whatsappMessage}
            </pre>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={copyForWhatsApp}
                className="w-full sm:w-auto px-4 py-2.5 glossy-btn-burgundy hover:brightness-105 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-colors"
              >
                {copiedWhatsApp ? <CheckCircle2 className="w-4 h-4 text-[#D4B989]" /> : <Copy className="w-4 h-4 text-[#D4B989]" />}
                <span>{copiedWhatsApp ? "Copied to Clipboard!" : "Copy Credentials for WhatsApp"}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 glossy-btn-ivory text-[#24060B] border-[#DECFC0] text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span>Open WhatsApp Direct Share</span>
              </a>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto sm:ml-auto px-4 py-2.5 bg-[#28070D] hover:bg-[#34070E] border border-[#3E0C14] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Open Workspace Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4B989]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
