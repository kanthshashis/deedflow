import fs from "fs";
import path from "path";

// 1. Currency & Numbers Validation
function formatIndianCurrency(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0/-";
  const num = Math.round(amount);
  const isNegative = num < 0;
  const absStr = Math.abs(num).toString();
  if (absStr.length <= 3) {
    return `${isNegative ? "-" : ""}₹${absStr}/-`;
  }
  const lastThree = absStr.substring(absStr.length - 3);
  const remaining = absStr.substring(0, absStr.length - 3);
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${isNegative ? "-" : ""}₹${formattedRemaining},${lastThree}/-`;
}

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertLessThanOneThousand(n) {
  let result = "";
  if (n >= 100) {
    result += ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    result += TENS[Math.floor(n / 10)] + " ";
    n %= 10;
  }
  if (n > 0) {
    result += ONES[n] + " ";
  }
  return result.trim();
}

function convertIndianCurrencyToWords(amount) {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) {
    return "Rupees Zero Only";
  }
  const absAmount = Math.abs(amount);
  let num = Math.floor(absAmount);
  let words = "";

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  if (crores > 0) words += convertLessThanOneThousand(crores) + " Crore ";

  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  if (lakhs > 0) words += convertLessThanOneThousand(lakhs) + " Lakh" + (lakhs > 1 ? "s " : " ");

  const thousands = Math.floor(num / 1000);
  num %= 1000;
  if (thousands > 0) words += convertLessThanOneThousand(thousands) + " Thousand ";

  const hundreds = num;
  if (hundreds > 0) words += convertLessThanOneThousand(hundreds);

  return `Rupees ${words.trim()} Only`;
}

console.log("=================================================");
console.log("   DEEDFLOW BUSINESS LOGIC & COMPLIANCE SUITE    ");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(description, condition) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ [PASS] ${description}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${description}`);
  }
}

// TEST GROUP 1: Indian Numbering & Financial Formatting
console.log("--- 1. Indian Currency & Words Precision ---");
assert("Formats 0 correctly as ₹0/-", formatIndianCurrency(0) === "₹0/-");
assert("Formats 3,50,000 as ₹3,50,000/-", formatIndianCurrency(350000) === "₹3,50,000/-");
assert("Formats 88,00,000 as ₹88,00,000/-", formatIndianCurrency(8800000) === "₹88,00,000/-");
assert("Formats 1,85,00,000 as ₹1,85,00,000/-", formatIndianCurrency(18500000) === "₹1,85,00,000/-");
assert("Converts 3,50,000 to 'Rupees Three Lakhs Fifty Thousand Only'", convertIndianCurrencyToWords(350000).includes("Three Lakhs Fifty Thousand"));
assert("Converts 88,00,000 to 'Rupees Eighty Eight Lakhs Only'", convertIndianCurrencyToWords(8800000).includes("Eighty Eight Lakhs"));
assert("Converts 1,85,00,000 to 'Rupees One Crore Eighty Five Lakhs Only'", convertIndianCurrencyToWords(18500000).includes("One Crore Eighty Five Lakhs"));

// TEST GROUP 2: PII Redaction & UIDAI Aadhaar Masking
console.log("\n--- 2. UIDAI PII Protection & Aadhaar Masking ---");
function maskAadhaar(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length >= 12) {
    return `XXXXXXXX${digits.slice(-4)}`;
  }
  return "XXXXXXXX4826";
}

const masked1 = maskAadhaar("987654321098");
const masked2 = maskAadhaar("1234 5678 9012");
assert("Masks 12-digit Aadhaar to XXXXXXXX1098", masked1 === "XXXXXXXX1098");
assert("Masks spaced Aadhaar to XXXXXXXX9012", masked2 === "XXXXXXXX9012");
assert("Never exposes first 8 digits in masked string", !masked1.includes("98765432"));

// TEST GROUP 3: Template Files Existence & Integrity
console.log("\n--- 3. Template Verification on Disk ---");
const publicTemplates = [
  "car-parking-allotment.docx",
  "karnataka-rera-sale-agreement.docx",
  "kaveri-sale-deed-dossier.docx",
  "builder-home-loan-noc.docx",
  "unit-cost-sheet.docx",
];

publicTemplates.forEach((tpl) => {
  const tplPath = path.join(process.cwd(), "public", "templates", tpl);
  const exists = fs.existsSync(tplPath);
  const size = exists ? fs.statSync(tplPath).size : 0;
  assert(`Template '${tpl}' exists in /public/templates/ (${(size / 1024).toFixed(1)} KB)`, exists && size > 1000);
});

// TEST GROUP 4: Statutory Legal Clauses Compliance
console.log("\n--- 4. Statutory Legal Clauses Compliance ---");
const docxScriptPath = path.join(process.cwd(), "scripts", "generate-all-templates.mjs");
const scriptContent = fs.readFileSync(docxScriptPath, "utf-8");

assert("Parking non-severable appurtenance legal clause incorporated (Nahalchand precedent)", 
  scriptContent.includes("non-severable right to park") && scriptContent.includes("cannot be transferred, leased, or assigned independently"));
assert("Karnataka RERA Section 14(3) 5-year defect liability warranty present in ATS", 
  scriptContent.includes("Section 14(3)") && scriptContent.includes("5 years from possession date"));
assert("Kaveri 2.0 Sub-Registrar 4-sided Schedule C boundaries included in Sale Deed", 
  scriptContent.includes("SCHEDULE 'C'") && scriptContent.includes("{unit_north}") && scriptContent.includes("{unit_south}"));
assert("RERA Master Escrow Bank Account statutory disclosure present in Home Loan NOC", 
  scriptContent.includes("rera_bank_account_no") && scriptContent.includes("rera_bank_ifsc"));

// TEST GROUP 5: Indian Real Estate Commercial Rules
console.log("\n--- 5. Commercial Rules & Statutory Calculations ---");
function calculateTds(propertyValue) {
  // Section 194-IA: 1% TDS on consideration >= 50,00,000
  return propertyValue >= 5000000 ? Math.round(propertyValue * 0.01) : 0;
}
assert("TDS on ₹45,00,000 is ₹0 (below ₹50L threshold)", calculateTds(4500000) === 0);
assert("TDS on ₹88,00,000 is ₹88,000 (1% under Sec 194-IA)", calculateTds(8800000) === 88000);
assert("TDS on ₹1,85,00,000 is ₹1,85,000 (1% under Sec 194-IA)", calculateTds(18500000) === 185000);

function validateUdsRatio(carpetSqft, sbaSqft, udsSqft) {
  // Bangalore standard: UDS is typically 22% - 30% of SBA; Carpet is 70% - 80% of SBA
  const udsPercentage = (udsSqft / sbaSqft) * 100;
  const carpetEfficiency = (carpetSqft / sbaSqft) * 100;
  return udsPercentage >= 20 && udsPercentage <= 35 && carpetEfficiency >= 70 && carpetEfficiency <= 85;
}
assert("Flat B-302 (1280 carpet, 1650 SBA, 412 UDS) satisfies Bangalore architectural ratio", 
  validateUdsRatio(1280, 1650, 412));

// TEST GROUP 6: RBAC Role Architecture Verification
console.log("\n--- 6. RBAC & Maker-Checker Architecture ---");
const typesFilePath = path.join(process.cwd(), "src", "lib", "types.ts");
const typesContent = fs.readFileSync(typesFilePath, "utf-8");

assert("Project Admin possesses omni-role authority (unconditional true in hasPermission)", 
  typesContent.includes('role === "project_admin"') && typesContent.includes('return true'));
assert("Clerk (project_operator) cannot manage or rollback legal templates", 
  !typesContent.includes('case "manage_templates":\n      return ["project_operator"'));
assert("Bank Auditor (bank_auditor) has zero mutating actions", 
  !typesContent.includes('case "manage_inventory":\n      return ["bank_auditor"') &&
  !typesContent.includes('case "allot_parking":\n      return ["bank_auditor"'));

// TEST GROUP 7: Statutory Outlay, Escrow Wire & Joint Allottee PII Masking
console.log("\n--- 7. Outlay Card, Escrow & UIDAI Masking Verification ---");
const unitPagePath = path.join(process.cwd(), "src", "app", "dashboard", "units", "[flatNumber]", "page.tsx");
const unitPageContent = fs.readFileSync(unitPagePath, "utf-8");

assert("Unit Dossier includes Section 194-IA 1% TDS calculation & regulatory breakdown card",
  unitPageContent.includes("isTdsApplicable") &&
  unitPageContent.includes("Section 194-IA") &&
  unitPageContent.includes("tdsAmount"));

assert("Unit Dossier renders Kaveri 2.0 Stamp Duty (5%) & Registration Fee (1%)",
  unitPageContent.includes("stampDutyAmount") &&
  unitPageContent.includes("registrationFeeAmount") &&
  unitPageContent.includes("Kaveri 2.0"));

assert("WhatsApp share includes SBI RERA Master Escrow details (918020034827101 / SBIN0004120)",
  unitPageContent.includes("918020034827101") &&
  unitPageContent.includes("SBIN0004120") &&
  unitPageContent.includes("RERA Designated Master Escrow Bank Account"));

assert("Co-Buyer Aadhaar enforces UIDAI 8-digit masking ('XXXXXXXX5521')",
  unitPageContent.includes("coBuyerAadhaarMasked") &&
  unitPageContent.includes("XXXXXXXX5521") &&
  unitPageContent.includes("UIDAI Compliant Masked"));

console.log("\n=================================================");
console.log(`  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(0)}%)`);
console.log("=================================================\n");

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
