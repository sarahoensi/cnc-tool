export type HelixMode = "inner" | "outer";

export interface HelixInput {
  mode: HelixMode;
  diameter: number;       // Hulldiameter
  toolDiameter?: number; // Påkrevd ved outer
  pitch?: number;         // mm per omdreining
  angle?: number;         // grader
};

export interface HelixSolution {
  mode: HelixMode;
  diameter: number;
  toolDiameter?: number;
  effectiveDiameter: number;
  pitch: number;
  angle: number;
};
