import { ActiveTrianglePart } from "./triangleTypes";
import "./TriangleDiagram.css";

interface Props {
  activePart: ActiveTrianglePart;
  setActivePart: (p: ActiveTrianglePart) => void;
  a?: number;
  b?: number;
}

type Point = { x: number; y: number };

export function TriangleDiagram({
  activePart,
  setActivePart,
  a = 100,
  b = 80,
}: Props) {
  const isActive = (p: ActiveTrianglePart) => activePart === p;

  // =========================
  // SVG RAMME
  // =========================
  const padding = 40;
  const viewWidth = 300;
  const viewHeight = 220;

  // =========================
  // SKALERING (PROPORSJONAL)
  // =========================
  const scale = Math.min(
    (viewWidth - padding * 2) / a,
    (viewHeight - padding * 2) / b
  );

  // =========================
  // TREKANTENS PUNKTER
  // =========================
  const A: Point = { x: padding, y: viewHeight - padding };              // rett vinkel
  const B: Point = { x: padding, y: viewHeight - padding - b * scale }; // topp-venstre
  const C: Point = { x: padding + a * scale, y: viewHeight - padding }; // nede-høyre

  // =========================
  // HJELPEFUNKSJONER
  // =========================
  const vec = (from: Point, to: Point) => ({ x: to.x - from.x, y: to.y - from.y });
  const len = (v: { x: number; y: number }) => Math.hypot(v.x, v.y);
  const norm = (v: { x: number; y: number }) => {
    const l = len(v);
    return { x: v.x / l, y: v.y / l };
  };
  const mid = (p1: Point, p2: Point): Point => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  // =========================
  // MIDTPUNKTER FOR LABELS
  // =========================
  const midAB = mid(A, B);
  const midAC = mid(A, C);
  const midBC = mid(B, C);

  // =========================
  // VINKELPARAMETERE
  // =========================
  const r = 12;          // radius på vinkelbue
  const angleInset = 20; // hvor langt inn på sidene vinkelen starter
  const labelOffset = angleInset + 15; // hvor langt inn langs vinkelhalverer label plasseres

  // =========================
  // VEKTORER LANGS SIDENE
  // =========================
  const vBA = norm(vec(B, A)); // fra B ned langs b
  const vBC = norm(vec(B, C)); // fra B langs c

  const vCA = norm(vec(C, A)); // fra C langs a
  const vCB = norm(vec(C, B)); // fra C langs c

  // =========================
  // β (ved B) – start på b, slutt på c
  // =========================
  const betaStart: Point = {
    x: B.x + vBA.x * angleInset,
    y: B.y + vBA.y * angleInset,
  };

  const betaEnd: Point = {
    x: B.x + vBC.x * angleInset,
    y: B.y + vBC.y * angleInset,
  };

  // =========================
  // α (ved C) – start på a, slutt på c
  // =========================
  const alphaStart: Point = {
    x: C.x + vCA.x * angleInset,
    y: C.y + vCA.y * angleInset,
  };

  const alphaEnd: Point = {
    x: C.x + vCB.x * angleInset,
    y: C.y + vCB.y * angleInset,
  };

  // =========================
  // VINKELHALVERERE (for label-plassering)
  // =========================
  const bisectorBeta = norm({
    x: vBA.x + vBC.x,
    y: vBA.y + vBC.y,
  });

  const bisectorAlpha = norm({
    x: vCA.x + vCB.x,
    y: vCA.y + vCB.y,
  });

  return (
    <svg className="triangle-diagram" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
      {/* ================= SIDER ================= */}

      {/* a */}
      <line
        x1={A.x}
        y1={A.y}
        x2={C.x}
        y2={C.y}
        className={isActive("a") ? "active" : ""}
        onMouseEnter={() => setActivePart("a")}
        onMouseLeave={() => setActivePart(null)}
      />

      {/* b */}
      <line
        x1={A.x}
        y1={A.y}
        x2={B.x}
        y2={B.y}
        className={isActive("b") ? "active" : ""}
        onMouseEnter={() => setActivePart("b")}
        onMouseLeave={() => setActivePart(null)}
      />

      {/* c */}
      <line
        x1={B.x}
        y1={B.y}
        x2={C.x}
        y2={C.y}
        className={isActive("c") ? "active" : ""}
        onMouseEnter={() => setActivePart("c")}
        onMouseLeave={() => setActivePart(null)}
      />

      {/* ================= VINKLER ================= */}

      {/* β ved B */}
      <path
        d={`
          M ${betaStart.x} ${betaStart.y}
          A ${r} ${r} 0 0 0 ${betaEnd.x} ${betaEnd.y}
        `}
        className={isActive("beta") ? "active" : ""}
        onMouseEnter={() => setActivePart("beta")}
        onMouseLeave={() => setActivePart(null)}
      />

      {/* α ved C */}
      <path
        d={`
          M ${alphaStart.x} ${alphaStart.y}
          A ${r} ${r} 0 0 1 ${alphaEnd.x} ${alphaEnd.y}
        `}
        className={isActive("alpha") ? "active" : ""}
        onMouseEnter={() => setActivePart("alpha")}
        onMouseLeave={() => setActivePart(null)}
      />

      {/* Rett vinkel ved A */}
      <path
        d={`
          M ${A.x} ${A.y}
          L ${A.x} ${A.y - 14}
          L ${A.x + 14} ${A.y - 14}
          L ${A.x + 14} ${A.y}
        `}
        className="right-angle"
      />

      {/* ================= LABELS ================= */}

      {/* a */}
      <text
        x={midAC.x}
        y={midAC.y + 16}
        textAnchor="middle"
        className={`triangle-label ${isActive("a") ? "active-label" : ""}`}
      >
        a
      </text>

      {/* b */}
      <text
        x={midAB.x - 14}
        y={midAB.y}
        textAnchor="middle"
        className={`triangle-label ${isActive("b") ? "active-label" : ""}`}
      >
        b
      </text>

      {/* c */}
      <text
        x={midBC.x + 8}
        y={midBC.y - 8}
        textAnchor="middle"
        className={`triangle-label ${isActive("c") ? "active-label" : ""}`}
      >
        c
      </text>

      {/* β – inni trekanten, utenfor buen, langs vinkelhalverer */}
      <text
        x={B.x + bisectorBeta.x * labelOffset}
        y={B.y + bisectorBeta.y * labelOffset}
        textAnchor="middle"
        className={`triangle-label ${isActive("beta") ? "active-label" : ""}`}
      >
        β
      </text>

      {/* α – inni trekanten, utenfor buen, langs vinkelhalverer */}
      <text
        x={C.x + bisectorAlpha.x * labelOffset}
        y={C.y + bisectorAlpha.y * labelOffset}
        textAnchor="middle"
        className={`triangle-label ${isActive("alpha") ? "active-label" : ""}`}
      >
        α
      </text>
    </svg>
  );
}
