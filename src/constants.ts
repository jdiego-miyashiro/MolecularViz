import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CPK Coloring (Corey-Pauling-Koltun)
export const ELEMENT_COLORS: Record<string, string> = {
  H: "#FFFFFF", // Hydrogen - White
  C: "#909090", // Carbon - Gray/Black (Standard is black, but gray works better in dark/light modes)
  N: "#3050F8", // Nitrogen - Blue
  O: "#FF0D0D", // Oxygen - Red
  F: "#90E050", // Fluorine - Green
  CL: "#1FF01F", // Chlorine - Green
  BR: "#A62929", // Bromine - Dark Red
  I: "#940094", // Iodine - Violet
  HE: "#4FFFFF", // Helium - Cyan
  NE: "#B3E3F5", // Neon - Cyan
  AR: "#80D1E3", // Argon - Cyan
  KR: "#5CB8D1", // Krypton - Cyan
  XE: "#429EB0", // Xenon - Cyan
  P: "#FF8000", // Phosphorus - Orange
  S: "#FFFF30", // Sulfur - Yellow
  B: "#FFB5B5", // Boron - Pinkish
  LI: "#CC80FF", // Lithium - Purple
  NA: "#AB5CF2", // Sodium - Purple
  K: "#8F40D4", // Potassium - Purple
  RB: "#3D2E4D", // Rubidium - Purple
  CS: "#57178F", // Cesium - Purple
  FR: "#420066", // Francium - Purple
  BE: "#C2FF00", // Beryllium - Dark Green
  MG: "#8AFF00", // Magnesium - Dark Green
  CA: "#3DFF00", // Calcium - Dark Green
  SR: "#00FF00", // Strontium - Dark Green
  BA: "#00C900", // Barium - Dark Green
  RA: "#007D00", // Radium - Dark Green
  TI: "#757575", // Titanium - Gray
  FE: "#E06633", // Iron - Orange
  DEFAULT: "#FF00FF", // Magenta for unknown
};

export const ELEMENT_RADII: Record<string, number> = {
  H: 0.3,
  C: 0.77,
  N: 0.75,
  O: 0.73,
  F: 0.71,
  CL: 0.99,
  BR: 1.14,
  I: 1.33,
  P: 1.06,
  S: 1.02,
  DEFAULT: 0.8,
};

export interface Atom {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
}

export interface Bond {
  source: Atom;
  target: Atom;
}

export interface MoleculeData {
  atoms: Atom[];
  bonds: Bond[];
  comment?: string;
}
