// ui/pages/cuttingData/cuttingTooltips.ts

export const cuttingTooltips = {
  D: "Verktøyets diameter i millimeter. Brukes for å beregne sammenheng mellom skjærehastighet og turtall.",
  z: "Antall skjær (tenner) på verktøyet.",
  Vc: "Skjærehastighet langs verktøyets periferi, oppgitt i meter per minutt.",
  n: "Spindelhastighet i omdreininger per minutt (rpm).",
  F: "Total matningshastighet i mm per minutt.",
  fz: "Matning per tann. Brukes ofte i verktøydata fra leverandør.",
} as const;
