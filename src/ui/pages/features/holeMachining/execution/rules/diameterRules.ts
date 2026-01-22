import type { HoleExecutionState } from "@core/holeMachining";

/**
 * Regler for hvordan diameter-målinger valideres og tolkes
 * under execution.
 *
 * UI og workflow skal kun forholde seg til dette interfacet.
 */
export type DiameterRules = {
  /**
   * Returnerer grenseverdien målingen skal sammenlignes mot
   * (forrige diameter eller startdiameter).
   */
  getLimit(
    step: number,
    state: HoleExecutionState
  ): number;

  /**
   * Sjekker om målingen er gyldig i forhold til grensen.
   * (ID: >=, OD: <=)
   */
  isValid(
    value: number,
    limit: number
  ): boolean;

  /**
   * Lager feilmelding dersom målingen er ugyldig.
   */
  errorMessage(
    limit: number,
    decimals: number
  ): string;
};

/**
 * Felles hjelpefunksjon:
 * finner forrige målte diameter, eller startdiameter.
 */
export function getPreviousDiameter(
  step: number,
  state: HoleExecutionState
): number {
  const previous = state.log
    .filter(l => l.step < step)
    .sort((a, b) => b.step - a.step)[0];

  return previous ? previous.measured : state.D_start;
}
