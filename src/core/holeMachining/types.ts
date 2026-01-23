// src/core/holeMachining/types.ts

export type DiameterMode = "ID" | "OD";
//
// PLAN INPUT TYPES
//

export interface HolePlanFromNInput {
  mode: DiameterMode;
  D_start: number;
  D_target: number;
  N: number;
}

export interface HolePlanFromAeInput {
  mode: DiameterMode;
  D_start: number;
  D_target: number;
  ae: number;
}

export interface HolePlanFromNoStartInput {
  mode: DiameterMode;
  D_target: number;
  N: number;
  ae: number;
}

//
// PLAN RESULT
//

export interface HolePlan {
  mode: DiameterMode;
  D_start: number;
  D_target: number;
  N: number;

  diameters: number[];  // N+1 verdier inkludert start og target
  //deltaD: number;       // nominell
  deltaProgress: number,
  ae: number;           // nominell radialt inngrep = deltaD/2
}

//
// EXECUTION STATE
//

export interface HoleLogEntry {
  step: number;      // 1..N
  startDiameter: number; // diameter ved start av steget
  measured: number;  // MÅLT Ø
  //deltaD: number;    // faktisk diameterøkning dette steget
  deltaProgress: number,
  deltaDiameter: number;
  ae: number;        // faktisk radialt inngrep dette steget
}

export interface HoleExecutionState {
  mode: DiameterMode;

  D_start: number;
  D_target: number;
  N: number;

  step: number;        // hvor mange steg som er fullført (0..N)
  lastDiameter: number;
  finished: boolean;

  log: HoleLogEntry[];
}

//
// NEXT TARGET INFO
//

export interface NextTargetInfo {
  startDiameter: number; // diameter ved start av neste steg
  nextDiameter: number; // diameter brukeren skal prøve å oppnå
  //deltaD: number;       // økning fra lastDiameter → nextDiameter
  deltaProgress: number;
  deltaDiameter: number;
  
  ae: number;           // deltaD / 2
}
