import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const uptimeSeconds = process.uptime ? Math.floor(process.uptime()) : 0;
  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your-gemini-api-key-here" &&
    process.env.GEMINI_API_KEY.length > 10
  );

  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== "your-resend-api-key"
  );

  const razorpayConfigured = Boolean(
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_ID !== "rzp_test_placeholder"
  );

  return NextResponse.json(
    {
      status: "healthy",
      service: "DeedFlow Post-Sales OS",
      version: "2.5.0-enterprise",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.NODE_ENV || "development",
      region: process.env.VERCEL_REGION || "bom1 (Mumbai)",
      integrations: {
        database: {
          provider: "Supabase PostgreSQL",
          status: isSupabaseConfigured ? "connected" : "local_first_fallback",
        },
        aiKycOcr: {
          provider: "Google Gemini 2.5 Flash",
          status: geminiConfigured ? "live_cloud" : "deterministic_fallback",
        },
        transactionalEmail: {
          provider: "Resend",
          status: emailConfigured ? "live_cloud" : "audit_logged_simulation",
        },
        billing: {
          provider: "Razorpay",
          status: razorpayConfigured ? "configured" : "sandbox_mode",
        },
      },
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
