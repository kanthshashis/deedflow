---
name: add-billing
description: Implements the builder launch partner free beta banner, usage metering, and dormant Razorpay checkout plumbing ready for instant activation.
---

# Billing Architecture & Launch Partner Gating (`/add-billing`)

Use this skill to configure billing options, payment plumbing, and user access state.

## 1. Tactical Philosophy: "Free Beta First, Price Later"
To eliminate sales friction during customer discovery and validation:
- The app defaults to **"Founding Builder Beta Program — 100% Free Full Access"**.
- Displays an institutional badge in the navigation: `Launch Partner Access — Unlimited Generation`.
- Generates zero payment popups or blockers during the first 30 days of builder testing.

## 2. Dormant Razorpay Plumbing (`src/app/api/billing/`)
- Pre-built routes ready to activate via environment variable `ENABLE_PAYMENTS=true`:
  - `POST /api/billing/create-order`: Initializes Razorpay order in INR (`amount` in paise).
  - `POST /api/billing/verify-payment`: Verifies HMAC SHA256 signature against `RAZORPAY_KEY_SECRET`.
- Supported Plan Tiers:
  - **Single Tower Starter:** ₹2,999 / month (Up to 60 units, 1 project, basic templates)
  - **Builder Pro:** ₹7,999 / month (Unlimited units, multi-project, custom template linter, priority OCR)
  - **Per-Disbursement Pay-As-You-Go:** ₹499 per funded bank disbursement dossier

## 3. Usage Metering in Background
- Silently counts document generations per organization in `localStorage` or PostgreSQL:
  - `documents_generated_count`
  - `kyc_extractions_count`
  - `bank_kits_downloaded_count`
- When a builder crosses 20 generations, the app triggers a gentle prompt:  
  *"You've saved your team 5+ hours this week! Would you like to lock in the Founding Partner annual rate of ₹24,999/year?"*
