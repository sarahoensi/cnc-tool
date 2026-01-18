import type { SpiralFieldKey } from "../model/spiralFields";
import { helixTooltips } from "./spiralTooltips";

type SpiralFieldConfig = {
  key: SpiralFieldKey;
  label: string;
  unit?: string;
  tooltip?: string;
  autoFocus?: boolean;
};

export const spiralFieldConfig: SpiralFieldConfig[] = [
  {
    key: "diameter",
    label: "Diameter",
    unit: "mm",
    tooltip: helixTooltips.diameter,
    autoFocus: true,
  },
  {
    key: "toolDiameter",
    label: "Verktøydiameter",
    unit: "mm",
    tooltip: helixTooltips.toolDiameter,
  },
  {
    key: "pitch",
    label: "Pitch",
    unit: "mm/rev",
    tooltip: helixTooltips.pitch,
  },
  {
    key: "angle",
    label: "Vinkel",
    unit: "°",
    tooltip: helixTooltips.angle,
  },
];
