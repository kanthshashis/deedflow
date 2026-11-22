"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import clsx from "clsx";

const FAQS = [
  {
    q: "Can we use our own company letterhead and Word formatting?",
    a: "Yes, 100%. DeedFlow does not force rigid layouts on your company. You can drag and drop your existing Microsoft Word (.docx) file into our Template Manager. Our Preflight Linter detects tags like {buyer_name} or {flat_no} and preserves your exact fonts, margins, company seals, and header graphics.",
  },
  {
    q: "How does DeedFlow comply with the Aadhaar Act and UIDAI privacy laws?",
    a: "DeedFlow enforces strict zero-retention in-memory KYC processing. Uploaded ID photos are held temporarily in volatile memory during OCR analysis and immediately destroyed in a finally block. 12-digit Aadhaar numbers are automatically masked (e.g. XXXXXXXX4826) before saving to state or database.",
  },
  {
    q: "How does this prevent parking double-allotments across concurrent sales reps?",
    a: "Our visual basement parking grid uses atomic PostgreSQL row-level locks (SELECT ... FOR UPDATE) and a composite unique constraint. If two sales reps click slot B1-04 at the exact same second, the first transaction commits and the second receives an instant conflict warning.",
  },
  {
    q: "What if our site office basement has spotty or zero Wi-Fi?",
    a: "DeedFlow includes a robust Local-First architecture. All master inventory, parking slot statuses, and draft payloads are cached in browser storage, allowing you to generate letters offline and sync back when connected.",
  },
  {
    q: "How does this help with SBI, HDFC, and ICICI Home Loan disbursements?",
    a: "Banks stall loan disbursements by 2 to 4 weeks when builder NOCs, tripartite mortgage clauses, or cost sheets have calculation typos in words. DeedFlow uses mathematically deterministic currency conversion (Rupees ... Lakhs ... Only) and pre-approved bank templates to achieve 100% first-pass legal clearance.",
  },
];

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#7D1826] font-semibold uppercase tracking-wider bg-[#FBF2F3] px-3.5 py-1 rounded-full border border-[#E8C8CC] shadow-2xs">
          <HelpCircle className="w-4 h-4 text-[#B88E3E]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24060B] tracking-tight mt-1">
          Everything Builders Ask About DeedFlow
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8DFD3] glossy-card overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-white/90 transition-colors"
              >
                <span className="font-semibold text-sm text-[#24060B]">{faq.q}</span>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-[#8C777A] shrink-0 transition-transform",
                    isOpen && "rotate-180 text-[#7D1826]"
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#5C4A4D] leading-relaxed border-t border-[#E8DFD3] pt-3.5">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
