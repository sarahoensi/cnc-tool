// src/ui/components/NumberField.tsx
import "./NumberField.css";
import NumberInput from "./NumberInput";
import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";
import type { FieldState } from "@app/state";
import type { Ref } from "react";

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
  inputRef?: Ref<HTMLInputElement>;

  onFocus?: () => void;
  onBlur?: () => void;
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
  inputRef,
  onFocus,
  onBlur,
}: Props) {
  return (
    <div className="number-field">
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
          ref={inputRef}
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
        />

        {unit && <span className="nf-unit">{unit}</span>}
      </div>

      {error && <div className="nf-error">{error}</div>}
    </div>
  );
}
