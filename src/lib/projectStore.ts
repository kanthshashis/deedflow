import { ProjectMetadata, UnitInventory, ParkingSlot, MatrixConfig, UnitTypology } from "./types";
import { MOCK_PROJECTS } from "./mockData";

const PROJECTS_STORAGE_KEY = "deedflow_projects_store";
const ACTIVE_PROJECT_KEY = "deedflow_active_project_id";

export const DEFAULT_TYPOLOGIES: UnitTypology[] = [
  {
    id: "typ_2bhk",
    name: "2 BHK Executive",
    type: "2BHK",
    carpetSqft: 850,
    sbaSqft: 1150,
    udsSqft: 287.5,
    basePrice: 8800000,
  },
  {
    id: "typ_3bhk",
    name: "3 BHK Luxury",
    type: "3BHK",
    carpetSqft: 1280,
    sbaSqft: 1650,
    udsSqft: 412.5,
    basePrice: 12800000,
  },
  {
    id: "typ_4bhk",
    name: "4 BHK Presidential",
    type: "4BHK",
    carpetSqft: 1850,
    sbaSqft: 2400,
    udsSqft: 580.0,
    basePrice: 19500000,
  },
];

/**
 * Retrieve all configured projects from storage or default seeds
 */
export function getStoredProjects(): ProjectMetadata[] {
  if (typeof window === "undefined") {
    return MOCK_PROJECTS;
  }

  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(MOCK_PROJECTS));
      return MOCK_PROJECTS;
    }
    const parsed = JSON.parse(raw) as ProjectMetadata[];
    return parsed.length > 0 ? parsed : MOCK_PROJECTS;
  } catch {
    return MOCK_PROJECTS;
  }
}

/**
 * Persist or update a project record in local storage
 */
export function saveStoredProject(project: ProjectMetadata): ProjectMetadata[] {
  if (typeof window === "undefined") return [project];

  const existing = getStoredProjects();
  const index = existing.findIndex((p) => p.id === project.id);
  let updated: ProjectMetadata[];

  if (index >= 0) {
    updated = [...existing];
    updated[index] = project;
  } else {
    updated = [project, ...existing];
  }

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("deedflow_projects_changed"));
  return updated;
}

/**
 * Toggle project status between active and suspended
 */
export function toggleStoredProjectStatus(id: string): ProjectMetadata[] {
  if (typeof window === "undefined") return MOCK_PROJECTS;

  const existing = getStoredProjects();
  const updated = existing.map((p) =>
    p.id === id
      ? { ...p, status: p.status === "active" ? ("suspended" as const) : ("active" as const) }
      : p
  );

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("deedflow_projects_changed"));
  return updated;
}

/**
 * Get the currently active project
 */
export function getActiveProject(): ProjectMetadata {
  const projects = getStoredProjects();
  if (typeof window === "undefined") return projects[0];

  const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
  if (activeId) {
    const found = projects.find((p) => p.id === activeId);
    if (found) return found;
  }

  return projects[0];
}

/**
 * Switch active project
 */
export function setActiveProjectId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  window.dispatchEvent(new Event("deedflow_project_changed"));
}

/**
 * Generates flat numbers based on selected numbering scheme
 */
export function formatFlatNumber(
  tower: string,
  floor: number,
  flatIndex: number,
  scheme: MatrixConfig["numberingScheme"]
): string {
  const flatPad2 = flatIndex < 10 ? `0${flatIndex}` : `${flatIndex}`;

  switch (scheme) {
    case "tower_floor_flat":
      // e.g. B-101, B-204, B-1201
      return `${tower}-${floor}${flatPad2}`;
    case "tower_padded_flat":
      // e.g. B-0101, B-1204
      const floorPad2 = floor < 10 ? `0${floor}` : `${floor}`;
      return `${tower}-${floorPad2}${flatPad2}`;
    case "floor_flat":
      // e.g. 101, 204, 1201
      return `${floor}${flatPad2}`;
    default:
      return `${tower}-${floor}${flatPad2}`;
  }
}

/**
 * Generates full typed Unit Inventory and Parking Slots based on Super Admin matrix config
 */
export function generateMatrixInventory(
  project: ProjectMetadata,
  config: MatrixConfig
): { units: UnitInventory[]; parkingSlots: ParkingSlot[] } {
  const units: UnitInventory[] = [];
  const typologies = config.typologies.length > 0 ? config.typologies : DEFAULT_TYPOLOGIES;

  let unitCounter = 1;

  for (const tower of config.towers) {
    for (let floor = 1; floor <= config.floorsPerTower; floor++) {
      for (let flatIndex = 1; flatIndex <= config.flatsPerFloor; flatIndex++) {
        // Distribute typologies sequentially across flats on a floor
        const typology = typologies[(flatIndex - 1) % typologies.length];
        const flatNumber = formatFlatNumber(tower, floor, flatIndex, config.numberingScheme);

        units.push({
          id: `unit_${project.id}_${unitCounter++}`,
          flatNumber,
          tower: `Tower ${tower}`,
          floorNumber: floor,
          unitType: typology.type,
          carpetAreaSqFt: typology.carpetSqft,
          superBuiltUpAreaSqFt: typology.sbaSqft,
          undividedShareLandSqFt: typology.udsSqft,
          northBoundary: `Corridor / Flat ${formatFlatNumber(tower, floor, Math.max(1, flatIndex - 1), config.numberingScheme)}`,
          southBoundary: `External Open Space / Driveway`,
          eastBoundary: `Common Lift Lobby & Staircase`,
          westBoundary: `External Landscape Gardens`,
          basePrice: typology.basePrice,
          status: "available",
        });
      }
    }
  }

  // Generate Parking Slots
  const parkingSlots: ParkingSlot[] = [];
  let slotCounter = 1;

  for (const levelStr of config.basementLevels) {
    const levelName =
      levelStr === "B1"
        ? ("Basement 1" as const)
        : levelStr === "B2"
        ? ("Basement 2" as const)
        : ("Basement 1" as const);

    for (let i = 1; i <= config.slotsPerLevel; i++) {
      const isEv = config.evSlotFrequency > 0 && i % config.evSlotFrequency === 0;
      const slotNumStr = i < 10 ? `0${i}` : `${i}`;
      const slotNumber = `${levelStr}-${slotNumStr}`;

      parkingSlots.push({
        id: `slot_${project.id}_${slotCounter++}`,
        slotNumber,
        level: levelName,
        slotType: isEv ? "Covered EV-Ready" : "Standard Covered",
        status: "available",
      });
    }
  }

  // Cache to project-scoped storage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`deedflow_units_store_${project.id}`, JSON.stringify(units));
      localStorage.setItem(`deedflow_parking_store_${project.id}`, JSON.stringify(parkingSlots));
    } catch (e) {
      console.warn("Could not cache inventory to localStorage:", e);
    }
  }

  return { units, parkingSlots };
}
