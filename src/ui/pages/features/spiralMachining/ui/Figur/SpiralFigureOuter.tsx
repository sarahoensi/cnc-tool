import clsx from "clsx";
import type { SpiralFields } from "../../model";
import "./spiralFigure.css";
import { SpiralFieldKey } from "../../model/spiralFields";

/* ---------------------------------------------
 * VISUELLE NØKLER (UI-only, ikke input-felter)
 * ------------------------------------------- */

type SpiralVisualKey =
  | "helix"
  | "pitch"
  | "depth";

/* ---------------------------------------------
 * PROPS
 * ------------------------------------------- */

type Props = {
  activeField?: keyof SpiralFields | null;
  disabledMap: Partial<Record<keyof SpiralFields, boolean>>;
};

/* ---------------------------------------------
 * INPUT → VISUAL MAPPING
 * ------------------------------------------- */

function mapFieldToVisualKeys(
  field?: SpiralFieldKey | null
): SpiralVisualKey[] {
  switch (field) {
    case "pitch":
      return ["pitch", "helix"];

    case "angle":
      return ["depth", "helix"];

    case "diameter":
    case "toolDiameter":
      return ["helix"];

    default:
      return [];
  }
}



/* ---------------------------------------------
 * COMPONENT
 * ------------------------------------------- */

export function SpiralFigureOuter({
  activeField,
  disabledMap,
}: Props) {
  const activeVisualKeys =
    mapFieldToVisualKeys(activeField);

  const part = (key: SpiralVisualKey) =>
    clsx(
      "spiral-part",
      activeVisualKeys.includes(key) && "active"
    );

  /* -------------------------------------------
   * VISUELLE KONSTANTER (ikke reelle mål)
   * ----------------------------------------- */

  const centerX = 120;
  const topY = 50;
  const turnHeight = 26;
  const turns = 4;
  const radiusX = 55;
  const radiusY = 12;

  return (
    <svg
      viewBox="0 0 240 260"
      className="spiral-figure"
      aria-hidden
    >
      {/* ---------------- MATERIAL ---------------- */}

      <rect
        x="40"
        y="70"
        width="160"
        height="150"
        className="material"
      />

      {/* ---------------- HELIX (BAKSIDE) ---------------- */}

      {Array.from({ length: turns }).map((_, i) => (
        <ellipse
          key={`helix-back-${i}`}
          cx={centerX}
          cy={topY + i * turnHeight}
          rx={radiusX}
          ry={radiusY}
          className="helix-back"
        />
      ))}

      {/* ---------------- HELIX (FORSIDE) ---------------- */}

      {Array.from({ length: turns }).map((_, i) => (
        <ellipse
          key={`helix-front-${i}`}
          cx={centerX}
          cy={topY + i * turnHeight + radiusY}
          rx={radiusX}
          ry={radiusY}
          className={clsx(
            "helix-front",
            part("helix")
          )}
        />
      ))}

      {/* ---------------- DEPTH (Z) ---------------- */}

      <line
        x1="190"
        y1={topY}
        x2="190"
        y2={topY + turns * turnHeight + 10}
        className={part("depth")}
      />

      <polygon
        points="186,205 194,205 190,215"
        className={part("depth")}
      />

      {/* ---------------- PITCH ---------------- */}

      <line
        x1="40"
        y1={topY + turnHeight}
        x2="40"
        y2={topY + 2 * turnHeight}
        className={part("pitch")}
      />

     
    </svg>
  );
}
