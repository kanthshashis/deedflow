---
name: build-core
description: Scaffolds and verifies core Next.js 15 application, Tailwind institutional theme, deterministic Indian currency converter, and smart legal grammar engine.
---

# Core Framework & Domain Engines Skill (`/build-core`)

Use this skill to scaffold the Next.js 15 App Router architecture, institutional UI design system, and deterministic legal/financial computation libraries.

## 1. Institutional Design System Tokens
DeedFlow rejects generic consumer AI gradients (no purple/pink glows). It adheres strictly to institutional financial aesthetics (Stripe + Linear):
- **Canvas / Background:** `#F8FAFC` (Slate 50)
- **Card Surfaces:** `#FFFFFF` with `1px solid #E2E8F0` border and `0 1px 3px 0 rgb(0 0 0 / 0.05)` subtle elevation
- **Obsidian Action Buttons:** `#0F172A` (Slate 900) hover `#1E293B`
- **Legal Accent & Focus:** `#1E3A8A` (Deep Royal Navy 900) and `#2563EB` (Blue 600)
- **Status Accents:** `#059669` (Allotted/Verified Emerald), `#D97706` (Draft/Reserved Amber), `#DC2626` (Blocked/Error Rose)
- **Typography:**
  - UI & Controls: `Plus Jakarta Sans` or `Inter`
  - Legal Previews & Deed Drafts: `Source Serif 4` or `Merriweather`
  - Financials, Area Units & Hashes: `JetBrains Mono`

## 2. Deterministic Indian Currency Converter (`src/lib/indianCurrencyToWords.ts`)
Must **never** use an LLM for number-to-words conversion. Must handle standard Indian notation:
```typescript
export function convertIndianCurrencyToWords(amount: number): string {
  // Converts 350000 -> "Rupees Three Lakhs Fifty Thousand Only"
  // Converts 12550000.50 -> "Rupees One Crore Twenty Five Lakhs Fifty Thousand and Fifty Paise Only"
  // Handles zero, negative, decimal paise, and crore/lakh grouping
}
```

## 3. Multi-Party Smart Legal Grammar Engine (`src/lib/smartGrammar.ts`)
Dynamically conjugates legal deeds based on entity type:
- **Sole Individual (Male/Female):** "the Allottee", "his/her heirs, executors, and administrators"
- **Joint Co-Buyers (Husband & Wife / Siblings):** "the Allottees", "their respective heirs, executors, and administrators", "jointly and severally"
- **Company / LLP:** "the Allottee, acting through its Authorized Signatory by virtue of Board Resolution dated...", "its successors-in-interest"
- **NRI via Power of Attorney (GPA):** "represented by his/her duly constituted Attorney holder Mr./Ms. [GPA_NAME] vide Registered GPA Document No. [GPA_DOC_NO]"
