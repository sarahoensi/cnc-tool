// SpiralDiagramIllustrativeInner.tsx

import { ActiveSpiralPart } from "./Diagram";

interface Props {
  activePart: ActiveSpiralPart;
}

export function SpiralDiagramIllustrativeInner({ activePart }: Props) {
  const size = 220;
  const cX = size / 2;
  const cY = size / 2 + 40;

  const PART_RADIUS = 60;
  const PART_HEIGHT = 120;
  const TOOL_RADIUS = 14;
  const TOOL_CENTER_R = PART_RADIUS - TOOL_RADIUS;

  const PITCH = 26;
  const TURNS = 3.2;

  /* ===============================
     ISOMETRISK PROJEKSJON
     =============================== */
  const iso = (x: number, y: number, z: number) => {
    const a = Math.PI / 6;
    const X = (x - y) * Math.cos(a);
    const Y = (x + y) * Math.sin(a) - z;
    return { x: cX + X, y: cY + Y };
  };

  const topRx = PART_RADIUS * Math.cos(Math.PI / 6);
  const topRy = PART_RADIUS * Math.sin(Math.PI / 6);
  const bottomCenter = iso(0, 0, PART_HEIGHT);

  /* ===============================
     HELIX (illustrativ)
     =============================== */
  const buildHelix = () => {
    const steps = 360;
    const PHASE = -Math.PI / 2;

    let front = "";
    let back = "";
    let lastSide: "front" | "back" | null = null;

    const moveTo = (x: number, y: number, z: number) => {
      const p = iso(x, y, z);
      return `M ${p.x} ${p.y}`;
    };

    const lineTo = (x: number, y: number, z: number) => {
      const p = iso(x, y, z);
      return `L ${p.x} ${p.y}`;
    };

    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const t = u * TURNS * Math.PI * 2 + PHASE;

      const x = Math.cos(t) * TOOL_CENTER_R;
      const y = Math.sin(t) * TOOL_CENTER_R;
      const z = Math.min((PITCH / (2 * Math.PI)) * (t - PHASE), PART_HEIGHT);

      const isFront = x + y > 0;
      const side: "front" | "back" = isFront ? "front" : "back";
      const sideChanged = lastSide !== null && lastSide !== side;

      if (side === "front") {
        front += sideChanged || front === "" ? moveTo(x, y, z) : lineTo(x, y, z);
      } else {
        back += sideChanged || back === "" ? moveTo(x, y, z) : lineTo(x, y, z);
      }

      lastSide = side;
    }

    return { front, back };
  };

  const { front: helixFront, back: helixBack } = buildHelix();

  const helixActive = activePart === "pitch" || activePart === "angle";
  const partActive = activePart === "diameter";
  const toolActive = activePart === "toolDiameter";

  /* ===============================
     VERKTØY (fast, pedagogisk)
     =============================== */
  const TOOL_T = Math.PI * 1.4;
  const toolX = Math.cos(TOOL_T) * TOOL_CENTER_R;
  const toolY = Math.sin(TOOL_T) * TOOL_CENTER_R;
  const toolZ = (PITCH / (2 * Math.PI)) * TOOL_T;

  const toolTop = iso(toolX, toolY, toolZ + TOOL_RADIUS * 2);
  const toolBase = iso(toolX, toolY, toolZ);

  const toolRx = TOOL_RADIUS * Math.cos(Math.PI / 6);
  const toolRy = TOOL_RADIUS * Math.sin(Math.PI / 6);

  /* ===============================
     RENDER
     =============================== */
  return (
    <svg className="spiral-3d" viewBox={`0 0 ${size} ${size}`}>
      {/* Hint */}
      <text x={10} y={18} className="label small">
        Illustrasjon – kun veiledning
      </text>

      {/* Helix bak */}
      <path d={helixBack} className="helix-back" />

      {/* Topp */}
      <ellipse
        cx={cX}
        cy={cY}
        rx={topRx}
        ry={topRy}
        className={`part-top ${partActive ? "active" : ""}`}
      />

      {/* Sider */}
      <line
        x1={cX - topRx}
        y1={cY}
        x2={bottomCenter.x - topRx}
        y2={bottomCenter.y}
        className={`part-side ${partActive ? "active" : ""}`}
      />
      <line
        x1={cX + topRx}
        y1={cY}
        x2={bottomCenter.x + topRx}
        y2={bottomCenter.y}
        className={`part-side ${partActive ? "active" : ""}`}
      />

      {/* Verktøy */}
      <path
        d={`M ${toolBase.x - toolRx} ${toolBase.y} A ${toolRx} ${toolRy} 0 0 1 ${toolBase.x + toolRx} ${toolBase.y}`}
        className={`tool-bottom-front ${toolActive ? "active" : ""}`}
      />
      <line
        x1={toolTop.x - toolRx}
        y1={toolTop.y}
        x2={toolBase.x - toolRx}
        y2={toolBase.y}
        className={`tool-side ${toolActive ? "active" : ""}`}
      />
      <line
        x1={toolTop.x + toolRx}
        y1={toolTop.y}
        x2={toolBase.x + toolRx}
        y2={toolBase.y}
        className={`tool-side ${toolActive ? "active" : ""}`}
      />

      {/* Helix front */}
      <path
        d={helixFront}
        className={`helix-front ${helixActive ? "active" : ""}`}
      />

      {/* Pitch-mål */}
      <line
        x1={toolBase.x}
        y1={toolBase.y}
        x2={toolBase.x}
        y2={toolBase.y - PITCH}
        className={`measure-line ${activePart === "pitch" ? "active" : ""}`}
      />

      {/* Vinkel – tangent */}
      <line
        x1={toolBase.x}
        y1={toolBase.y}
        x2={toolBase.x + 18}
        y2={toolBase.y - 10}
        className={`angle-arc ${activePart === "angle" ? "active" : ""}`}
      />
    </svg>
  );
}
