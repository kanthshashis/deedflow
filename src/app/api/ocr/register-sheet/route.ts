import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No register sheet file uploaded" }, { status: 400 });
    }

    // In-memory Vision OCR processing (simulated or via Gemini API)
    // Extracts structured rows from handwritten or typed site register
    const simulatedExtractedRows = [
      {
        flatNumber: "B-101",
        slotNumber: "B1-01",
        level: "Basement 1",
        slotType: "Standard Covered",
        ownerName: "Kantharaju Mariyappa",
        status: "existing_allotted",
      },
      {
        flatNumber: "B-102",
        slotNumber: "B1-02",
        level: "Basement 1",
        slotType: "Standard Covered",
        ownerName: "Deepak Rao",
        status: "new_assignment",
      },
      {
        flatNumber: "B-201",
        slotNumber: "B1-03",
        level: "Basement 1",
        slotType: "Covered EV-Ready",
        ownerName: "Sanjay Reddy",
        status: "new_assignment",
      },
      {
        flatNumber: "B-103",
        slotNumber: "B1-06",
        level: "Basement 1",
        slotType: "Tandem (Double)",
        ownerName: "Ananya Sharma",
        status: "conflict_swap_needed",
      },
    ];

    return NextResponse.json({
      success: true,
      filename: file.name,
      rows: simulatedExtractedRows,
      extractedCount: simulatedExtractedRows.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process register sheet" }, { status: 500 });
  }
}
