import "./SpiralDiagram.css";
import { ActiveSpiralPart } from "./SpiralDiagram";

interface Props {
  diameter?: number;       // mm
  toolDiameter?: number;   // mm
  pitch?: number;          // mm/rev
  angle?: number;
  activePart: ActiveSpiralPart;
}

export function SpiralDiagramOuter({
  diameter,
  toolDiameter,
  pitch,
  angle,
  activePart,
}: Props) {

  /* ===============================
     SVG RAMME
  =============================== */
  const size = 200;
  const cX = size / 2;
  const cY = size / 2 + 50;

  /* ===============================
     VISUELL MODELL (FAST)
  =============================== */
  const PART_RADIUS_VISUAL = 60;
  const PART_HEIGHT_VISUAL = 150;

  /* ===============================
     DEFAULTS (mm)
  =============================== */
  const DEFAULT_DIAMETER_MM = 20;
  const DEFAULT_TOOL_DIAMETER_MM = 10;
  const DEFAULT_PITCH_MM = 6;

  const effectiveDiameterMm =
    typeof diameter === "number" && diameter > 0
      ? diameter
      : DEFAULT_DIAMETER_MM;

  const effectiveToolDiameterMm =
    typeof toolDiameter === "number" && toolDiameter > 0
      ? toolDiameter
      : DEFAULT_TOOL_DIAMETER_MM;

  const effectivePitchMm =
    typeof pitch === "number" && pitch > 0
      ? pitch
      : DEFAULT_PITCH_MM;

  /* ===============================
     mm → VISUELL SKALA
  =============================== */
  const partRadiusMm = effectiveDiameterMm / 2;
  const mmToVisual = PART_RADIUS_VISUAL / partRadiusMm;

  const toolR = (effectiveToolDiameterMm / 2) * mmToVisual;
  const pitchVisual = effectivePitchMm * mmToVisual;

  /* ===============================
     KJERNEGEOMETRI – OUTER
     - verktøyets ytterkant = vegg
     - helix går gjennom verktøyets senter
  =============================== */
  const WALL_R = PART_RADIUS_VISUAL;
  const helixR = WALL_R + toolR;

  /* ===============================
     ISOMETRISK PROJEKSJON
  =============================== */
  const iso = (x: number, y: number, z: number) => {
    const a = Math.PI / 6;
    const X = (x - y) * Math.cos(a);
    const Y = (x + y) * Math.sin(a) - z;
    return { x: cX + X, y: cY + Y };
  };

  const topRx = PART_RADIUS_VISUAL * Math.cos(Math.PI / 6);
  const topRy = PART_RADIUS_VISUAL * Math.sin(Math.PI / 6);
  const bottomCenter = iso(0, 0, PART_HEIGHT_VISUAL);

  /* ===============================
     HELIX – OUTER
  =============================== */
  const buildHelixPaths = () => {
    const steps = 420;
    const turnsRaw = PART_HEIGHT_VISUAL / Math.max(1, pitchVisual);
    const turns = Math.max(0.75, Math.min(6, turnsRaw));

    const PHASE = Math.PI / 2; // 👈 OUTER fast

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
      const t = u * turns * Math.PI * 2 + PHASE;

      const x = Math.cos(t) * helixR;
      const y = Math.sin(t) * helixR;

      const zRaw = (pitchVisual / (2 * Math.PI)) * (t - PHASE);
      const z = Math.min(zRaw, PART_HEIGHT_VISUAL);

      const isFront = x + y > 0;
      const side: "front" | "back" = isFront ? "front" : "back";
      const sideChanged = lastSide !== null && lastSide !== side;

      if (side === "front") {
        front +=
          sideChanged || front === ""
            ? moveTo(x, y, z)
            : lineTo(x, y, z);
      } else {
        back +=
          sideChanged || back === ""
            ? moveTo(x, y, z)
            : lineTo(x, y, z);
      }

      lastSide = side;
    }

    return { front, back };
  };

  const { front: helixFront, back: helixBack } = buildHelixPaths();
  const helixActive = activePart === "pitch" || activePart === "angle";

  /* ===============================
     VERKTØY – LÅST TIL HELIX
  =============================== */
  const toolHeight = PART_HEIGHT_VISUAL * 0.75;
  const TOOL_ANGLE = Math.PI / 2; // matcher PHASE visuelt

  const toolX = Math.cos(TOOL_ANGLE) * helixR;
  const toolY = Math.sin(TOOL_ANGLE) * helixR;

  const toolTop = iso(toolX, toolY, toolHeight);
  const toolBase = iso(toolX, toolY, 0);

  const toolRx = toolR * Math.cos(Math.PI / 6);
  const toolRy = toolR * Math.sin(Math.PI / 6);

  const renderTool3D = () => {
    const active = activePart === "toolDiameter";
    return (
      <>
        {renderToolBottomSplit(active)}

        <line
          x1={toolTop.x - toolRx}
          y1={toolTop.y}
          x2={toolBase.x - toolRx}
          y2={toolBase.y}
          className={`tool-side ${active ? "active" : ""}`}
        />
        <line
          x1={toolTop.x + toolRx}
          y1={toolTop.y}
          x2={toolBase.x + toolRx}
          y2={toolBase.y}
          className={`tool-side ${active ? "active" : ""}`}
        />
      </>
    );
  };

  const renderToolBottomSplit = (active: boolean) => {
    const cx = toolBase.x;
    const cy = toolBase.y;
    const rx = toolRx;
    const ry = toolRy;

    const frontPath = `
      M ${cx + rx} ${cy}
      A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}
    `;

    const backPath = `
      M ${cx - rx} ${cy}
      A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}
    `;

    return (
      <>
        <path
          d={backPath}
          className={`tool-bottom-back ${active ? "active" : ""}`}
        />
        <path
          d={frontPath}
          className={`tool-bottom-front ${active ? "active" : ""}`}
        />
      </>
    );
  };

  /* ===============================
     PITCH-MÅL
  =============================== */
  const renderPitch = () => {
    const p1 = iso(toolX, toolY, 0);
    const p2 = iso(toolX, toolY, Math.min(pitchVisual, PART_HEIGHT_VISUAL));
    const active = activePart === "pitch";

    return (
      <>
        <line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className={`measure-line ${active ? "active" : ""}`}
        />
        <line
          x1={p1.x - 6}
          y1={p1.y}
          x2={p1.x + 6}
          y2={p1.y}
          className={`measure-line ${active ? "active" : ""}`}
        />
        <line
          x1={p2.x - 6}
          y1={p2.y}
          x2={p2.x + 6}
          y2={p2.y}
          className={`measure-line ${active ? "active" : ""}`}
        />
      </>
    );
  };

  /* ===============================
     VINKEL (VISUELL)
  =============================== */
  const renderAngle = () => {
    if (!angle || angle <= 0) return null;

    const base = iso(PART_RADIUS_VISUAL, 0, 0);
    const r = 18;

    const a1 = -Math.PI / 6;
    const a2 = a1 - (Math.min(angle, 60) * Math.PI) / 180;

    const x1 = base.x + Math.cos(a1) * r;
    const y1 = base.y + Math.sin(a1) * r;
    const x2 = base.x + Math.cos(a2) * r;
    const y2 = base.y + Math.sin(a2) * r;

    const largeArc = Math.abs(a2 - a1) > Math.PI ? 1 : 0;
    const active = activePart === "angle";

    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        className={`angle-arc ${active ? "active" : ""}`}
      />
    );
  };

  const partActive = activePart === "diameter";

  /* ===============================
     RENDER
  =============================== */
  return (
    <svg className="spiral-3d" viewBox={`0 0 ${size} ${size}`}>
      {/* HELIX – BAK */}
      <path d={helixBack} className="helix-back" />

      {/* DEL */}
      <ellipse
        cx={cX}
        cy={cY}
        rx={topRx}
        ry={topRy}
        className={`part-top ${partActive ? "active" : ""}`}
      />

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

      {/* VERKTØY */}
      {renderTool3D()}

      {/* HELIX – FRONT */}
      <path
        d={helixFront}
        className={`helix-front ${helixActive ? "active" : ""}`}
      />

      {/* MÅL */}
      {renderPitch()}
      {renderAngle()}
    </svg>
  );
}
