// src/core/cuttingData/types.ts

export interface CuttingDataInput  {
    D?: number;    // Verktøydiameter
    Vc?: number;    // Skjærehastighet
    F?: number;     // Matningshastighet
    z?: number;     // Antall tenner
    n?: number;    // Omdreininger per minutt
    fz?: number;   // Matning per tann
}

export interface CuttingDataSolution  {
    D?: number;    // Verktøydiameter
    Vc: number;    // Skjærehastighet
    F: number;     // Matningshastighet
    z?: number;     // Antall tenner
    n: number;    // Omdreininger per minutt
    fz: number;   // Matning per tann
}