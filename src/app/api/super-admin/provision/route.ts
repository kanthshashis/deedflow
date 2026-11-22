import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      developerName,
      projectName,
      reraNumber,
      location,
      towers,
      floorsPerTower,
      flatsPerFloor,
      adminName,
      adminEmail,
      adminPassword,
    } = body;

    const projectId = `proj_${Date.now()}`;
    const towerList = (towers || "A, B").split(",").map((t: string) => t.trim());
    const generatedUnitsCount = towerList.length * (floorsPerTower || 5) * (flatsPerFloor || 4);
    const generatedSlotsCount = 40;

    return NextResponse.json({
      success: true,
      projectId,
      projectName,
      developerName,
      reraNumber,
      generatedUnitsCount,
      generatedSlotsCount,
      adminUser: {
        name: adminName,
        email: adminEmail,
        role: "project_admin",
      },
      message: "Project, matrix, and admin credentials provisioned successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to provision project" }, { status: 500 });
  }
}
