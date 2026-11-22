import { NextRequest, NextResponse } from "next/server";
import { generateLegalPdf } from "@/lib/pdfEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, isDraft = true, verificationHash, contentParagraphs } = body;

    const pdfBytes = await generateLegalPdf({
      title: title || "LEGAL DOCUMENT DRAFT",
      isDraft,
      verificationHash: verificationHash || `DF-${Date.now().toString(36).toUpperCase()}`,
      contentParagraphs: contentParagraphs || ["No content provided"],
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Document_Draft.pdf"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
