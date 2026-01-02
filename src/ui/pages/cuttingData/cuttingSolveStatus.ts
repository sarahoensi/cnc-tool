// ui/cuttingData/cuttingSolveStatus.ts

export function getSolveStatus(av: {
  n: boolean;      // ← bruk eksisterende
  hasZ: boolean;
  hasF: boolean;
  hasFz: boolean;
}) {
  const speedReady = av.n;

  const feedReady =
    av.hasZ &&
    (av.hasF || av.hasFz) &&
    av.n;

  return {
    speedReady,
    feedReady,
    canSolve: speedReady && feedReady,
  };
}
