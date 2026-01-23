import type { HelixMode } from "@core/helix/types";
import { helixTooltips } from "./spiralTooltips";
import { ModeSelector } from "@ui/pages/shared/components/modeSelector/ModeSelector";

type Props = {
  mode: HelixMode;
  setMode: (mode: HelixMode) => void;
};

export function SpiralModeSelector({ mode, setMode }: Props) {
  return (
    <ModeSelector<HelixMode>
      label="Modus"
      tooltip={helixTooltips.mode}
      value={mode}
      onChange={setMode}
      options={[
        {
          value: "inner",
          label: "Inner",
          tooltip: helixTooltips.inner,
        },
        {
          value: "outer",
          label: "Outer",
          tooltip: helixTooltips.outer,
        },
      ]}
    />
  );
}
