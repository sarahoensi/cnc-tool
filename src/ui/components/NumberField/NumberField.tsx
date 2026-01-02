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

  disabled?: boolean;        // ekte disabled (f.eks. globalt)
  autoFocus?: boolean;
  inputRef?: Ref<HTMLInputElement>;

  enabled?: boolean;         // UI-policy locking
  lockedReason?: string;
  onUnlock?: () => void;
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
  enabled = true,
  lockedReason,
  onUnlock,
}: Props) {
  const isLocked = enabled === false;

  function handleUnlock() {
    if (isLocked && onUnlock) onUnlock();
  }

  return (
    <div
      className={["number-field", isLocked ? "locked" : ""].join(" ")}
      title={isLocked ? lockedReason : undefined}
      onDoubleClick={handleUnlock}
    >
      <label className={["nf-label", isLocked ? "locked" : ""].join(" ")}>
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

          // ✅ IKKE disable ved UI-lås (ellers får du ikke dblclick)
          disabled={disabled}
          readOnly={isLocked}

          onValue={(val) => onChange({ ...field, value: val })}

          className={[
            "nf-input",
            field.source,
            isLocked ? "locked" : "",
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
