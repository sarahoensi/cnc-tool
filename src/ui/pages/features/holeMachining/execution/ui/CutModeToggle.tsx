// ui/CutModeToggle.tsx
type Props = {
  value: "deltaD" | "ae";
  onChange(value: "deltaD" | "ae"): void;
};

export function CutModeToggle({ value, onChange }: Props) {
  return (
    <div className="cutmode-toggle">
      <button
        className={value === "deltaD" ? "active" : ""}
        onClick={() => onChange("deltaD")}
        type="button"
      >
        ΔD
      </button>

      <button
        className={value === "ae" ? "active" : ""}
        onClick={() => onChange("ae")}
        type="button"
      >
        ae
      </button>
    </div>
  );
}
