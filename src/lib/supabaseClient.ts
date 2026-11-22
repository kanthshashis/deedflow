/**
 * DeedFlow Supabase Client Interface
 * Supports local-first demo mode and cloud Supabase connections.
 */

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-supabase-project")
);

export interface SupabaseQueryResult<T = unknown> {
  data: T | null;
  error: Error | null;
}

export interface SupabaseClientStub {
  from: (table: string) => {
    select: (columns?: string) => Promise<SupabaseQueryResult>;
    insert: (values: unknown) => Promise<SupabaseQueryResult>;
    update: (values: unknown) => {
      eq: (column: string, value: unknown) => Promise<SupabaseQueryResult>;
    };
    delete: () => {
      eq: (column: string, value: unknown) => Promise<SupabaseQueryResult>;
    };
  };
  rpc: (functionName: string, params?: Record<string, unknown>) => Promise<SupabaseQueryResult>;
  auth: {
    getUser: () => Promise<{ data: { user: unknown }; error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
  };
}

// In local-first mode or during build, provide typed null fallback
export const supabase: SupabaseClientStub | null = null;
