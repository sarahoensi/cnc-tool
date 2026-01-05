// src/ui/components/NumberField.tsx
import "./NumberField.css";
import NumberInput from "./NumberInput";
import TooltipIcon from "@assets/tooltip-icon.svg";
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
}: Props) {
  return (
    <div className="number-field">
      <label className="nf-label">
        {label}
        {tooltip && (
          <span className="nf-tooltip-icon" title={tooltip} aria-label={tooltip}>
            <img src={TooltipIcon} alt="info" />
          </span>
        )}
      </label>

      <div className="nf-input-wrapper">
        <NumberInput
          {...(type ? { type } : {})}
          step={step}
          value={field.value}
          autoFocus={autoFocus}
          ref={inputRef}
          disabled={disabled}
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
