import clsx from "clsx";
import "./spiralFigure.css";
import { SpiralFieldKey } from "../../model";

/* ---------------------------------------------
 * PROPS
 * ------------------------------------------- */

type Props = {
  activeField?: SpiralFieldKey | null;
  disabledMap: Partial<Record<SpiralFieldKey, boolean>>;
};

/* ---------------------------------------------
 * VISUELLE NØKLER
 * ------------------------------------------- */

type VisualKey =
  | "helix"
  | "pitch"
  | "tool"
  | "hole";

/* ---------------------------------------------
 * INPUT → VISUAL MAPPING
 * ------------------------------------------- */

function mapFieldToVisualKeys(
  field?: SpiralFieldKey | null
): VisualKey[] {
  switch (field) {
    case "toolDiameter":
      return ["tool"];
    case "pitch":
      return ["pitch", "helix"];
    case "diameter":
      return ["hole"];
    default:
      return [];
  }
}

/* ---------------------------------------------
 * COMPONENT
 * ------------------------------------------- */

export function SpiralFigureInner({
  activeField,
}: Props) {
  const activeKeys = mapFieldToVisualKeys(activeField);

  const part = (key: VisualKey) =>
    clsx(
      "spiral-part",
      activeKeys.includes(key) && "active"
    );

  /* -------------------------------------------
   * VISUELLE KONSTANTER
   * ----------------------------------------- */

  const cx = 120;
  const topY = 30;
  const height = 160;

  const rx = 46;
  const ry = 14;
  const turns = 4;
  const turnHeight = height / turns;

  /* --- Tool --- */

  const toolRadius = 8;
  const toolX = cx + rx - 4;
  const toolTopY = topY - 20;
  const toolBottomY = topY + height - 4;

  return (
    <svg
      viewBox="0 0 240 220"
      className="spiral-figure"
      aria-hidden
    >
      {/* ---------------- MATERIAL ---------------- */}

      <rect
        x="20"
        y={topY}
        width="200"
        height="180"
        className="material"
      />

      <rect
        x="70"
        y={topY-1}
        width="100"
        height="160"
        className={clsx("hole", part("hole"))}
      />

      {/* ---------------- HELIX (BACK) ---------------- */}

      {(() => {
        const steps = 240;
        let back = "";
        let lastSide: "front" | "back" | null = null;

        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const t = u * turns * Math.PI * 2;

          const x = Math.cos(t) * rx;
          const y = Math.sin(t) * ry;
          const z = u * height;

          const px = cx + x;
          const py = topY + z + y * 0.5;

          const side =
            Math.sin(t) > 0 ? "front" : "back";

          if (side === "back") {
            const cmd =
              back === "" || lastSide !== "back"
                ? `M ${px} ${py}`
                : `L ${px} ${py}`;
            back += cmd;
          }

          lastSide = side;
        }

        return <path d={back} className="helix-back" />;
      })()}

      {/* ---------------- TOOL ---------------- */}

      <g className={clsx("tool", part("tool"))}>
        <rect
          x={toolX - toolRadius}
          y={toolTopY}
          width={toolRadius * 2}
          height={toolBottomY - toolTopY}
          rx={toolRadius * 0.4}
          className="tool-body"
        />

        <ellipse
          cx={toolX}
          cy={toolTopY}
          rx={toolRadius}
          ry={toolRadius / 2}
          className="tool-top"
        />

        <ellipse
          cx={toolX}
          cy={toolBottomY}
          rx={toolRadius}
          ry={toolRadius / 2}
          className="tool-bottom"
        />
      </g>

      {/* ---------------- HELIX (FRONT) ---------------- */}

      {(() => {
        const steps = 240;
        let front = "";
        let lastSide: "front" | "back" | null = null;

        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const t = u * turns * Math.PI * 2;

          const x = Math.cos(t) * rx;
          const y = Math.sin(t) * ry;
          const z = u * height;

          const px = cx + x;
          const py = topY + z + y * 0.5;

          const side =
            Math.sin(t) > 0 ? "front" : "back";

          if (side === "front") {
            const cmd =
              front === "" || lastSide !== "front"
                ? `M ${px} ${py}`
                : `L ${px} ${py}`;
            front += cmd;
          }

          lastSide = side;
        }

        return (
          <path
            d={front}
            className={clsx("helix-front", part("helix"))}
          />
        );
      })()}

      {/* ---------------- PITCH ---------------- */}

      <line
        x1="60"
        y1={topY + 20}
        x2="60"
        y2={topY + 20 + turnHeight}
        className={part("pitch")}
      />
      <line
        x1="56"
        y1={topY + 20}
        x2="64"
        y2={topY + 20}
        className={part("pitch")}
      />
      <line
        x1="56"
        y1={topY + 20 + turnHeight}
        x2="64"
        y2={topY + 20 + turnHeight}
        className={part("pitch")}
      />
    </svg>
  );
}
