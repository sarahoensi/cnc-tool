import TooltipIcon from "@assets/tooltip-icon.svg";
import "./LabelWithTooltip.css"

type Props = {
  label: string;
  tooltip?: string;
  className?: string;
};

export function LabelWithTooltip({
  label,
  tooltip,
  className,
}: Props) {
  return (
    <span className={["label-with-tooltip", className].join(" ")}>
      <span>{label}</span>

      {tooltip && (
        <span
          className="nf-tooltip-icon"
          title={tooltip}
          aria-label={tooltip}
        >
          <img src={TooltipIcon} alt="info" />
        </span>
      )}
    </span>
  );
}
