import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const uptimeSeconds = process.uptime ? Math.floor(process.uptime()) : 0;
  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  return NextResponse.json(
    {
      status: "healthy",
      service: "DeedFlow Post-Sales OS",
      version: "2.5.0-enterprise",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.NODE_ENV || "development",
      region: process.env.VERCEL_REGION || "bom1",
      modules: {
        ocrEngine: "Gemini 2.5 Flash (In-Memory UIDAI Aadhaar Masking)",
        documentCompilation: "Dual Engine (docxtemplater + pdf-lib)",
        parkingMatrix: "Atomic Slot Allocation & EV Grid",
        auditTrail: "Two-Tier Cryptographic Ledger v2",
        exportEngine: "SheetJS XLSX & JSZip Bundler",
      },
      system: {
        nodeVersion: process.version,
        memoryUsageMb: memoryUsage
          ? {
              rss: Math.round(memoryUsage.rss / 1024 / 1024),
              heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
              heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            }
          : undefined,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
      },
    }
  );
}
