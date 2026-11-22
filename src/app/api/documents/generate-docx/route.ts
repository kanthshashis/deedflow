import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { fillDocxTemplate } from "@/lib/docxEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateName = "car-parking-allotment.docx", templateData } = body;

    const templatePath = path.resolve(process.cwd(), "public/templates", templateName);

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: `Template '${templateName}' not found.` }, { status: 404 });
    }

    const templateBuffer = fs.readFileSync(templatePath);
    const filledBuffer = fillDocxTemplate(templateBuffer, templateData);

    return new NextResponse(new Uint8Array(filledBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Generated_${templateName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
