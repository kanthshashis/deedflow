"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Building2,
  Layers,
  Car,
  Key,
  Copy,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Landmark,
  Eye,
  Sliders,
  Hash,
  Table as TableIcon,
  Check,
} from "lucide-react";
import { ProjectMetadata, MatrixConfig, UnitTypology } from "@/lib/types";
import {
  DEFAULT_TYPOLOGIES,
  saveStoredProject,
  generateMatrixInventory,
  setActiveProjectId,
  formatFlatNumber,
} from "@/lib/projectStore";
import { formatIndianCurrency } from "@/lib/indianCurrencyToWords";

export default function ProvisionMatrixPage() {
  const router = useRouter();

  // Step 1: Developer & Project Entity Details
  const [developerName, setDeveloperName] = useState("Prestige Estates Projects Ltd");
  const [projectName, setProjectName] = useState("Prestige Falcon City - Phase 3");
  const [companyCin, setCompanyCin] = useState("L07010KA1997PLC022397");
  const [reraNumber, setReraNumber] = useState("PRM/KA/RERA/1251/310/PR/2026/009182");
  const [sanctionPlanNo, setSanctionPlanNo] = useState("BDA/COMMR/PR/2026/0114");
  const [location, setLocation] = useState("Kanakapura Road, Anjanadri Layout, Bengaluru 560062");
  const [taluk, setTaluk] = useState("Bengaluru South");
  const [district, setDistrict] = useState("Bengaluru Urban");
  const [surveyNumbers, setSurveyNumbers] = useState("Sy. Nos. 14/1, 14/2 and 15/3P");

  // Schedule A Master Land Boundaries
  const [masterNorth, setMasterNorth] = useState("Existing 80ft Kanakapura Main Road");
  const [masterSouth, setMasterSouth] = useState("Private Property in Sy. No. 16");
  const [masterEast, setMasterEast] = useState("Survey Boundary & Green Belt Buffer");
  const [masterWest, setMasterWest] = useState("Residential Layout Access Road");

  // RERA Master Escrow Bank
  const [escrowBankName, setEscrowBankName] = useState("State Bank of India");
  const [escrowBranch, setEscrowBranch] = useState("Kanakapura Road Branch, Bengaluru");
  const [escrowAccountNo, setEscrowAccountNo] = useState("918020034827101");
  const [escrowIfsc, setEscrowIfsc] = useState("SBIN0004120");

  // Step 2: Structural Flat Schedule Matrix
  const [towers, setTowers] = useState("A, B");
  const [floorsPerTower, setFloorsPerTower] = useState(5);
  const [flatsPerFloor, setFlatsPerFloor] = useState(4);
  const [numberingScheme, setNumberingScheme] = useState<MatrixConfig["numberingScheme"]>("tower_floor_flat");
  const [typologies, setTypologies] = useState<UnitTypology[]>(DEFAULT_TYPOLOGIES);
  const [activePreviewTab, setActivePreviewTab] = useState<"summary" | "table">("summary");

  // Step 3: Parking Matrix
  const [basementLevels, setBasementLevels] = useState<"B1" | "B1, B2" | "B1, B2, B3">("B1, B2");
  const [slotsPerBasement, setSlotsPerBasement] = useState(20);
  const [evFrequency, setEvFrequency] = useState(5);

  // Step 4: Admin Credentials
  const [adminName, setAdminName] = useState("Vikram Malhotra");
  const [adminEmail, setAdminEmail] = useState("vikram.m@prestigeconstructions.com");
  const [adminPassword, setAdminPassword] = useState("Prestige@2026!Deed");

  // Output State
  const [isProvisioned, setIsProvisioned] = useState(false);
  const [provisionedProjectId, setProvisionedProjectId] = useState<string | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Calculations
  const towerList = useMemo(
    () => towers.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean),
    [towers]
  );
  const totalFlats = towerList.length * floorsPerTower * flatsPerFloor;
  const basementLevelCount = basementLevels === "B1, B2, B3" ? 3 : basementLevels === "B1, B2" ? 2 : 1;
  const totalSlots = basementLevelCount * slotsPerBasement;

  // Live Flat Preview (first 10 units for instant preview)
  const previewFlats = useMemo(() => {
    const list: Array<{ flatNo: string; tower: string; floor: number; type: string; sba: number; price: number }> = [];
    for (const t of towerList.slice(0, 2)) {
      for (let f = 1; f <= Math.min(floorsPerTower, 3); f++) {
        for (let idx = 1; idx <= flatsPerFloor; idx++) {
          const typ = typologies[(idx - 1) % typologies.length];
          list.push({
            flatNo: formatFlatNumber(t, f, idx, numberingScheme),
            tower: `Tower ${t}`,
            floor: f,
            type: typ.name,
            sba: typ.sbaSqft,
            price: typ.basePrice,
          });
        }
      }
    }
    return list;
  }, [towerList, floorsPerTower, flatsPerFloor, numberingScheme, typologies]);

  const handleTypologyChange = (id: string, field: keyof UnitTypology, value: any) => {
    setTypologies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleGenerateMatrix = (e: React.FormEvent) => {
    e.preventDefault();

    const projectId = `proj_${Date.now()}`;
    const levelArray = basementLevels.split(",").map((s) => s.trim());

    const matrixConfig: MatrixConfig = {
      towers: towerList,
      floorsPerTower,
      flatsPerFloor,
      numberingScheme,
      typologies,
      basementLevels: levelArray,
      slotsPerLevel: slotsPerBasement,
      evSlotFrequency: evFrequency,
    };

    const newProject: ProjectMetadata = {
      id: projectId,
      name: projectName,
      legalName: developerName,
      companyCin,
      reraNumber,
      sanctionPlanNo,
      location,
      taluk,
      district,
      surveyNumbers,
      totalUnits: totalFlats,
      totalParkingSlots: totalSlots,
      status: "active",
      masterNorth,
      masterSouth,
      masterEast,
      masterWest,
      escrowBankName,
      escrowBranch,
      escrowAccountNo,
      escrowIfsc,
      towers: towerList,
      floorsCount: floorsPerTower,
      adminName,
      adminEmail,
      createdAt: new Date().toISOString(),
    };

    // Generate and save inventory matrix
    generateMatrixInventory(newProject, matrixConfig);

    // Save project metadata to central store
    saveStoredProject(newProject);

    setProvisionedProjectId(projectId);
    setIsProvisioned(true);
  };

  const whatsappMessage =
    `*DeedFlow Builder Workspace Credentials*\n\n` +
    `Hello ${adminName},\n` +
    `Your DeedFlow workspace for *${projectName}* is now live.\n\n` +
    `*Login Portal:* http://localhost:3000/login\n` +
    `*Admin Email:* ${adminEmail}\n` +
    `*Password:* ${adminPassword}\n` +
    `*Role:* Project Admin\n\n` +
    `*Provisioned Matrix:*\n` +
    `• Towers: ${towerList.join(", ")} (${totalFlats} Flats)\n` +
    `• Basement Parking: ${totalSlots} Bays (${basementLevels})\n` +
    `• RERA Number: ${reraNumber}\n` +
    `• Master Escrow: ${escrowBankName} (A/C: ${escrowAccountNo})\n\n` +
    `Please log in to review your master flat schedule and approve post-sales change requests.`;

  const copyForWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleLaunchProvisioned = () => {
    if (provisionedProjectId) {
      setActiveProjectId(provisionedProjectId);
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <Link
          href="/super-admin"
          className="text-xs text-[#8C777A] hover:text-[#821A2A] font-semibold transition-colors flex items-center space-x-1"
        >
          <span>← Back to Project Portfolio</span>
        </Link>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-[#7D1826] uppercase mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B88E3E] animate-pulse" />
          <span>Enterprise Provisioning Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#24060B] tracking-tight mt-1">
          1-Click Project &amp; Matrix Provisioning
        </h1>
        <p className="text-xs text-[#5C4A4D] mt-1">
          Automate the generation of hundreds of flats, basement parking bays, and secure Project Admin credentials with custom typologies.
        </p>
      </div>

      <form onSubmit={handleGenerateMatrix} className="space-y-6">
        {/* Step 1: Project Metadata & Statutory Coordinates */}
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
              <label className="block font-semibold text-[#5C4A4D] mb-1">Sanction Plan Number (BBMP/BDA)</label>
              <input
                type="text"
                required
                value={sanctionPlanNo}
                onChange={(e) => setSanctionPlanNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Location &amp; Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">Taluk</label>
                <input
                  type="text"
                  required
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5C4A4D] mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
                />
              </div>
            </div>
          </div>

          {/* Schedule A Land & Escrow Bank Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0E8DD] text-xs">
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-2">
              <span className="font-bold text-[#821A2A] flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>Schedule A Master Land Demarcation</span>
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <label className="text-[#8C777A] text-[10px] block">North Boundary</label>
                  <input
                    type="text"
                    value={masterNorth}
                    onChange={(e) => setMasterNorth(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white rounded border border-[#DECFC0] text-[#24060B]"
                  />
                </div>
                <div>
                  <label className="text-[#8C777A] text-[10px] block">South Boundary</label>
                  <input
                    type="text"
                    value={masterSouth}
                    onChange={(e) => setMasterSouth(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white rounded border border-[#DECFC0] text-[#24060B]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF0F2] rounded-xl border border-[#E8C4C8] space-y-2">
              <span className="font-bold text-[#821A2A] flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <Landmark className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>SBI RERA Designated Master Escrow</span>
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <label className="text-[#8C777A] text-[10px] block">Escrow Account Number</label>
                  <input
                    type="text"
                    value={escrowAccountNo}
                    onChange={(e) => setEscrowAccountNo(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white rounded border border-[#DECFC0] text-[#24060B] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#8C777A] text-[10px] block">IFSC Code</label>
                  <input
                    type="text"
                    value={escrowIfsc}
                    onChange={(e) => setEscrowIfsc(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1 bg-white rounded border border-[#DECFC0] text-[#24060B] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Structural Flat Schedule Matrix & Typology Customizer */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826]">
              <Layers className="w-4 h-4 text-[#B88E3E]" />
              <span>2. Structural Tower &amp; Flat Schedule Matrix</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FFF9EE] text-[#B88E3E] font-semibold border border-[#F2E4C4]">
              Fully Customizable
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Towers</label>
              <input
                type="text"
                value={towers}
                onChange={(e) => setTowers(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
                placeholder="A, B, C"
              />
              <span className="text-[10px] text-[#8C777A] mt-0.5 block">Comma separated list</span>
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Floors per Tower</label>
              <input
                type="number"
                min={1}
                max={50}
                value={floorsPerTower}
                onChange={(e) => setFloorsPerTower(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
              <span className="text-[10px] text-[#8C777A] mt-0.5 block">Vertical levels (G + {floorsPerTower - 1})</span>
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Flats per Floor</label>
              <input
                type="number"
                min={1}
                max={12}
                value={flatsPerFloor}
                onChange={(e) => setFlatsPerFloor(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
              <span className="text-[10px] text-[#8C777A] mt-0.5 block">Apartments per lobby core</span>
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Numbering Scheme</label>
              <select
                value={numberingScheme}
                onChange={(e) => setNumberingScheme(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              >
                <option value="tower_floor_flat">Tower-FloorFlat (e.g. A-101)</option>
                <option value="tower_padded_flat">Tower-Padded (e.g. A-0101)</option>
                <option value="floor_flat">FloorFlat (e.g. 101, 204)</option>
              </select>
              <span className="text-[10px] text-[#8C777A] mt-0.5 block">Door numbering pattern</span>
            </div>
          </div>

          {/* Customizable Unit Typologies */}
          <div className="space-y-2 pt-2 border-t border-[#F0E8DD]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B] uppercase font-mono flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>Unit Typology Mix &amp; Pricing Calibration</span>
              </span>
              <span className="text-[10px] text-[#8C777A]">Sequential assignment across floor plates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {typologies.map((t, idx) => (
                <div key={t.id} className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#821A2A]">
                      Position #{idx + 1}: {t.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-[#DECFC0]">
                      {t.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">Carpet Area</label>
                      <input
                        type="number"
                        value={t.carpetSqft}
                        onChange={(e) => handleTypologyChange(t.id, "carpetSqft", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">SBA Area</label>
                      <input
                        type="number"
                        value={t.sbaSqft}
                        onChange={(e) => handleTypologyChange(t.id, "sbaSqft", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">UDS Area</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.udsSqft}
                        onChange={(e) => handleTypologyChange(t.id, "udsSqft", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">Base Price (₹)</label>
                      <input
                        type="number"
                        value={t.basePrice}
                        onChange={(e) => handleTypologyChange(t.id, "basePrice", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Stats & Live Flat Preview */}
          <div className="space-y-3 pt-2 border-t border-[#F0E8DD]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DECFC0]">
                <span className="text-[10px] text-[#8C777A] block uppercase font-mono">Towers Count</span>
                <span className="font-bold text-[#24060B] font-mono text-base">{towerList.length} Towers</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DECFC0]">
                <span className="text-[10px] text-[#8C777A] block uppercase font-mono">Floor Plates</span>
                <span className="font-bold text-[#24060B] font-mono text-base">{floorsPerTower} Floors</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DECFC0]">
                <span className="text-[10px] text-[#8C777A] block uppercase font-mono">Flats / Plate</span>
                <span className="font-bold text-[#24060B] font-mono text-base">{flatsPerFloor} Flats</span>
              </div>
              <div className="p-3 bg-[#FFF9EE] rounded-xl border border-[#F2E4C4]">
                <span className="text-[10px] text-[#B88E3E] block uppercase font-mono">Total Units to Generate</span>
                <span className="font-bold text-[#821A2A] font-mono text-base">{totalFlats} Flats</span>
              </div>
            </div>

            {/* Live Sample Flat Schedule Table */}
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DECFC0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#24060B] flex items-center space-x-1.5 font-mono uppercase">
                  <TableIcon className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Live Generated Schedule Preview (First {previewFlats.length} of {totalFlats} Flats)</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                  ✓ Deterministic Algorithmic Numbering
                </span>
              </div>

              <div className="overflow-x-auto max-h-48 border border-[#DECFC0] rounded-lg bg-white">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#F8F2EC] text-[#5C4A4D] font-mono font-semibold uppercase text-[10px] sticky top-0 border-b border-[#DECFC0]">
                    <tr>
                      <th className="px-3 py-1.5">Door No.</th>
                      <th className="px-3 py-1.5">Tower</th>
                      <th className="px-3 py-1.5">Floor</th>
                      <th className="px-3 py-1.5">Typology</th>
                      <th className="px-3 py-1.5">SBA</th>
                      <th className="px-3 py-1.5 text-right">Base Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DD]">
                    {previewFlats.map((f, i) => (
                      <tr key={i} className="hover:bg-[#FAF7F2]">
                        <td className="px-3 py-1 font-mono font-bold text-[#821A2A]">{f.flatNo}</td>
                        <td className="px-3 py-1 text-[#24060B]">{f.tower}</td>
                        <td className="px-3 py-1 font-mono text-[#5C4A4D]">Floor {f.floor}</td>
                        <td className="px-3 py-1 font-medium text-[#24060B]">{f.type}</td>
                        <td className="px-3 py-1 font-mono text-[#5C4A4D]">{f.sba} sq.ft</td>
                        <td className="px-3 py-1 font-mono text-right font-semibold text-[#24060B]">
                          {formatIndianCurrency(f.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Basement Parking Configuration */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826] border-b border-[#F0E8DD] pb-3">
            <Car className="w-4 h-4 text-[#B88E3E]" />
            <span>3. Basement Parking Matrix &amp; EV Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Basement Levels</label>
              <select
                value={basementLevels}
                onChange={(e) => setBasementLevels(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              >
                <option value="B1">Basement 1 Only (Single Level)</option>
                <option value="B1, B2">Basement 1 &amp; Basement 2 (Dual Levels)</option>
                <option value="B1, B2, B3">Basement 1, 2 &amp; 3 (Triple Deep Multi-Level)</option>
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
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">EV Charging Bay Frequency</label>
              <select
                value={evFrequency}
                onChange={(e) => setEvFrequency(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              >
                <option value={5}>Every 5th Bay (20% EV-Ready)</option>
                <option value={10}>Every 10th Bay (10% EV-Ready)</option>
                <option value={2}>Every 2nd Bay (50% EV-Ready)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3] text-xs text-[#5C4A4D] flex items-center justify-between">
            <span>
              Total Bays to Provision: <strong className="font-mono text-[#24060B]">{totalSlots} Bays</strong> (across {basementLevelCount} subterranean levels)
            </span>
            <span className="text-[10px] font-mono text-[#821A2A] font-semibold">
              Appurtenant to SC Nahalchand Precedent
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
          className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white glossy-btn-burgundy hover:brightness-105 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D4B989]" />
          <span>
            Provision Real Estate Project &amp; Matrix ({totalFlats} Flats + {totalSlots} Bays)
          </span>
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
                  {projectName} is active with {totalFlats} units and {totalSlots} parking slots in DeedFlow Cloud.
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

              <button
                onClick={handleLaunchProvisioned}
                className="w-full sm:w-auto sm:ml-auto px-4 py-2.5 bg-[#28070D] hover:bg-[#34070E] border border-[#3E0C14] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Launch This Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4B989]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
