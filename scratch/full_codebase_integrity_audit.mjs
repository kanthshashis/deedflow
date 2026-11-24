import fs from "fs";
import path from "path";

// Comprehensive Codebase Audit Script
// Scans all routes, buttons, links, assets, APIs, and auth gates

const srcDir = path.resolve(process.cwd(), "src");
const publicDir = path.resolve(process.cwd(), "public");

console.log("================================================================================");
console.log("DEEDFLOW AUTOMATED CODEBASE & REQUIREMENT INTEGRITY AUDIT");
console.log("================================================================================\n");

// 1. DISCOVER ALL ROUTES IN SRC/APP
function getRoutes(dir, baseRoute = "") {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("(") && entry.name.endsWith(")")) continue;
      const subRoute = baseRoute + "/" + entry.name;
      routes.push(...getRoutes(path.join(dir, entry.name), subRoute));
    } else if (entry.name === "page.tsx" || entry.name === "route.ts") {
      routes.push({
        route: baseRoute === "" ? "/" : baseRoute,
        type: entry.name === "page.tsx" ? "PAGE" : "API",
        filePath: path.join(dir, entry.name),
      });
    }
  }
  return routes;
}

const allAppRoutes = getRoutes(path.join(srcDir, "app"));
console.log(`[1] ROUTE INVENTORY: Found ${allAppRoutes.length} total endpoints`);
const pageRoutes = allAppRoutes.filter(r => r.type === "PAGE").map(r => r.route);
const apiRoutes = allAppRoutes.filter(r => r.type === "API").map(r => r.route);
console.log(`    - Page Routes: ${pageRoutes.length}`);
console.log(`    - API Routes:  ${apiRoutes.length}\n`);

// 2. SCAN ALL TSX FILES FOR LINKS, BUTTONS, ONCLICK HANDLERS
function getAllFiles(dir, exts = [".tsx", ".ts"]) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allTsxFiles = getAllFiles(srcDir, [".tsx"]);
console.log(`[2] SCANNING ${allTsxFiles.length} REACT FILES FOR DEAD LINKS, DUPLICATES, & EMPTY HANDLERS...`);

let deadLinks = [];
let emptyHandlers = [];
let pageLinkMap = {};

for (const file of allTsxFiles) {
  const relPath = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, "utf8");

  // Check for empty onClick={() => {}} or onClick={() => {}}
  const emptyOnClickMatches = content.match(/onClick=\{?\(\)\s*=>\s*\{\s*\}?\}?/g);
  if (emptyOnClickMatches) {
    emptyHandlers.push({ file: relPath, count: emptyOnClickMatches.length });
  }

  // Extract <Link href="..." and <a href="..."
  const hrefMatches = content.matchAll(/(?:href|to)=["']([^"']+)["']/g);
  for (const match of hrefMatches) {
    const target = match[1];
    if (target.startsWith("#") || target.startsWith("mailto:") || target.startsWith("tel:") || target.startsWith("http")) {
      continue;
    }

    if (!pageLinkMap[relPath]) pageLinkMap[relPath] = [];
    pageLinkMap[relPath].push(target);

    // Clean query/hash
    const cleanTarget = target.split("?")[0].split("#")[0];

    // Check if target is a static public asset
    if (cleanTarget.startsWith("/templates/") || cleanTarget.startsWith("/docs/")) {
      const publicPath = path.join(publicDir, cleanTarget);
      if (!fs.existsSync(publicPath)) {
        deadLinks.push({ file: relPath, link: target, reason: "Public asset missing on disk" });
      }
      continue;
    }

    // Check if target route matches any app route (including dynamic [flatNumber], [hash], [token])
    const matchesRoute = pageRoutes.some(pr => {
      if (pr === cleanTarget) return true;
      const regexStr = "^" + pr.replace(/\[\w+\]/g, "[^/]+") + "$";
      return new RegExp(regexStr).test(cleanTarget);
    });

    if (!matchesRoute && !cleanTarget.startsWith("/api/")) {
      deadLinks.push({ file: relPath, link: target, reason: "Destination route does not exist" });
    }
  }
}

if (deadLinks.length === 0) {
  console.log("    [PASS] Dead Links: ZERO dead links detected across all pages.");
} else {
  console.log(`    [WARN] Dead Links: ${deadLinks.length} dead link(s) found:`);
  deadLinks.forEach(d => console.log(`      - In ${d.file}: "${d.link}" (${d.reason})`));
}

if (emptyHandlers.length === 0) {
  console.log("    [PASS] Empty Handlers: ZERO empty onClick handlers detected.");
} else {
  console.log(`    [WARN] Empty Handlers: Found in ${emptyHandlers.length} file(s):`);
  emptyHandlers.forEach(h => console.log(`      - In ${h.file} (${h.count} occurrences)`));
}

// 3. AUDIT OF SPECIFIC USER WORKFLOW REQUIREMENTS
console.log("\n[3] SPECIFIC USER REQUIREMENTS INTEGRITY AUDIT:");

// A. Gemini AI Integration
const kycRouteExists = fs.existsSync(path.join(srcDir, "app/api/ocr/kyc/route.ts"));
const kycContent = kycRouteExists ? fs.readFileSync(path.join(srcDir, "app/api/ocr/kyc/route.ts"), "utf8") : "";
const hasGenAiImport = kycContent.includes("@google/genai");
const hasAadhaarMasking = kycContent.includes("XXXXXXXX");
console.log(`    A. Gemini AI KYC OCR:`);
console.log(`       - Route exists: ${kycRouteExists}`);
console.log(`       - Uses @google/genai SDK: ${hasGenAiImport}`);
console.log(`       - Has UIDAI Aadhaar Masking: ${hasAadhaarMasking}`);

// B. Supabase DB Integration
const supabaseFile = path.join(srcDir, "lib/supabaseClient.ts");
const supabaseContent = fs.existsSync(supabaseFile) ? fs.readFileSync(supabaseFile, "utf8") : "";
const hasSupabaseJs = supabaseContent.includes("@supabase/supabase-js");
const hasServiceRoleClient = supabaseContent.includes("getSupabaseAdminClient");
const seedExists = fs.existsSync(path.resolve(process.cwd(), "scripts/seed-database.sql"));
console.log(`    B. Supabase PostgreSQL Integration:`);
console.log(`       - Uses @supabase/supabase-js: ${hasSupabaseJs}`);
console.log(`       - Has Admin/Service Role client: ${hasServiceRoleClient}`);
console.log(`       - scripts/seed-database.sql present: ${seedExists}`);

// C. Email Integration
const emailFile = path.join(srcDir, "lib/emailService.ts");
const emailRoute = path.join(srcDir, "app/api/notifications/email/route.ts");
console.log(`    C. Transactional Email Integration:`);
console.log(`       - lib/emailService.ts present: ${fs.existsSync(emailFile)}`);
console.log(`       - api/notifications/email present: ${fs.existsSync(emailRoute)}`);

// D. Upload and Download & Templates
const templatesDir = path.join(publicDir, "templates");
const templateFiles = fs.existsSync(templatesDir) ? fs.readdirSync(templatesDir) : [];
console.log(`    D. Upload & Download Templates:`);
console.log(`       - Available templates: ${templateFiles.join(", ")}`);
const docxRouteExists = fs.existsSync(path.join(srcDir, "app/api/documents/generate-docx/route.ts"));
const pdfRouteExists = fs.existsSync(path.join(srcDir, "app/api/documents/generate-pdf/route.ts"));
console.log(`       - DOCX Generator Route: ${docxRouteExists}`);
console.log(`       - PDF Generator Route:  ${pdfRouteExists}`);

// E. Auth Hardening (Blank Login Inputs)
const loginFile = path.join(srcDir, "app/login/page.tsx");
const loginContent = fs.existsSync(loginFile) ? fs.readFileSync(loginFile, "utf8") : "";
const emailBlank = loginContent.includes('useState("")');
const hasNoMockFallback = !fs.readFileSync(path.join(srcDir, "lib/authStore.ts"), "utf8").includes("return DEMO_USERS");
console.log(`    E. Zero-Trust Auth Hardening:`);
console.log(`       - Blank login input defaults: ${emailBlank}`);
console.log(`       - Elimination of DEMO_USERS mock fallback in authStore: ${hasNoMockFallback}`);

// F. Landing Page Button Duplication Audit
const landingContent = fs.readFileSync(path.join(srcDir, "app/page.tsx"), "utf8");
const hasLaunchStudio = landingContent.includes("Launch Studio");
const hasSignIn = landingContent.includes("Sign In");
const hasLiveWorkstation = landingContent.includes("Launch Live Workstation");
console.log(`    F. Landing Page Button Inspection:`);
console.log(`       - Navbar has "Sign In": ${hasSignIn}`);
console.log(`       - Navbar has "Launch Studio" (DUPLICATE): ${hasLaunchStudio}`);
console.log(`       - Hero has "Launch Live Workstation" (DUPLICATE): ${hasLiveWorkstation}`);

console.log("\n================================================================================");
console.log("AUDIT SUMMARY COMPLETE");
console.log("================================================================================");
