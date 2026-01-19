// src/ui/components/NumberField.tsx
import "./NumberField.css";
import NumberInput from "./NumberInput";
import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";
import type { FieldState } from "@app/state";

type Props = {
  label: string;
  field: FieldState;
  onChange: (next: FieldState) => void;
  step?: string;
  type?: string;
  unit?: string;
  tooltip?: string;
  error?: string;

  disabled?: boolean;        // ekte disabled
  autoFocus?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;

  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  
};

export function NumberField({
  label,
  field,
  onChange,
  step = "any",
  type = "text",
  unit,
  tooltip,
  error,
  disabled = false,
  autoFocus,
  onKeyDown,
  onFocus,
  onBlur,
}: Props) {
  return (
    <div className="field number-field">
      <label className="nf-label">
        <LabelWithTooltip
          label={label}
          tooltip={tooltip}
        />
      </label>

      <div className="nf-input-wrapper">
        <NumberInput
          {...(type ? { type } : {})}
          step={step}
          value={field.value}
          autoFocus={autoFocus}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onValue={(val) => onChange({ ...field, value: val })}
          className={[
            "nf-input",
            field.source,
            disabled ? "disabled" : "",
            error ? "has-error" : "",
          ].join(" ")}
          onKeyDown={onKeyDown}
        />

        {unit && <span className="nf-unit">{unit}</span>}
      </div>

      {error && <div className="nf-error">{error}</div>}
    </div>
  );
}
