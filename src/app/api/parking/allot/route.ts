import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slotNumber, flatNumber, currentSlotStatus } = body;

    if (!slotNumber || !flatNumber) {
      return NextResponse.json(
        { error: "slotNumber and flatNumber are required" },
        { status: 400 }
      );
    }

    // Atomic race-condition check (Simulating SELECT ... FOR UPDATE)
    if (currentSlotStatus === "allotted") {
      return NextResponse.json(
        {
          error: `Double Allotment Conflict: Slot ${slotNumber} is already allotted to another unit.`,
          code: "SLOT_ALREADY_ALLOTTED",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Parking Bay ${slotNumber} successfully locked and allotted to Flat ${flatNumber}.`,
      allotment: {
        slotNumber,
        flatNumber,
        timestamp: new Date().toISOString(),
        status: "allotted",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
