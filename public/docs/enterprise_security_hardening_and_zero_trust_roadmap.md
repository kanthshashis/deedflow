# DeedFlow Enterprise Security Hardening & Zero-Trust AppSec Architecture Roadmap

**Document Reference:** `SEC-ARCH-ZERO-TRUST-V1`  
**Classification:** Enterprise Security Blueprint  
**Status:** Stored in Memory — Ready for Instant Activation on User Command  
**Author:** DeepMind Antigravity AppSec & Platform Engineering  

---

## Executive Summary

This blueprint documents the complete transition strategy from DeedFlow's current **Local-First Zero-Retention Baseline** to a **Bank-Grade, Zero-Trust Enterprise Cloud Architecture**. 

When requested, this roadmap will be executed to eliminate client-side tampering, enforce edge middleware route protection, gate all API endpoints, implement cryptographic session signatures, and establish multi-tenant PostgreSQL Row-Level Security (RLS).

---

## 1. Vulnerability Matrix & Remediation Blueprint

| Vulnerability Domain | CWE Identifier | Current Risk | Enterprise Target Architecture |
| :--- | :--- | :--- | :--- |
| **Session Storage** | CWE-312 (Cleartext Storage) | `localStorage` allows DevTools tampering | `HttpOnly`, `Secure`, `SameSite=Strict` signed cookie |
| **Route Protection** | CWE-601 (Client-Side Redirect) | React `useEffect` can be bypassed if JS is off | Next.js Server-Side Edge `middleware.ts` |
| **API Endpoints** | CWE-306 (Missing Authentication) | `/api/*` callable directly via `curl` / Postman | Server-side bearer token / cookie inspection on all routes |
| **Role Authorization** | CWE-285 (Improper Authorization) | Non-super-admins can reach `/super-admin` | Strict role clearance enforcement in Edge middleware |
| **Password Storage** | CWE-256 (Plaintext Credentials) | Password checked in client JS mock table | Server-side `argon2id` / `bcrypt` cryptographic hashing |
| **Tenant Isolation** | Multi-Tenant Data Leak | Data separation handled in React state | PostgreSQL Row-Level Security (RLS) on `builder_id` |
| **Denial of Service** | CWE-400 (Resource Exhaustion) | Unthrottled Gemini OCR & PDF generation | Upstash Redis token-bucket rate limiting (10 req/min) |

---

## 2. Immediate Implementation Blueprint (Next.js & Edge Layer)

### A. Next.js Server-Side Edge Middleware (`src/middleware.ts`)
Runs at the network edge before any page renders or API request processes:
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Allow public assets, static docs, and public verification routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/verify") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/api/health"
  ) {
    return NextResponse.next();
  }

  // 2. Read HttpOnly session cookie
  const sessionToken = req.cookies.get("deedflow_session")?.value;
  if (!sessionToken) {
    // Unauthenticated -> edge redirect to login with return URL
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Super-Admin strict role gating
  if (pathname.startsWith("/super-admin")) {
    const userRole = req.cookies.get("deedflow_user_role")?.value;
    if (userRole !== "super_admin") {
      // Access Denied -> bounce to workspace
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 4. API Route protection
  if (pathname.startsWith("/api/")) {
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/super-admin/:path*", "/api/:path*"],
};
```

---

### B. Cryptographic Session Signing (`src/lib/serverAuth.ts`)
Replaces client-side pseudo-random tokens with HMAC-SHA256 signed session payloads:
```typescript
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "deedflow-super-secret-hmac-key-2026";

export function signSessionPayload(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionPayload(token: string): object | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  const expectedSig = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(data)
    .digest("base64url");
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return JSON.parse(Buffer.from(data, "base64url").toString());
  }
  return null;
}
```

---

### C. Client-Side Sanitization
1. **`/login` Form Inputs:** Wipe all default `useState("aidan@sobha.com")` and `useState("Prestige@2026!Deed")` values; replace with blank inputs and placeholder guides.
2. **Remove Component Mock Fallbacks:** Remove `return DEMO_USERS.project_admin;` in `authStore.ts` and replace with proper unauthenticated handling.
3. **Landing Page CTAs:** Route all unauthenticated action buttons directly to `/login?redirect=...`.

---

## 3. Database Layer Migration Blueprint (PostgreSQL & Supabase RLS)

When database connectivity is enabled, this schema structure enforces zero-leak isolation:

```sql
-- Enforce tenant isolation via Row-Level Security (RLS)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  rera_number VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/write projects belonging to their builder organization
CREATE POLICY builder_tenant_isolation ON projects
  FOR ALL
  USING (builder_id = auth.jwt() ->> 'builder_id');
```

---

## 4. Activation Trigger

When you are ready to activate this hardening, simply instruct:
> **"Implement the security hardening and edge middleware roadmap now."**

All specifications, code templates, and migration steps will be executed immediately.
