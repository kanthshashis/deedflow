import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * DeedFlow Supabase Client Configuration
 * Supports production cloud PostgreSQL connections, preview branches, and local-first fallback mode.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("your-supabase-project")
);

// Client-safe Supabase instance (uses Anon key with Row-Level Security)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Server-only privileged Supabase admin client
 * Uses SERVICE_ROLE_KEY to perform migrations, admin allocations, or super-admin audits.
 * NEVER expose this key to client components.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdminClient() cannot be invoked from the browser.");
  }

  if (isSupabaseConfigured && supabaseServiceKey && !supabaseServiceKey.includes("your-service-role-key")) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return null;
}
