// src/core/holeMachining/types.ts

//
// PLAN INPUT TYPES
//

export interface HolePlanFromNInput {
  D_start: number;
  D_target: number;
  N: number;
}

export interface HolePlanFromAeInput {
  D_start: number;
  D_target: number;
  ae: number;
}

export interface HolePlanFromNoStartInput {
  D_target: number;
  N: number;
  ae: number;
}

//
// PLAN RESULT
//

export interface HolePlan {
  D_start: number;
  D_target: number;
  N: number;

  diameters: number[];  // N+1 verdier inkludert start og target
  deltaD: number;       // nominell
  ae: number;           // nominell radialt inngrep = deltaD/2
}

//
// EXECUTION STATE
//

export interface HoleLogEntry {
  step: number;      // 1..N
  startDiameter: number; // diameter ved start av steget
  measured: number;  // MÅLT Ø
  deltaD: number;    // faktisk diameterøkning dette steget
  ae: number;        // faktisk radialt inngrep dette steget
}

export interface HoleExecutionState {
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
  deltaD: number;       // økning fra lastDiameter → nextDiameter
  ae: number;           // deltaD / 2
}
