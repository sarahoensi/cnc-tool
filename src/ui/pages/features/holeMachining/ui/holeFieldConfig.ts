import type { HoleFields } from "../model/holeFields";
import { holeTooltips } from "./holeTooltips";

export type HoleFieldKey = keyof HoleFields;

type HoleFieldConfig = {
  key: HoleFieldKey;
  label: string;
  unit?: string;
  tooltip?: string;
  autoFocus?: boolean;
};

export const holeFieldConfig: HoleFieldConfig[] = [
  {
    key: "D_start",
    label: "Start Ø",
    unit: "mm",
    tooltip: holeTooltips.D_start,
    autoFocus: true,
  },
  {
    key: "D_target",
    label: "Target Ø",
    unit: "mm",
    tooltip: holeTooltips.D_target,
  },
  {
    key: "N",
    label: "Antall kutt",
    tooltip: holeTooltips.N,
  },
  {
    key: "ae",
    label: "Radialt inngrep",
    unit: "mm",
    tooltip: holeTooltips.ae,
  },
];
