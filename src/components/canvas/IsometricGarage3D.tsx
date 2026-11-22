"use client";

import React, { useEffect, useRef, useState } from "react";
import { Car, Layers, Eye, ShieldCheck, Sparkles, RefreshCw, Zap } from "lucide-react";
import clsx from "clsx";

interface Bay3D {
  id: string;
  slotNumber: string;
  row: number; // 0 or 1
  col: number; // 0 to 5
  type: "Standard" | "Compact" | "EV Wide" | "Tandem";
  status: "available" | "allotted" | "reserved";
  flatNumber?: string;
  carColor?: string;
  carType?: "sedan" | "suv" | "sports";
}

const INITIAL_BAYS: Bay3D[] = [
  // Upper Row (Row 0)
  { id: "b1", slotNumber: "B1-01", row: 0, col: 0, type: "Standard", status: "allotted", flatNumber: "B-101", carColor: "#0284C7", carType: "sedan" },
  { id: "b2", slotNumber: "B1-02", row: 0, col: 1, type: "Standard", status: "available" },
  { id: "b3", slotNumber: "B1-03", row: 0, col: 2, type: "EV Wide", status: "allotted", flatNumber: "B-201", carColor: "#10B981", carType: "suv" },
  { id: "b4", slotNumber: "B1-04", row: 0, col: 3, type: "Compact", status: "available" },
  { id: "b5", slotNumber: "B1-05", row: 0, col: 4, type: "Compact", status: "available" },
  { id: "b6", slotNumber: "B1-06", row: 0, col: 5, type: "Tandem", status: "reserved", flatNumber: "B-103", carColor: "#F59E0B", carType: "sports" },

  // Lower Row (Row 1)
  { id: "b7", slotNumber: "B1-07", row: 1, col: 0, type: "Standard", status: "available" },
  { id: "b8", slotNumber: "B1-08", row: 1, col: 1, type: "Standard", status: "allotted", flatNumber: "B-302", carColor: "#38BDF8", carType: "sedan" },
  { id: "b9", slotNumber: "B1-09", row: 1, col: 2, type: "Standard", status: "available" },
  { id: "b10", slotNumber: "B1-10", row: 1, col: 3, type: "Compact", status: "available" },
  { id: "b11", slotNumber: "B1-11", row: 1, col: 4, type: "EV Wide", status: "available" },
  { id: "b12", slotNumber: "B1-12", row: 1, col: 5, type: "Standard", status: "allotted", flatNumber: "B-404", carColor: "#E2E8F0", carType: "suv" },
];

export function IsometricGarage3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bays, setBays] = useState<Bay3D[]>(INITIAL_BAYS);
  const [selectedBay, setSelectedBay] = useState<Bay3D | null>(INITIAL_BAYS[1]);
  const [activeLevel, setActiveLevel] = useState<"Basement 1" | "Basement 2">("Basement 1");
  const [hoveredBay, setHoveredBay] = useState<Bay3D | null>(null);
  const [lightMode, setLightMode] = useState<"neon" | "daylight">("neon");
  const [toast, setToast] = useState<string | null>(null);

  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Update mouse position with smooth damping
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Normalized between -1 and 1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mousePosRef.current.targetX = nx;
      mousePosRef.current.targetY = ny;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3D Isometric Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Damped mouse tracking for camera parallax tilt
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.08;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.08;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Camera settings with dynamic parallax
      const originX = width / 2 + mousePosRef.current.x * 25;
      const originY = height / 2.4 + mousePosRef.current.y * 18;
      const scale = Math.min(width, height) / 16;
      const angle = Math.PI / 6; // 30 degrees isometric
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Helper to project 3D (X, Y, Z) to 2D Screen (px, py)
      const toScreen = (x: number, y: number, z: number) => {
        return {
          x: originX + (x - y) * cosA * scale,
          y: originY + (x + y) * sinA * scale - z * scale,
        };
      };

      // 1. Draw 3D Concrete Basement Floor Slab
      const slabW = 14;
      const slabL = 10;
      const slabThickness = 0.8;

      // Slab Top Face
      const p0 = toScreen(-slabW / 2, -slabL / 2, 0);
      const p1 = toScreen(slabW / 2, -slabL / 2, 0);
      const p2 = toScreen(slabW / 2, slabL / 2, 0);
      const p3 = toScreen(-slabW / 2, slabL / 2, 0);

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();

      // Concrete pavement gradient
      const slabGrad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
      if (lightMode === "neon") {
        slabGrad.addColorStop(0, "#0C1222");
        slabGrad.addColorStop(0.5, "#0F172A");
        slabGrad.addColorStop(1, "#080D1A");
      } else {
        slabGrad.addColorStop(0, "#1E293B");
        slabGrad.addColorStop(1, "#0F172A");
      }
      ctx.fillStyle = slabGrad;
      ctx.fill();
      ctx.strokeStyle = lightMode === "neon" ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Slab Front Edge (Depth)
      const pb1 = toScreen(slabW / 2, -slabL / 2, -slabThickness);
      const pb2 = toScreen(slabW / 2, slabL / 2, -slabThickness);
      const pb3 = toScreen(-slabW / 2, slabL / 2, -slabThickness);

      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(pb3.x, pb3.y);
      ctx.lineTo(pb2.x, pb2.y);
      ctx.closePath();
      ctx.fillStyle = "#060A13";
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.stroke();

      // 2. Architectural Blueprint Grid Lines on Floor
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 0.8;
      for (let gx = -slabW / 2; gx <= slabW / 2; gx += 2) {
        const ga = toScreen(gx, -slabL / 2, 0);
        const gb = toScreen(gx, slabL / 2, 0);
        ctx.beginPath();
        ctx.moveTo(ga.x, ga.y);
        ctx.lineTo(gb.x, gb.y);
        ctx.stroke();
      }
      for (let gy = -slabL / 2; gy <= slabL / 2; gy += 2) {
        const ga = toScreen(-slabW / 2, gy, 0);
        const gb = toScreen(slabW / 2, gy, 0);
        ctx.beginPath();
        ctx.moveTo(ga.x, ga.y);
        ctx.lineTo(gb.x, gb.y);
        ctx.stroke();
      }

      // 3. Central Driveway / Ramp Direction Arrow
      const arrowStart = toScreen(0, -slabL / 2 + 1, 0.02);
      const arrowEnd = toScreen(0, slabL / 2 - 1, 0.02);
      ctx.beginPath();
      ctx.moveTo(arrowStart.x, arrowStart.y);
      ctx.lineTo(arrowEnd.x, arrowEnd.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Render All 12 Parking Bays
      const bayW = 1.9;
      const bayL = 3.6;
      const colSpacing = 2.1;
      const startX = -5.2;

      bays.forEach((bay) => {
        const bx = startX + bay.col * colSpacing;
        const by = bay.row === 0 ? -4.2 : 0.8; // Row 0 is top, Row 1 is bottom

        // 4 Corners of Bay
        const b0 = toScreen(bx, by, 0.02);
        const b1 = toScreen(bx + bayW, by, 0.02);
        const b2 = toScreen(bx + bayW, by + bayL, 0.02);
        const b3 = toScreen(bx, by + bayL, 0.02);

        const isHovered = hoveredBay?.id === bay.id;
        const isSelected = selectedBay?.id === bay.id;

        // Bay Background Fill
        ctx.beginPath();
        ctx.moveTo(b0.x, b0.y);
        ctx.lineTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.closePath();

        if (bay.status === "allotted") {
          ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
        } else if (bay.status === "reserved") {
          ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
        } else {
          ctx.fillStyle = isHovered ? "rgba(56, 189, 248, 0.18)" : "rgba(30, 41, 59, 0.4)";
        }
        ctx.fill();

        // Bay Striped Boundary
        ctx.strokeStyle = isSelected
          ? "#38BDF8"
          : bay.status === "allotted"
          ? "rgba(16, 185, 129, 0.7)"
          : bay.status === "reserved"
          ? "rgba(245, 158, 11, 0.7)"
          : isHovered
          ? "rgba(56, 189, 248, 0.8)"
          : "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.stroke();

        // Slot Number Painted on Bay
        const center = toScreen(bx + bayW / 2, by + 0.6, 0.03);
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isSelected
          ? "#38BDF8"
          : bay.status === "allotted"
          ? "#34D399"
          : bay.status === "reserved"
          ? "#FBBF24"
          : "#94A3B8";
        ctx.fillText(bay.slotNumber, center.x, center.y);

        // 5. Draw 3D Car if Allotted or Reserved
        if ((bay.status === "allotted" || bay.status === "reserved") && bay.carColor) {
          draw3DCar(ctx, bx + bayW / 2, by + bayL / 2, bay.carColor, bay.row === 0 ? "up" : "down", scale, toScreen);
        }
      });

      // 6. 3D Architectural Concrete Columns
      const columns = [
        { x: -5.5, y: -0.1 },
        { x: -1.0, y: -0.1 },
        { x: 3.5, y: -0.1 },
        { x: 6.8, y: -0.1 },
      ];

      columns.forEach((col) => {
        draw3DColumn(ctx, col.x, col.y, 2.5, toScreen);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [bays, hoveredBay, selectedBay, lightMode]);

  // Handle clicks on canvas to select/allot slot
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Approximate closest bay in isometric space
    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2.4;
    const scale = Math.min(width, height) / 16;
    const cosA = Math.cos(Math.PI / 6);
    const sinA = Math.sin(Math.PI / 6);

    const bayW = 1.9;
    const bayL = 3.6;
    const colSpacing = 2.1;
    const startX = -5.2;

    let foundBay: Bay3D | null = null;
    let minDistance = 9999;

    bays.forEach((bay) => {
      const bx = startX + bay.col * colSpacing + bayW / 2;
      const by = (bay.row === 0 ? -4.2 : 0.8) + bayL / 2;
      const screenPt = {
        x: originX + (bx - by) * cosA * scale,
        y: originY + (bx + by) * sinA * scale,
      };

      const dist = Math.hypot(clickX - screenPt.x, clickY - screenPt.y);
      if (dist < minDistance && dist < scale * 1.5) {
        minDistance = dist;
        foundBay = bay;
      }
    });

    if (foundBay) {
      setSelectedBay(foundBay);
    }
  };

  const handleToggleAllot = (bay: Bay3D) => {
    if (bay.status === "available") {
      setBays((prev) =>
        prev.map((b) =>
          b.id === bay.id
            ? { ...b, status: "allotted", flatNumber: "B-302", carColor: "#38BDF8", carType: "sedan" }
            : b
        )
      );
      setToast(`Bay ${bay.slotNumber} Allotted & Car Parked in 3D!`);
    } else {
      setBays((prev) =>
        prev.map((b) =>
          b.id === bay.id
            ? { ...b, status: "available", flatNumber: undefined, carColor: undefined }
            : b
        )
      );
      setToast(`Bay ${bay.slotNumber} Vacated.`);
    }
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-sky-500/40 via-blue-900/30 to-slate-950 shadow-2xl">
      <div className="rounded-[23px] bg-slate-950/90 border border-white/10 p-5 sm:p-7 backdrop-blur-2xl space-y-5">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
                Interactive 3D Isometric Viewport
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Basement Garage 3D Digital Twin</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                60 FPS Engine
              </span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Level Toggle */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-white/10">
              {(["Basement 1", "Basement 2"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg font-bold spring-transition",
                    activeLevel === lvl
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Lighting Toggle */}
            <button
              onClick={() => setLightMode(lightMode === "neon" ? "daylight" : "neon")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 rounded-xl font-mono text-xs flex items-center space-x-1.5 spring-transition"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>{lightMode === "neon" ? "Neon Cyber" : "Studio Light"}</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#090E1A] to-[#04070D] aspect-[16/9] max-h-[500px] flex items-center justify-center cursor-crosshair group shadow-inner">
          <canvas
            ref={canvasRef}
            width={1200}
            height={680}
            onClick={handleCanvasClick}
            className="w-full h-full object-contain select-none"
          />

          {/* Toast Alert */}
          {toast && (
            <div className="absolute top-4 inset-x-0 mx-auto w-fit px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-full text-xs font-bold font-mono shadow-2xl backdrop-blur-md animate-fade-in flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{toast}</span>
            </div>
          )}

          {/* Bottom HUD Overlay */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-400 font-mono text-[11px] backdrop-blur-md">
              🖱️ Move cursor for 3D Camera Tilt • Click bay to inspect
            </div>

            <div className="flex items-center space-x-3 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono backdrop-blur-md">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{bays.filter((b) => b.status === "allotted").length} Allotted</span>
              </span>
              <span className="flex items-center space-x-1.5 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>{bays.filter((b) => b.status === "available").length} Free</span>
              </span>
            </div>
          </div>
        </div>

        {/* Selected Bay Floating HUD Inspector Card */}
        {selectedBay && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs animate-fade-in">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold text-sm">
                {selectedBay.slotNumber}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">
                    Bay {selectedBay.slotNumber} ({selectedBay.type})
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase",
                      selectedBay.status === "allotted"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-sky-500/20 text-sky-400"
                    )}
                  >
                    {selectedBay.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedBay.flatNumber
                    ? `Allocated to Flat ${selectedBay.flatNumber} with Sale Agreement`
                    : "Ready for instant allocation in 1-Click Bank Kit"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleAllot(selectedBay)}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-sky-500/25 spring-transition"
              >
                <Car className="w-3.5 h-3.5" />
                <span>
                  {selectedBay.status === "available"
                    ? "Park Car in Bay (Allot)"
                    : "Vacate Bay"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 3D Car Drawing Function
function draw3DCar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
  dir: "up" | "down",
  scale: number,
  toScreen: (x: number, y: number, z: number) => { x: number; y: number }
) {
  const cw = 0.9;
  const cl = 1.9;
  const ch = 0.55;

  const x0 = cx - cw / 2;
  const x1 = cx + cw / 2;
  const y0 = cy - cl / 2;
  const y1 = cy + cl / 2;

  // Car Base Chassis
  const p0 = toScreen(x0, y0, 0.05);
  const p1 = toScreen(x1, y0, 0.05);
  const p2 = toScreen(x1, y1, 0.05);
  const p3 = toScreen(x0, y1, 0.05);

  // Car Roof (ch height)
  const r0 = toScreen(x0, y0, ch);
  const r1 = toScreen(x1, y0, ch);
  const r2 = toScreen(x1, y1, ch);
  const r3 = toScreen(x0, y1, ch);

  // Roof Face
  ctx.beginPath();
  ctx.moveTo(r0.x, r0.y);
  ctx.lineTo(r1.x, r1.y);
  ctx.lineTo(r2.x, r2.y);
  ctx.lineTo(r3.x, r3.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Side Face
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(r2.x, r2.y);
  ctx.lineTo(r1.x, r1.y);
  ctx.closePath();
  ctx.fillStyle = "#090E1A";
  ctx.fill();
  ctx.stroke();

  // Front/Back Face
  ctx.beginPath();
  ctx.moveTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(r3.x, r3.y);
  ctx.lineTo(r2.x, r2.y);
  ctx.closePath();
  ctx.fillStyle = "#0F172A";
  ctx.fill();
  ctx.stroke();

  // Headlights
  const hlY = dir === "up" ? y0 : y1;
  const hl1 = toScreen(x0 + 0.15, hlY, 0.2);
  const hl2 = toScreen(x1 - 0.15, hlY, 0.2);

  ctx.beginPath();
  ctx.arc(hl1.x, hl1.y, 2, 0, Math.PI * 2);
  ctx.arc(hl2.x, hl2.y, 2, 0, Math.PI * 2);
  ctx.fillStyle = "#38BDF8";
  ctx.shadowColor = "#38BDF8";
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.shadowBlur = 0;
}

// 3D Column Drawing Function
function draw3DColumn(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  toScreen: (x: number, y: number, z: number) => { x: number; y: number }
) {
  const size = 0.45;
  const b0 = toScreen(x - size / 2, y - size / 2, 0);
  const b1 = toScreen(x + size / 2, y - size / 2, 0);
  const b2 = toScreen(x + size / 2, y + size / 2, 0);
  const b3 = toScreen(x - size / 2, y + size / 2, 0);

  const t0 = toScreen(x - size / 2, y - size / 2, height);
  const t1 = toScreen(x + size / 2, y - size / 2, height);
  const t2 = toScreen(x + size / 2, y + size / 2, height);
  const t3 = toScreen(x - size / 2, y + size / 2, height);

  // Column Front
  ctx.beginPath();
  ctx.moveTo(b2.x, b2.y);
  ctx.lineTo(b3.x, b3.y);
  ctx.lineTo(t3.x, t3.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.closePath();
  ctx.fillStyle = "#1E293B";
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
  ctx.stroke();

  // Column Side
  ctx.beginPath();
  ctx.moveTo(b1.x, b1.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(t1.x, t1.y);
  ctx.closePath();
  ctx.fillStyle = "#0F172A";
  ctx.fill();
  ctx.stroke();
}
