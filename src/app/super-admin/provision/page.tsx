"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Zap,
  Trash2,
  Plus,
  Settings2,
  HelpCircle,
} from "lucide-react";
import { ProjectMetadata, MatrixConfig, UnitTypology, TowerConfig } from "@/lib/types";
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
  const [matrixMode, setMatrixMode] = useState<"uniform" | "per_tower">("uniform");
  const [towers, setTowers] = useState("A, B");
  const [floorsPerTower, setFloorsPerTower] = useState(5);
  const [flatsPerFloor, setFlatsPerFloor] = useState(4);
  const [numberingScheme, setNumberingScheme] = useState<MatrixConfig["numberingScheme"]>("tower_floor_flat");
  const [typologies, setTypologies] = useState<UnitTypology[]>(DEFAULT_TYPOLOGIES);

  // Per-Tower Config State
  const towerList = useMemo(
    () => towers.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean),
    [towers]
  );
  const [activeTowerTab, setActiveTowerTab] = useState<string>("A");
  const [perTowerConfigs, setPerTowerConfigs] = useState<Record<string, TowerConfig>>({});

  // Synchronize perTowerConfigs when towerList or typologies change
  useEffect(() => {
    setPerTowerConfigs((prev) => {
      const updated: Record<string, TowerConfig> = {};
      for (const t of towerList) {
        if (prev[t]) {
          updated[t] = prev[t];
        } else {
          updated[t] = {
            towerName: t,
            floorsCount: floorsPerTower,
            flatsPerFloor: flatsPerFloor,
            numberingScheme,
            assignedTypologyIds: typologies.map((typ) => typ.id),
          };
        }
      }
      return updated;
    });
    if (towerList.length > 0 && !towerList.includes(activeTowerTab)) {
      setActiveTowerTab(towerList[0]);
    }
  }, [towerList, floorsPerTower, flatsPerFloor, numberingScheme, typologies, activeTowerTab]);

  // Inline Typology Modal/Drawer State
  const [isAddingTypology, setIsAddingTypology] = useState(false);
  const [newTypName, setNewTypName] = useState("");
  const [newTypType, setNewTypType] = useState<UnitTypology["type"]>("3BHK");
  const [newTypCarpet, setNewTypCarpet] = useState(1400);
  const [newTypSba, setNewTypSba] = useState(1800);
  const [newTypUds, setNewTypUds] = useState(450);
  const [newTypPrice, setNewTypPrice] = useState(14500000);

  // Step 3: Parking Matrix & Electric Points Configuration
  const [basementLevels, setBasementLevels] = useState<"B1" | "B1, B2" | "B1, B2, B3">("B1, B2");
  const [slotsPerBasement, setSlotsPerBasement] = useState(20);
  const [evAllocationMode, setEvAllocationMode] = useState<"frequency" | "custom">("frequency");
  const [evFrequency, setEvFrequency] = useState(5);
  const [customEvSlotsInput, setCustomEvSlotsInput] = useState("B1-05, B1-10, B2-05, B2-10");
  const [evPointPrefix, setEvPointPrefix] = useState("BESCOM-EV-");
  const [evPowerKw, setEvPowerKw] = useState(7.4);
  const [evConnectorType, setEvConnectorType] = useState("Type-2 AC Fast");

  // Step 4: Admin Credentials
  const [adminName, setAdminName] = useState("Vikram Malhotra");
  const [adminEmail, setAdminEmail] = useState("vikram.m@prestigeconstructions.com");
  const [adminPassword, setAdminPassword] = useState("Prestige@2026!Deed");

  // Output State
  const [isProvisioned, setIsProvisioned] = useState(false);
  const [provisionedProjectId, setProvisionedProjectId] = useState<string | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Calculations for Units & Slots
  const totalFlats = useMemo(() => {
    if (matrixMode === "per_tower") {
      return Object.values(perTowerConfigs).reduce(
        (sum, cfg) => sum + (cfg.floorsCount || 0) * (cfg.flatsPerFloor || 0),
        0
      );
    }
    return towerList.length * floorsPerTower * flatsPerFloor;
  }, [matrixMode, perTowerConfigs, towerList, floorsPerTower, flatsPerFloor]);

  const basementLevelCount = basementLevels === "B1, B2, B3" ? 3 : basementLevels === "B1, B2" ? 2 : 1;
  const totalSlots = basementLevelCount * slotsPerBasement;

  // Custom EV Set
  const customEvSlotsList = useMemo(() => {
    if (evAllocationMode === "custom") {
      return customEvSlotsInput.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    }
    return [];
  }, [evAllocationMode, customEvSlotsInput]);

  // Total EV Bays calculated
  const totalEvBays = useMemo(() => {
    if (evAllocationMode === "custom") {
      return customEvSlotsList.length;
    }
    return Math.floor(totalSlots / evFrequency);
  }, [evAllocationMode, customEvSlotsList, totalSlots, evFrequency]);

  // Live Flat Preview (Sample 8 units from configured towers)
  const previewFlats = useMemo(() => {
    const list: Array<{ flatNo: string; tower: string; floor: number; type: string; sba: number; price: number }> = [];

    if (matrixMode === "per_tower") {
      for (const t of towerList.slice(0, 2)) {
        const cfg = perTowerConfigs[t];
        if (!cfg) continue;
        const activeTyps = typologies.filter((typ) => cfg.assignedTypologyIds.includes(typ.id));
        const typs = activeTyps.length > 0 ? activeTyps : typologies;

        for (let f = 1; f <= Math.min(cfg.floorsCount, 2); f++) {
          for (let idx = 1; idx <= Math.min(cfg.flatsPerFloor, 4); idx++) {
            const typ = typs[(idx - 1) % typs.length];
            list.push({
              flatNo: formatFlatNumber(t, f, idx, cfg.numberingScheme),
              tower: `Tower ${t}`,
              floor: f,
              type: typ.name,
              sba: typ.sbaSqft,
              price: typ.basePrice,
            });
          }
        }
      }
    } else {
      for (const t of towerList.slice(0, 2)) {
        for (let f = 1; f <= Math.min(floorsPerTower, 2); f++) {
          for (let idx = 1; idx <= Math.min(flatsPerFloor, 4); idx++) {
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
    }
    return list;
  }, [matrixMode, towerList, perTowerConfigs, typologies, floorsPerTower, flatsPerFloor, numberingScheme]);

  // Add Custom Typology Handler
  const handleAddTypology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypName.trim()) return;

    const newTyp: UnitTypology = {
      id: `typ_${Date.now()}`,
      name: newTypName.trim(),
      type: newTypType,
      carpetSqft: newTypCarpet,
      sbaSqft: newTypSba,
      udsSqft: newTypUds,
      basePrice: newTypPrice,
    };

    setTypologies((prev) => [...prev, newTyp]);
    setNewTypName("");
    setIsAddingTypology(false);
  };

  const handleDeleteTypology = (id: string) => {
    if (typologies.length <= 1) {
      alert("At least one typology must remain configured.");
      return;
    }
    setTypologies((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTypologyFieldChange = (id: string, field: keyof UnitTypology, value: any) => {
    setTypologies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  // Toggle assigned typology for a specific tower in per-tower mode
  const handleToggleTowerTypology = (towerName: string, typId: string) => {
    setPerTowerConfigs((prev) => {
      const current = prev[towerName] || {
        towerName,
        floorsCount: floorsPerTower,
        flatsPerFloor,
        numberingScheme,
        assignedTypologyIds: [],
      };
      const exists = current.assignedTypologyIds.includes(typId);
      const updatedIds = exists
        ? current.assignedTypologyIds.filter((id) => id !== typId)
        : [...current.assignedTypologyIds, typId];

      if (updatedIds.length === 0) {
        alert("Each tower must have at least one assigned typology.");
        return prev;
      }

      return {
        ...prev,
        [towerName]: { ...current, assignedTypologyIds: updatedIds },
      };
    });
  };

  const handleUpdateTowerConfig = (towerName: string, field: keyof TowerConfig, val: any) => {
    setPerTowerConfigs((prev) => ({
      ...prev,
      [towerName]: {
        ...(prev[towerName] || {
          towerName,
          floorsCount: floorsPerTower,
          flatsPerFloor,
          numberingScheme,
          assignedTypologyIds: typologies.map((t) => t.id),
        }),
        [field]: val,
      },
    }));
  };

  // Main Submit: Provision Project & Matrix
  const handleGenerateMatrix = (e: React.FormEvent) => {
    e.preventDefault();

    const projectId = `proj_${Date.now()}`;
    const levelArray = basementLevels.split(",").map((s) => s.trim());

    const towerConfigArray: TowerConfig[] = towerList.map((t) => {
      return (
        perTowerConfigs[t] || {
          towerName: t,
          floorsCount: floorsPerTower,
          flatsPerFloor,
          numberingScheme,
          assignedTypologyIds: typologies.map((typ) => typ.id),
        }
      );
    });

    const matrixConfig: MatrixConfig = {
      mode: matrixMode,
      towers: towerList,
      floorsPerTower,
      flatsPerFloor,
      numberingScheme,
      typologies,
      towerConfigs: towerConfigArray,
      basementLevels: levelArray,
      slotsPerLevel: slotsPerBasement,
      evSlotFrequency: evAllocationMode === "frequency" ? evFrequency : 0,
      evPointPrefix,
      evPowerKw,
      evConnectorType,
      customEvSlots: evAllocationMode === "custom" ? customEvSlotsList : undefined,
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

    // Generate and save inventory matrix & parking slots
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
    `*Structural Matrix:*\n` +
    `• Towers: ${towerList.join(", ")} (${totalFlats} Flats total)\n` +
    `• Architecture Mode: ${matrixMode === "per_tower" ? "Heterogeneous Per-Tower Config" : "Uniform Matrix"}\n` +
    `• Typologies Configured: ${typologies.map((t) => t.name).join(", ")}\n` +
    `• Subterranean Parking: ${totalSlots} Bays (${basementLevels})\n` +
    `• EV Charging Bays: ${totalEvBays} Bays (${evPowerKw} kW ${evConnectorType}, Feeders tagged '${evPointPrefix}')\n` +
    `• RERA Number: ${reraNumber}\n` +
    `• Master Escrow: ${escrowBankName} (A/C: ${escrowAccountNo} | IFSC: ${escrowIfsc})\n\n` +
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
          Configure heterogeneous towers, dynamic typology mixes, designated EV charging points, and secure Project Admin credentials.
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

        {/* Step 2: Structural Flat Schedule Matrix & Heterogeneous Towers */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826]">
              <Layers className="w-4 h-4 text-[#B88E3E]" />
              <span>2. Structural Tower &amp; Flat Schedule Matrix</span>
            </div>

            {/* Architecture Mode Toggle */}
            <div className="flex items-center space-x-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#DECFC0]">
              <button
                type="button"
                onClick={() => setMatrixMode("uniform")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  matrixMode === "uniform"
                    ? "bg-[#821A2A] text-white shadow-xs font-bold"
                    : "text-[#5C4A4D] hover:text-[#24060B]"
                }`}
              >
                Uniform Matrix
              </button>
              <button
                type="button"
                onClick={() => setMatrixMode("per_tower")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  matrixMode === "per_tower"
                    ? "bg-[#821A2A] text-white shadow-xs font-bold"
                    : "text-[#5C4A4D] hover:text-[#24060B]"
                }`}
              >
                Heterogeneous Per-Tower
              </button>
            </div>
          </div>

          {/* Global Towers Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Configured Towers List</label>
              <input
                type="text"
                value={towers}
                onChange={(e) => setTowers(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
                placeholder="A, B, C, D"
              />
              <span className="text-[10px] text-[#8C777A] mt-0.5 block">
                Comma separated tower codes (e.g. A, B, C or Wing 1, Wing 2)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#5C4A4D] mb-1">Architecture Summary</label>
              <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] flex items-center justify-between text-xs">
                <span>
                  Active Towers: <strong className="font-mono text-[#821A2A]">{towerList.length} Towers</strong>
                </span>
                <span>
                  Total Units: <strong className="font-mono text-[#821A2A] font-bold">{totalFlats} Flats</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Mode 1: Uniform Mode Inputs */}
          {matrixMode === "uniform" ? (
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-3 animate-fade-in">
              <span className="text-[11px] font-bold text-[#821A2A] font-mono uppercase block">
                Uniform Configuration (Applied to All Towers)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#5C4A4D] mb-1">Floors per Tower</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={floorsPerTower}
                    onChange={(e) => setFloorsPerTower(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white"
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
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DECFC0] text-[#24060B] font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#5C4A4D] mb-1">Numbering Scheme</label>
                  <select
                    value={numberingScheme}
                    onChange={(e) => setNumberingScheme(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DECFC0] text-[#24060B] font-semibold bg-white"
                  >
                    <option value="tower_floor_flat">Tower-FloorFlat (e.g. A-101)</option>
                    <option value="tower_padded_flat">Tower-Padded (e.g. A-0101)</option>
                    <option value="floor_flat">FloorFlat (e.g. 101, 204)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Heterogeneous Per-Tower Mode */
            <div className="p-4 bg-[#FFF9EE] rounded-xl border border-[#F2E4C4] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#821A2A] font-mono uppercase flex items-center space-x-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-[#821A2A]" />
                  <span>Heterogeneous Tower Customizer (Configure Each Tower Independently)</span>
                </span>
                <span className="text-[10px] text-[#B88E3E] font-semibold font-mono">
                  Independent Floor &amp; Typology Assignment
                </span>
              </div>

              {/* Tower Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-[#F2E4C4] pb-2">
                {towerList.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTowerTab(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTowerTab === t
                        ? "bg-[#821A2A] text-white shadow-xs"
                        : "bg-white text-[#5C4A4D] hover:bg-[#FAF0F2] border border-[#DECFC0]"
                    }`}
                  >
                    Tower {t}
                  </button>
                ))}
              </div>

              {/* Active Tower Customizer */}
              {perTowerConfigs[activeTowerTab] && (
                <div className="space-y-3 text-xs bg-white p-3.5 rounded-xl border border-[#DECFC0]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#24060B]">
                      Tower {activeTowerTab} Structural Specifications
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#821A2A] font-bold">
                      {(perTowerConfigs[activeTowerTab].floorsCount || 0) * (perTowerConfigs[activeTowerTab].flatsPerFloor || 0)} Units in Tower {activeTowerTab}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-[#8C777A] block mb-0.5">Floors in Tower {activeTowerTab}</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={perTowerConfigs[activeTowerTab].floorsCount}
                        onChange={(e) =>
                          handleUpdateTowerConfig(activeTowerTab, "floorsCount", Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DECFC0] font-mono font-bold text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block mb-0.5">Flats per Floor Core</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={perTowerConfigs[activeTowerTab].flatsPerFloor}
                        onChange={(e) =>
                          handleUpdateTowerConfig(activeTowerTab, "flatsPerFloor", Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DECFC0] font-mono font-bold text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block mb-0.5">Door Pattern</label>
                      <select
                        value={perTowerConfigs[activeTowerTab].numberingScheme}
                        onChange={(e) =>
                          handleUpdateTowerConfig(activeTowerTab, "numberingScheme", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DECFC0] font-semibold text-[#24060B]"
                      >
                        <option value="tower_floor_flat">{activeTowerTab}-101 (Standard)</option>
                        <option value="tower_padded_flat">{activeTowerTab}-0101 (Padded)</option>
                        <option value="floor_flat">101, 204 (Simple)</option>
                      </select>
                    </div>
                  </div>

                  {/* Assigned Typologies Checklist for Active Tower */}
                  <div className="pt-2 border-t border-[#F0E8DD] space-y-1.5">
                    <label className="text-[10px] font-bold text-[#5C4A4D] uppercase font-mono block">
                      Assign Typologies to Tower {activeTowerTab}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {typologies.map((typ) => {
                        const isAssigned = perTowerConfigs[activeTowerTab]?.assignedTypologyIds.includes(typ.id);
                        return (
                          <button
                            key={typ.id}
                            type="button"
                            onClick={() => handleToggleTowerTypology(activeTowerTab, typ.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                              isAssigned
                                ? "bg-[#FAF0F2] text-[#821A2A] border border-[#E8C4C8] shadow-2xs font-bold"
                                : "bg-[#F8F2EC] text-[#8C777A] border border-[#DECFC0] opacity-60 hover:opacity-100"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isAssigned ? "bg-[#821A2A]" : "bg-gray-400"}`} />
                            <span>{typ.name}</span>
                            <span className="text-[10px] font-mono text-[#8C777A]">({typ.sbaSqft} sq.ft)</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Typology Palette & Dynamic Add Typology */}
          <div className="space-y-3 pt-2 border-t border-[#F0E8DD]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B] uppercase font-mono flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>Configured Typology Palette ({typologies.length} Typologies)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAddingTypology(!isAddingTypology)}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FAF0F2] text-[#821A2A] hover:bg-[#F2E0E4] border border-[#E8C4C8] flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>+ Add Custom Typology</span>
              </button>
            </div>

            {/* Inline Add Typology Form */}
            {isAddingTypology && (
              <div className="p-4 bg-[#FAF0F2] rounded-xl border border-[#E8C4C8] space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#821A2A]">New Custom Typology Designer</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingTypology(false)}
                    className="text-[#8C777A] hover:text-[#24060B]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-[#8C777A] block">Typology Name</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.5 BHK Compact or Sky Villa"
                      value={newTypName}
                      onChange={(e) => setNewTypName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#DECFC0] text-[#24060B]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8C777A] block">Unit Type</label>
                    <select
                      value={newTypType}
                      onChange={(e) => setNewTypType(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#DECFC0] text-[#24060B]"
                    >
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="4BHK">4BHK</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8C777A] block">Carpet (sq.ft)</label>
                    <input
                      type="number"
                      value={newTypCarpet}
                      onChange={(e) => setNewTypCarpet(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#DECFC0] font-mono text-[#24060B]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8C777A] block">SBA (sq.ft)</label>
                    <input
                      type="number"
                      value={newTypSba}
                      onChange={(e) => setNewTypSba(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#DECFC0] font-mono text-[#24060B]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8C777A] block">Base Price (₹)</label>
                    <input
                      type="number"
                      value={newTypPrice}
                      onChange={(e) => setNewTypPrice(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#DECFC0] font-mono text-[#24060B]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTypology}
                  className="px-4 py-1.5 glossy-btn-burgundy text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save &amp; Add to Palette
                </button>
              </div>
            )}

            {/* Configured Typologies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {typologies.map((t, idx) => (
                <div key={t.id} className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#821A2A]">
                      #{idx + 1}: {t.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-[#DECFC0]">
                        {t.type}
                      </span>
                      {typologies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTypology(t.id)}
                          className="p-1 text-[#8C777A] hover:text-rose-600 rounded transition-colors"
                          title="Remove Typology"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">Carpet</label>
                      <input
                        type="number"
                        value={t.carpetSqft}
                        onChange={(e) => handleTypologyFieldChange(t.id, "carpetSqft", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">SBA</label>
                      <input
                        type="number"
                        value={t.sbaSqft}
                        onChange={(e) => handleTypologyFieldChange(t.id, "sbaSqft", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">UDS</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.udsSqft}
                        onChange={(e) => handleTypologyFieldChange(t.id, "udsSqft", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8C777A] block">Base Price (₹)</label>
                      <input
                        type="number"
                        value={t.basePrice}
                        onChange={(e) => handleTypologyFieldChange(t.id, "basePrice", Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded border border-[#DECFC0] font-mono text-[#24060B]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Schedule Preview Table */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DECFC0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24060B] flex items-center space-x-1.5 font-mono uppercase">
                <TableIcon className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>Live Generated Schedule Preview ({previewFlats.length} of {totalFlats} Flats)</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                ✓ Algorithmic Deterministic Schedule
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

        {/* Step 3: Basement Parking & EV Electric Points Configuration */}
        <div className="glossy-card bg-[#FFFDFB] p-6 rounded-2xl border border-[#DECFC0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#7D1826]">
              <Car className="w-4 h-4 text-[#B88E3E]" />
              <span>3. Basement Parking Matrix &amp; Electric Point Metering</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF0F2] text-[#821A2A] font-semibold border border-[#E8C4C8] flex items-center space-x-1">
              <Zap className="w-3 h-3 text-[#821A2A]" />
              <span>EV Ready Infrastructure</span>
            </span>
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
              <label className="block font-semibold text-[#5C4A4D] mb-1">EV Allocation Mode</label>
              <select
                value={evAllocationMode}
                onChange={(e) => setEvAllocationMode(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DECFC0] text-[#24060B] bg-white focus:outline-none focus:ring-1 focus:ring-[#821A2A]"
              >
                <option value="frequency">Algorithmic Ratio (e.g. Every Nth Bay)</option>
                <option value="custom">Explicit Custom Bay Tagging (Specific Slot #)</option>
              </select>
            </div>
          </div>

          {/* Detailed EV Electric Points & Metering Configuration */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DECFC0] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#821A2A] flex items-center space-x-1.5 uppercase font-mono text-[11px]">
                <Zap className="w-3.5 h-3.5 text-[#821A2A]" />
                <span>Electric Feeder Point &amp; Sub-Meter Designation</span>
              </span>
              <span className="text-[10px] text-[#5C4A4D] font-mono">
                {totalEvBays} EV Bays Provisioned ({((totalEvBays / totalSlots) * 100).toFixed(0)}% Coverage)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[#8C777A] block mb-0.5">Electric Point Prefix</label>
                <input
                  type="text"
                  value={evPointPrefix}
                  onChange={(e) => setEvPointPrefix(e.target.value)}
                  placeholder="e.g. BESCOM-EV- or FEEDER-B1-"
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#DECFC0] font-mono font-bold text-[#24060B]"
                />
                <span className="text-[9px] text-[#8C777A] mt-0.5 block">Generates e.g. {evPointPrefix}B1-05</span>
              </div>
              <div>
                <label className="text-[10px] text-[#8C777A] block mb-0.5">Charger Power Capacity</label>
                <select
                  value={evPowerKw}
                  onChange={(e) => setEvPowerKw(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#DECFC0] font-semibold text-[#24060B]"
                >
                  <option value={3.3}>3.3 kW (15A Smart Socket)</option>
                  <option value={7.4}>7.4 kW (Type-2 AC Fast)</option>
                  <option value={11}>11 kW (Three-Phase Fast)</option>
                  <option value={22}>22 kW (Commercial High-Power)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#8C777A] block mb-0.5">Connector Standard</label>
                <select
                  value={evConnectorType}
                  onChange={(e) => setEvConnectorType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#DECFC0] font-semibold text-[#24060B]"
                >
                  <option value="Type-2 AC Fast">Type-2 IEC 62196 (AC Fast)</option>
                  <option value="15A Industrial Socket">15A 3-Pin Industrial Plug</option>
                  <option value="CCS-2 Combo DC">CCS-2 Combo Fast DC</option>
                </select>
              </div>
            </div>

            {/* Custom Tagged Bays Input if in custom mode */}
            {evAllocationMode === "custom" ? (
              <div className="pt-2 border-t border-[#DECFC0]/60">
                <label className="text-[10px] font-bold text-[#5C4A4D] uppercase font-mono block mb-1">
                  Target Specific Parking Slots for EV Feeders (Comma-separated)
                </label>
                <input
                  type="text"
                  value={customEvSlotsInput}
                  onChange={(e) => setCustomEvSlotsInput(e.target.value)}
                  placeholder="e.g. B1-01, B1-05, B1-12, B2-04, B2-15"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#DECFC0] font-mono text-[#24060B]"
                />
              </div>
            ) : (
              <div className="pt-2 border-t border-[#DECFC0]/60 flex items-center justify-between">
                <div>
                  <label className="text-[10px] text-[#8C777A] block mb-0.5">Algorithmic Distribution</label>
                  <select
                    value={evFrequency}
                    onChange={(e) => setEvFrequency(Number(e.target.value))}
                    className="px-2.5 py-1 bg-white rounded-lg border border-[#DECFC0] text-[#24060B]"
                  >
                    <option value={5}>Every 5th Bay (20% EV Bays)</option>
                    <option value={3}>Every 3rd Bay (33% EV Bays)</option>
                    <option value={2}>Every 2nd Bay (50% EV Bays)</option>
                    <option value={1}>Every Bay (100% EV Bays)</option>
                  </select>
                </div>
                <div className="text-[11px] text-[#5C4A4D] text-right">
                  Sample Tagging: <strong className="font-mono text-[#821A2A]">Slot B1-05</strong> $\to$ Electric Point <strong className="font-mono text-[#821A2A]">{evPointPrefix}B1-05</strong>
                </div>
              </div>
            )}
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
            Provision Real Estate Project &amp; Matrix ({totalFlats} Flats + {totalSlots} Bays, {totalEvBays} EV Points)
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
                  {projectName} is active with {totalFlats} units, {totalSlots} parking slots, and {totalEvBays} EV charging points in DeedFlow Cloud.
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
