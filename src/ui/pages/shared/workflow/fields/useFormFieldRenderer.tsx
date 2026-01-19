import type { FieldState } from "@app/state/field";
import { NumberField } from "@ui/components/NumberField";

type RendererArgs<F extends Record<string, FieldState>> = {
  fields: F;
  fieldErrors: Partial<Record<keyof F, string>>;
  disabledMap?: Partial<Record<keyof F, boolean>>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  updateField: <K extends keyof F>(key: K, next: FieldState) => void;
  onAfterChange?: () => void;

  onFocus?: <K extends keyof F>(key: K) => void;
  onBlur?: () => void;
};

export function useFormFieldRenderer<F extends Record<string, FieldState>>({
  fields,
  fieldErrors,
  disabledMap,
  onKeyDown,
  updateField,
  onAfterChange,
  onFocus,
  onBlur,
}: RendererArgs<F>) {
  return <K extends keyof F>(
    key: K,
    label: string,
    unit?: string,
    tooltip?: string,
    autoFocus?: boolean
  ) => {
    const disabled = disabledMap?.[key];

    return (
      <div className="field">
        <NumberField
          label={label}
          field={fields[key]}
          error={fieldErrors[key]}
          unit={unit}
          tooltip={tooltip}
          autoFocus={autoFocus}
          disabled={disabled}
          onKeyDown={onKeyDown}

          onFocus={() => onFocus?.(key)}
          onBlur={() => onBlur?.()}

          onChange={next => {
            if (disabled) return;
            updateField(key, next);
            onAfterChange?.();
          }}
        />
      </div>
    );
  };
}
