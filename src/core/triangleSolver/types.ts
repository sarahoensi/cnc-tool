// src/core/triangleSolver/types.ts

/** Input til rettvinklet trekant-løseren. Alle felter er valgfrie. */
export interface TriangleSolverInput {
  a?: number;      // katet mot vinkel α
  b?: number;      // katet mot vinkel β
  c?: number;      // hypotenus (brukes ikke som input i dagens versjon)
  alpha?: number;  // vinkel ved a (grader)
  beta?: number;   // vinkel ved b (grader)
}

/** Fullt løst rettvinklet trekant. Alle felter er satt. */
export interface TriangleSolverSolution {
  a: number;
  b: number;
  c: number;
  alpha: number;   // grader
  beta: number;    // grader
}
