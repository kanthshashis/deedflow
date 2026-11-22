import * as XLSX from "xlsx";
import { UnitInventory, ParkingSlot } from "./types";
import { saveAs } from "file-saver";

export interface ExcelFlatRow {
  Tower: string;
  Floor: number | string;
  Flat_Number: string;
  Unit_Type: string;
  Carpet_SqFt: number;
  SBA_SqFt: number;
  UDS_SqFt: number;
  Base_Price: number;
  Facing?: string;
  North_Boundary?: string;
  South_Boundary?: string;
  East_Boundary?: string;
  West_Boundary?: string;
  Assigned_Parking_Bay?: string;
  EV_Point_ID?: string;
}

export interface ExcelImportResult {
  success: boolean;
  units: UnitInventory[];
  parkingSlots: ParkingSlot[];
  summary: {
    totalUnits: number;
    towers: string[];
    typologyCounts: Record<string, number>;
    totalInventoryValuation: number;
    parkingBaysCount: number;
    evPointsCount: number;
  };
  errors: string[];
  warnings: string[];
}

/**
 * Generates an architectural real-world sample dataset demonstrating
 * heterogeneous towers (Tower A with 1, 2, and 3 BHKs; Tower B with 3.5 & 4 BHKs).
 */
export function getSampleApartmentSchedule(): ExcelFlatRow[] {
  const rows: ExcelFlatRow[] = [];

  // Tower A: 5 floors × 5 flats per floor (1x 1BHK, 2x 2BHK, 2x 3BHK)
  const towerASeries = [
    { type: "1 BHK Compact", carpet: 480, sba: 650, uds: 162.5, price: 4800000, facing: "East" },
    { type: "2 BHK Executive", carpet: 850, sba: 1150, uds: 287.5, price: 8800000, facing: "North" },
    { type: "2 BHK Large", carpet: 900, sba: 1220, uds: 305.0, price: 9400000, facing: "North-East" },
    { type: "3 BHK Luxury", carpet: 1280, sba: 1650, uds: 412.5, price: 12800000, facing: "East" },
    { type: "3 BHK Grand", carpet: 1350, sba: 1750, uds: 437.5, price: 13600000, facing: "West" },
  ];

  for (let floor = 1; floor <= 5; floor++) {
    towerASeries.forEach((series, idx) => {
      const flatIndex = idx + 1;
      const flatNum = `A-${floor}${flatIndex < 10 ? `0${flatIndex}` : flatIndex}`;
      const bayNum = `B1-${((floor - 1) * 5 + flatIndex).toString().padStart(2, "0")}`;
      const isEv = flatIndex === 1 || flatIndex === 4;

      rows.push({
        Tower: "Tower A",
        Floor: floor,
        Flat_Number: flatNum,
        Unit_Type: series.type,
        Carpet_SqFt: series.carpet,
        SBA_SqFt: series.sba,
        UDS_SqFt: series.uds,
        Base_Price: series.price,
        Facing: series.facing,
        North_Boundary: `Corridor / Flat A-${floor}0${Math.max(1, flatIndex - 1)}`,
        South_Boundary: `External Driveway & Landscape`,
        East_Boundary: `Common Lift Core & Lobby`,
        West_Boundary: `Clubhouse Lawn View`,
        Assigned_Parking_Bay: bayNum,
        EV_Point_ID: isEv ? `BESCOM-EV-${bayNum}` : "",
      });
    });
  }

  // Tower B: 4 floors × 4 flats per floor (2x 3.5BHK, 2x 4BHK Presidential)
  const towerBSeries = [
    { type: "3.5 BHK Royal", carpet: 1620, sba: 2100, uds: 525.0, price: 17500000, facing: "East" },
    { type: "3.5 BHK Royal", carpet: 1620, sba: 2100, uds: 525.0, price: 17500000, facing: "North" },
    { type: "4 BHK Presidential", carpet: 2050, sba: 2600, uds: 650.0, price: 23000000, facing: "North-East" },
    { type: "4 BHK Presidential", carpet: 2050, sba: 2600, uds: 650.0, price: 23000000, facing: "West" },
  ];

  for (let floor = 1; floor <= 4; floor++) {
    towerBSeries.forEach((series, idx) => {
      const flatIndex = idx + 1;
      const flatNum = `B-${floor}${flatIndex < 10 ? `0${flatIndex}` : flatIndex}`;
      const bayNum = `B2-${((floor - 1) * 4 + flatIndex).toString().padStart(2, "0")}`;
      const isEv = flatIndex % 2 === 1;

      rows.push({
        Tower: "Tower B",
        Floor: floor,
        Flat_Number: flatNum,
        Unit_Type: series.type,
        Carpet_SqFt: series.carpet,
        SBA_SqFt: series.sba,
        UDS_SqFt: series.uds,
        Base_Price: series.price,
        Facing: series.facing,
        North_Boundary: `Private Lobby / Flat B-${floor}0${Math.max(1, flatIndex - 1)}`,
        South_Boundary: `Swimming Pool Vista`,
        East_Boundary: `High-Speed Passenger Lift Core`,
        West_Boundary: `Central Boulevards`,
        Assigned_Parking_Bay: bayNum,
        EV_Point_ID: isEv ? `BESCOM-EV-${bayNum}` : "",
      });
    });
  }

  return rows;
}

/**
 * Downloads a standardized Excel template (.xlsx) with pre-populated heterogeneous sample data
 */
export function downloadExcelTemplate(filename: string = "DeedFlow_Master_Apartment_Schedule_Template.xlsx") {
  const data = getSampleApartmentSchedule();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for clean readability
  worksheet["!cols"] = [
    { wch: 12 }, // Tower
    { wch: 8 },  // Floor
    { wch: 14 }, // Flat_Number
    { wch: 22 }, // Unit_Type
    { wch: 14 }, // Carpet_SqFt
    { wch: 14 }, // SBA_SqFt
    { wch: 14 }, // UDS_SqFt
    { wch: 16 }, // Base_Price
    { wch: 12 }, // Facing
    { wch: 32 }, // North_Boundary
    { wch: 32 }, // South_Boundary
    { wch: 32 }, // East_Boundary
    { wch: 32 }, // West_Boundary
    { wch: 20 }, // Assigned_Parking_Bay
    { wch: 22 }, // EV_Point_ID
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Apartment Schedule");

  // Also add instructions sheet
  const readmeData = [
    { Instruction: "DeedFlow Real Estate Apartment Matrix Template Guide", Details: "" },
    { Instruction: "1. Column Names", Details: "Keep column headers exactly as named: Tower, Floor, Flat_Number, Unit_Type, Carpet_SqFt, SBA_SqFt, UDS_SqFt, Base_Price." },
    { Instruction: "2. Heterogeneous Towers", Details: "You can specify different towers (e.g. Tower A, Tower B, Wing 1) with totally different flat counts and typologies." },
    { Instruction: "3. Areas & Norms", Details: "Carpet Area must be less than SBA. Undivided share (UDS) is calculated according to land share ratio." },
    { Instruction: "4. Parking & EV", Details: "Assigned_Parking_Bay e.g. B1-05. If EV_Point_ID is provided (e.g. BESCOM-EV-B1-05), DeedFlow flags it as a dedicated EV charging bay." },
  ];
  const readmeSheet = XLSX.utils.json_to_sheet(readmeData);
  readmeSheet["!cols"] = [{ wch: 30 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, readmeSheet, "ReadMe & Instructions");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
}

/**
 * Downloads a simple CSV template (.csv)
 */
export function downloadCsvTemplate(filename: string = "DeedFlow_Apartment_Schedule_Template.csv") {
  const data = getSampleApartmentSchedule();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}

/**
 * Parses an uploaded Excel or CSV File buffer into typed UnitInventory and ParkingSlot records.
 */
export async function parseExcelApartmentFile(
  file: File,
  projectId: string
): Promise<ExcelImportResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<any>(worksheet);

    if (!rawRows || rawRows.length === 0) {
      return {
        success: false,
        units: [],
        parkingSlots: [],
        summary: {
          totalUnits: 0,
          towers: [],
          typologyCounts: {},
          totalInventoryValuation: 0,
          parkingBaysCount: 0,
          evPointsCount: 0,
        },
        errors: ["Uploaded sheet is empty. Please check the file contents."],
        warnings: [],
      };
    }

    const units: UnitInventory[] = [];
    const parkingMap = new Map<string, ParkingSlot>();
    const seenFlatNumbers = new Set<string>();
    const towersSet = new Set<string>();
    const typologyCounts: Record<string, number> = {};
    let totalValuation = 0;
    let evCount = 0;

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 2; // Accounting for 1-based header row

      const flatNumber = String(row.Flat_Number || row.flat_number || row["Flat No"] || "").trim();
      const tower = String(row.Tower || row.tower || "Tower A").trim();
      const floorNumber = Number(row.Floor || row.floor || 1);
      const unitType = String(row.Unit_Type || row.unit_type || row.Type || "3BHK").trim();
      const carpetSqft = Number(row.Carpet_SqFt || row.carpet_sqft || row.Carpet || 0);
      const sbaSqft = Number(row.SBA_SqFt || row.sba_sqft || row.SBA || 0);
      const udsSqft = Number(row.UDS_SqFt || row.uds_sqft || row.UDS || 0);
      const basePrice = Number(row.Base_Price || row.base_price || row.Price || 0);
      const north = String(row.North_Boundary || row.north || "Corridor / Internal Driveway").trim();
      const south = String(row.South_Boundary || row.south || "Open Landscape Garden").trim();
      const east = String(row.East_Boundary || row.east || "Common Lobby Core").trim();
      const west = String(row.West_Boundary || row.west || "Boulevard View").trim();
      const parkingBay = String(row.Assigned_Parking_Bay || row.parking || "").trim();
      const evPoint = String(row.EV_Point_ID || row.ev_point || "").trim();

      if (!flatNumber) {
        errors.push(`Row ${rowNum}: Missing 'Flat_Number'.`);
        return;
      }

      if (seenFlatNumbers.has(flatNumber.toUpperCase())) {
        errors.push(`Row ${rowNum}: Duplicate flat number '${flatNumber}' detected.`);
        return;
      }
      seenFlatNumbers.add(flatNumber.toUpperCase());
      towersSet.add(tower);

      if (sbaSqft <= 0) {
        warnings.push(`Row ${rowNum} (Flat ${flatNumber}): Super Built-Up Area is 0 or negative.`);
      }

      if (carpetSqft >= sbaSqft && sbaSqft > 0) {
        warnings.push(`Row ${rowNum} (Flat ${flatNumber}): Carpet area (${carpetSqft}) should typically be 70-80% of SBA (${sbaSqft}).`);
      }

      // Track summary metrics
      typologyCounts[unitType] = (typologyCounts[unitType] || 0) + 1;
      totalValuation += basePrice;

      // Unit record
      units.push({
        id: `unit_${projectId}_${idx + 1}`,
        flatNumber,
        tower,
        floorNumber,
        unitType,
        carpetAreaSqFt: carpetSqft,
        superBuiltUpAreaSqFt: sbaSqft,
        undividedShareLandSqFt: udsSqft,
        northBoundary: north,
        southBoundary: south,
        eastBoundary: east,
        westBoundary: west,
        basePrice,
        status: "available",
      });

      // Parking bay assignment if specified
      if (parkingBay) {
        const isEv = Boolean(evPoint);
        if (isEv) evCount++;

        const level = parkingBay.toUpperCase().startsWith("B2")
          ? "Basement 2"
          : "Basement 1";

        parkingMap.set(parkingBay, {
          id: `slot_${projectId}_${parkingBay}`,
          slotNumber: parkingBay,
          level,
          slotType: isEv ? "Covered EV-Ready" : "Standard Covered",
          status: "allotted",
          allottedUnitFlat: flatNumber,
          evPointId: isEv ? evPoint : undefined,
          evMeterNumber: isEv ? `MTR-${evPoint}` : undefined,
          evPowerKw: isEv ? 7.4 : undefined,
          evConnectorType: isEv ? "Type-2 AC Fast" : undefined,
        });
      }
    });

    return {
      success: errors.length === 0,
      units,
      parkingSlots: Array.from(parkingMap.values()),
      summary: {
        totalUnits: units.length,
        towers: Array.from(towersSet),
        typologyCounts,
        totalInventoryValuation: totalValuation,
        parkingBaysCount: parkingMap.size,
        evPointsCount: evCount,
      },
      errors,
      warnings,
    };
  } catch (err: any) {
    return {
      success: false,
      units: [],
      parkingSlots: [],
      summary: {
        totalUnits: 0,
        towers: [],
        typologyCounts: {},
        totalInventoryValuation: 0,
        parkingBaysCount: 0,
        evPointsCount: 0,
      },
      errors: [`Failed to parse Excel file: ${err.message || String(err)}`],
      warnings: [],
    };
  }
}

/**
 * Exports existing inventory into an Excel spreadsheet (.xlsx) for builder handover
 */
export function exportInventoryToExcel(
  units: UnitInventory[],
  parkingSlots: ParkingSlot[],
  projectName: string
) {
  const parkingSlotMap = new Map<string, ParkingSlot>();
  parkingSlots.forEach((s) => {
    if (s.allottedUnitFlat) {
      parkingSlotMap.set(s.allottedUnitFlat.toUpperCase(), s);
    }
  });

  const exportRows = units.map((u) => {
    const slot = parkingSlotMap.get(u.flatNumber.toUpperCase());
    return {
      Tower: u.tower,
      Floor: u.floorNumber,
      Flat_Number: u.flatNumber,
      Unit_Type: u.unitType,
      Carpet_SqFt: u.carpetAreaSqFt,
      SBA_SqFt: u.superBuiltUpAreaSqFt,
      UDS_SqFt: u.undividedShareLandSqFt,
      Base_Price: u.basePrice,
      North_Boundary: u.northBoundary,
      South_Boundary: u.southBoundary,
      East_Boundary: u.eastBoundary,
      West_Boundary: u.westBoundary,
      Assigned_Parking_Bay: slot ? slot.slotNumber : "",
      EV_Point_ID: slot?.evPointId || "",
      Status: u.status,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Master Flat Schedule");

  const cleanFilename = `${projectName.replace(/[^a-zA-Z0-9]/g, "_")}_Master_Schedule.xlsx`;
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, cleanFilename);
}
