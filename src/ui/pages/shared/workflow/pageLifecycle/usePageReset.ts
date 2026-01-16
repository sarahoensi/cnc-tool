import { useAppStateActions } from "@app/state";

/**
 * usePageReset:
 * Nullstiller alle persistent-state keys som starter med et gitt prefix.
 *
 * Eksempel:
 *   const resetSection = usePageReset("hole:");
 *   resetSection();
 *
 * Dette vil nullstille ALT som bruker:
 *   - hole:D_start
 *   - hole:D_target
 *   - hole:N
 *   - hole:ae
 *   - hole:measurements
 *   - hole:plan
 *   - hole:state
 *   - hole:error
 * og alt annet som i fremtiden begynner med "hole:".
 *
 * Perfekt for full nullstilling av en page.
 */
export function usePageReset(prefix: string) {
  const { clearMatching } = useAppStateActions();

  return () => {
    clearMatching(prefix);
  };
}
