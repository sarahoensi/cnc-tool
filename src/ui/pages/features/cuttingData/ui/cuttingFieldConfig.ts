import type { CuttingFields } from "../model/cuttingFields";
import { cuttingTooltips } from "./cuttingTooltips";

export type CuttingFieldConfig = {
  key: keyof CuttingFields;
  label: string;
  unit?: string;
  tooltip?: string;
  autoFocus?: boolean;
};

export const cuttingFieldConfig: CuttingFieldConfig[] = [
  {
    key: "D",
    label: "Verktøydiameter D",
    unit: "mm",
    tooltip: cuttingTooltips.D,
    autoFocus: true, // første og viktigste felt
  },
  {
    key: "z",
    label: "Antall tenner z",
    tooltip: cuttingTooltips.z,
  },
  {
    key: "Vc",
    label: "Skjærehastighet Vc",
    unit: "m/min",
    tooltip: cuttingTooltips.Vc,
  },
  {
    key: "n",
    label: "Omdreininger n",
    unit: "rpm",
    tooltip: cuttingTooltips.n,
  },
  {
    key: "F",
    label: "Matning F",
    unit: "mm/min",
    tooltip: cuttingTooltips.F,
  },
  {
    key: "fz",
    label: "Matning per tann fz",
    unit: "mm/tann",
    tooltip: cuttingTooltips.fz,
  },
];
