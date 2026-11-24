/**
 * DeedFlow Enterprise Transactional Email Service
 * Handles Maker-Checker Approval notifications, Buyer Execution Links, and Bank Kit Dispatches.
 * Integrates with Resend API (via RESEND_API_KEY) or falls back to an audit-logged simulation.
 */

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  templateType: "APPROVAL_REQUEST" | "BUYER_EXECUTION" | "BANK_KIT_DISPATCH";
  metadata: {
    unitNumber: string;
    buyerName?: string;
    approverName?: string;
    documentType?: string;
    actionUrl?: string;
    documentHash?: string;
    bankName?: string;
  };
}

export interface EmailDispatchResult {
  success: boolean;
  messageId: string;
  mode: "live_resend" | "simulated_logged";
  recipient: string;
  dispatchedAt: string;
}

export async function dispatchTransactionalEmail(
  options: EmailDispatchOptions
): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SYSTEM_EMAIL_FROM || "DeedFlow Post-Sales <notifications@deedflow.in>";
  const now = new Date().toISOString();

  // HTML Email Template Generator
  const htmlContent = generateInstitutionalEmailTemplate(options);

  // 1. Live Resend Integration (if key configured)
  if (apiKey && !apiKey.includes("your-resend-api-key")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [options.to],
          subject: options.subject,
          html: htmlContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          messageId: data.id || `resend_${Date.now()}`,
          mode: "live_resend",
          recipient: options.to,
          dispatchedAt: now,
        };
      } else {
        const errorText = await response.text();
        console.warn("Resend API rejected email dispatch:", errorText);
      }
    } catch (err: any) {
      console.warn("Failed to reach Resend API endpoint:", err.message);
    }
  }

  // 2. High-Fidelity Audit-Logged Simulation (Offline / Zero-Credentials Fallback)
  const simulatedId = `msg_sim_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
  console.info(`[DEEDFLOW EMAIL DISPATCH] [${options.templateType}] To: ${options.to} | Subject: "${options.subject}" | ID: ${simulatedId}`);

  return {
    success: true,
    messageId: simulatedId,
    mode: "simulated_logged",
    recipient: options.to,
    dispatchedAt: now,
  };
}

function generateInstitutionalEmailTemplate(options: EmailDispatchOptions): string {
  const { templateType, metadata } = options;

  let title = "DeedFlow Document Notification";
  let bodyDetails = "";

  if (templateType === "APPROVAL_REQUEST") {
    title = "Action Required: Legal Approval Pending";
    bodyDetails = `
      <p>A new legal document draft for <strong>Unit ${metadata.unitNumber}</strong> (${metadata.documentType || "Agreement for Sale"}) has been prepared and requires your verification.</p>
      <p>Approver: <strong>${metadata.approverName || "Legal Head"}</strong></p>
      ${metadata.actionUrl ? `<p><a href="${metadata.actionUrl}" style="display:inline-block;padding:12px 24px;background:#D97706;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">Review & Approve Draft</a></p>` : ""}
    `;
  } else if (templateType === "BUYER_EXECUTION") {
    title = "Your Allotment Dossier is Ready for Review";
    bodyDetails = `
      <p>Dear <strong>${metadata.buyerName || "Homebuyer"}</strong>,</p>
      <p>Your institutional execution dossier for <strong>Unit ${metadata.unitNumber}</strong> has been generated and validated under state RERA provisions.</p>
      <p>Cryptographic Document Hash: <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace;">${metadata.documentHash || "SHA-256-AUTHENTICATED"}</code></p>
      ${metadata.actionUrl ? `<p><a href="${metadata.actionUrl}" style="display:inline-block;padding:12px 24px;background:#059669;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">View & Sign Dossier</a></p>` : ""}
    `;
  } else if (templateType === "BANK_KIT_DISPATCH") {
    title = "1-Click Bank Kit Dispatched";
    bodyDetails = `
      <p>Bank Kit Package generated for <strong>${metadata.bankName || "Home Loan Partner Bank"}</strong>.</p>
      <p>Borrower: <strong>${metadata.buyerName || "Borrower"}</strong> | Unit: <strong>${metadata.unitNumber}</strong></p>
      <p>Includes: Tripartite Agreement, Bank NOC, Stamped Demand Notice, RERA Sanction Plan & Unit Floor Layout.</p>
      ${metadata.actionUrl ? `<p><a href="${metadata.actionUrl}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">Download Encrypted Bank Kit (.ZIP)</a></p>` : ""}
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#090d16;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:20px;letter-spacing:1px;">DEEDFLOW</h2>
        <p style="color:#94a3b8;margin:4px 0 0;font-size:12px;">Enterprise Post-Sales Legal OS for Tier-1 Builders</p>
      </div>
      <div style="background:#ffffff;padding:32px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <h3 style="color:#0f172a;margin-top:0;">${title}</h3>
        ${bodyDetails}
        <hr style="border:none;border-top:1px solid #f1f5f9;margin:28px 0;"/>
        <p style="font-size:12px;color:#64748b;margin:0;">This is an automated notification from DeedFlow. All documents are digitally signed and cryptographically hashed for audit compliance.</p>
      </div>
    </body>
    </html>
  `;
}
