import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";
import type { HelixMode } from "@core/helix/types";
import { helixTooltips } from "./spiralTooltips";

type Props = {
  mode: HelixMode;
  setMode: (mode: HelixMode) => void;
};

export function SpiralModeSelector({ mode, setMode }: Props) {
  return (
    <div className="field number-field">
      <label className="nf-label">
        <LabelWithTooltip
          label="Modus"
          tooltip={helixTooltips.mode}
        />
      </label>

      <div className="nf-radio-group">
  <label className="nf-radio-option">
    <input
      type="radio"
      checked={mode === "inner"}
      onChange={() => setMode("inner")}
    />
    <LabelWithTooltip label="Inner" tooltip={helixTooltips.inner} />
  </label>

  <label className="nf-radio-option">
    <input
      type="radio"
      checked={mode === "outer"}
      onChange={() => setMode("outer")}
    />
    <LabelWithTooltip label="Outer" tooltip={helixTooltips.outer} />
  </label>
</div>
    </div>
  );
}
