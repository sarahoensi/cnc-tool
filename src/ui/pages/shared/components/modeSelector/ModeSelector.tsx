import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";

type RadioOption<T extends string> = {
  value: T;
  label: string;
  tooltip?: string;
};

type Props<T extends string> = {
  label: string;
  tooltip?: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
};

export function ModeSelector<T extends string>({
  label,
  tooltip,
  value,
  onChange,
  options,
}: Props<T>) {
  return (
    <div className="field number-field">
      <label className="nf-label">
        <LabelWithTooltip label={label} tooltip={tooltip} />
      </label>

      <div className="nf-radio-group">
        {options.map((option) => (
          <label key={option.value} className="nf-radio-option">
            <input
              type="radio"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <LabelWithTooltip
              label={option.label}
              tooltip={option.tooltip}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
