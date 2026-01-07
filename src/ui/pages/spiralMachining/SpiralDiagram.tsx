import "./SpiralDiagram.css";

export type ActiveSpiralPart =
  | "diameter"
  | "toolDiameter"
  | "pitch"
  | "angle"
  | null;

interface Props {
  diameter?: number;       // mm
  toolDiameter?: number;   // mm
  pitch?: number;          // mm/rev
  angle?: number;
  mode: "inner" | "outer";
  activePart: ActiveSpiralPart;
}

export function Spiral3DGuide({
  diameter,
  toolDiameter,
  pitch,
  angle,
  mode,
  activePart,
}: Props) {
  /* ===============================
     SVG RAMME
  =============================== */
  const size = 340;
  const cX = size / 2;
  const cY = size / 2 + 40;

  /* ===============================
     VISUELL MODELL (FAST)
  =============================== */
  const PART_RADIUS_VISUAL = 40;
  const PART_HEIGHT_VISUAL = 160;

  /* ===============================
     DEFAULTS (mm)
  =============================== */
  const DEFAULT_DIAMETER_MM = 40;
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
     KJERNEGEOMETRI (CNC-riktig)
     - verktøyets ytterkant = vegg
     - helix går gjennom verktøyets senter
  =============================== */
  const toolCenterR =
    mode === "inner"
      ? PART_RADIUS_VISUAL - toolR
      : PART_RADIUS_VISUAL + toolR;

  const helixR = toolCenterR; // VIKTIG: samme radius

  /* ===============================
     ISOMETRISK PROJEKSJON
  =============================== */
  const padding = 30;
  const scale = (size / 2 - padding) / PART_RADIUS_VISUAL;

  const iso = (x: number, y: number, z: number) => {
    const a = Math.PI / 6;
    const X = (x - y) * Math.cos(a);
    const Y = (x + y) * Math.sin(a) - z;
    return { x: cX + X * scale, y: cY + Y * scale };
  };

  const topRx = PART_RADIUS_VISUAL * Math.cos(Math.PI / 6) * scale;
  const topRy = PART_RADIUS_VISUAL * Math.sin(Math.PI / 6) * scale;
  const bottomCenter = iso(0, 0, PART_HEIGHT_VISUAL);

  /* ===============================
     HELIX – 100 % korrekt
     x = R cos(t)
     y = R sin(t)
     z = (pitch / 2π) * t
  =============================== */
  const buildHelixPaths = () => {
    const steps = 420;

    // Hvor mange runder som får plass i høyden
    const turnsRaw = PART_HEIGHT_VISUAL / Math.max(1, pitchVisual);
    const turns = Math.max(0.75, Math.min(6, turnsRaw));

    // FASE: styrer hvor rundt sylinderen helixen starter
    const PHASE = mode === "inner" ? -Math.PI / 2 : Math.PI / 2;

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

    return { front, back, PHASE };
  };

  const { front: helixFront, back: helixBack, PHASE } = buildHelixPaths();
  const helixActive = activePart === "pitch" || activePart === "angle";

  /* ===============================
     VERKTØY – LÅST TIL HELIX (samme fase!)
  =============================== */
  const toolHeight = PART_HEIGHT_VISUAL * 0.75;

  // NØKKELEN: samme vinkel som helixen starter på
  const toolT = PHASE;

  const toolX = Math.cos(toolT) * toolCenterR;
  const toolY = Math.sin(toolT) * toolCenterR;

  const toolTop = iso(toolX, toolY, 0);
  const toolBase = iso(toolX, toolY, toolHeight);

  const toolRx = toolR * Math.cos(Math.PI / 6) * scale;
  const toolRy = toolR * Math.sin(Math.PI / 6) * scale;

  const renderTool3D = () => {
    const active = activePart === "toolDiameter";
    return (
      <>
        <ellipse
          cx={toolTop.x}
          cy={toolTop.y}
          rx={toolRx}
          ry={toolRy}
          className={`tool-top ${active ? "active" : ""}`}
        />

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

        <ellipse
          cx={toolBase.x}
          cy={toolBase.y}
          rx={toolRx}
          ry={toolRy}
          className={`tool-bottom ${active ? "active" : ""}`}
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

      <ellipse
        cx={bottomCenter.x}
        cy={bottomCenter.y}
        rx={topRx}
        ry={topRy}
        className={`part-bottom ${partActive ? "active" : ""}`}
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
