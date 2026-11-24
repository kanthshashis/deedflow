import { NextRequest, NextResponse } from "next/server";
import { dispatchTransactionalEmail, EmailDispatchOptions } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, templateType, metadata } = body;

    if (!to || !templateType) {
      return NextResponse.json(
        { error: "Recipient email ('to') and 'templateType' are required." },
        { status: 400 }
      );
    }

    const validTemplates = ["APPROVAL_REQUEST", "BUYER_EXECUTION", "BANK_KIT_DISPATCH"];
    if (!validTemplates.includes(templateType)) {
      return NextResponse.json(
        { error: `Invalid templateType. Must be one of: ${validTemplates.join(", ")}` },
        { status: 400 }
      );
    }

    const emailOptions: EmailDispatchOptions = {
      to,
      subject: subject || `DeedFlow Notification: ${templateType}`,
      templateType,
      metadata: metadata || { unitNumber: "N/A" },
    };

    const result = await dispatchTransactionalEmail(emailOptions);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to dispatch email notification." },
      { status: 500 }
    );
  }
}
