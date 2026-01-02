export type HelixMode = "inner" | "outer";

export type HelixInput = {
  mode: HelixMode;
  diameter: number;       // Hulldiameter
  toolDiameter?: number; // Påkrevd ved outer
  pitch?: number;         // mm per omdreining
  angle?: number;         // grader
};

export type HelixSolution = {
  mode: HelixMode;
  diameter: number;
  toolDiameter?: number;
  effectiveDiameter: number;
  pitch: number;
  angle: number;
};

/*
// Finn vinkel fra pitch
export interface HelixFromPitchInput {
  pitch: number;        // mm per omdreining
  diameter: number;    // hull-Ø (inner) eller kontur-Ø (outer)
  toolDiameter: number;
  mode: HelixMode;
}

export interface HelixFromAngleInput {
  angleDeg: number;    // grader
  diameter: number;   // hull-Ø (inner) eller kontur-Ø (outer)
  toolDiameter: number;
  mode: HelixMode;
}

export interface HelixSolution {
  pitch: number;
  angleDeg: number;
  effectiveDiameter: number;
  mode: HelixMode;
}
  */