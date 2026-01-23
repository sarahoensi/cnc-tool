import type { DiameterMode } from "@core/holeMachining/types";
import { holeTooltips } from "./holeTooltips";
import { ModeSelector } from "@ui/pages/shared/components/modeSelector/ModeSelector";

type Props = {
  mode: DiameterMode;
  setMode: (mode: DiameterMode) => void;
};

export function DiameterModeSelector({ mode, setMode }: Props) {
  return (
    <ModeSelector<DiameterMode>
      label="Modus"
      tooltip={holeTooltips.mode}
      value={mode}
      onChange={setMode}
      options={[
        {
          value: "ID",
          label: "Inner",
          tooltip: holeTooltips.inner,
        },
        {
          value: "OD",
          label: "Outer",
          tooltip: holeTooltips.outer,
        },
      ]}
    />
  );
}
