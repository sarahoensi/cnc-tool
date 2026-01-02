// ui/triangleSolver/triangleSolveStatus.ts
export function getSolveStatus(av: {
  hasSide: boolean;
  hasTwoSides: boolean;
  hasAngle: boolean;
}) {
  const geometryReady = av.hasSide; // du har minst én side
  const angleReady = av.hasAngle || av.hasTwoSides; // vinkler kan utledes hvis du har 2 sider

  const canSolve = av.hasTwoSides || (av.hasSide && av.hasAngle);

  return {
    geometryReady,
    angleReady,
    canSolve,
  };
}
