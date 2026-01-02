import { useEffect, useState } from "react";
import {
  CancelButton,
  RegisterButton,
  UpdateButton,
} from "@ui/components/Button/Button";
import { computeNextTarget } from "@core";
import type { HolePlan } from "@core/holeMachining";
import type { HoleExecutionState } from "@core";
import { useAutoFocusOnVisibility } from "@app/hooks/ui/useAutoFocusOnVisibility";

type Props = {
  plan: HolePlan;
  state: HoleExecutionState;
  measurements: Record<number, string>;
  setMeasurements: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onSubmit(step: number): void;
  onUpdate(step: number, value: string): void;
};

export function HoleExecutionTable({
  plan,
  state,
  measurements,
  setMeasurements,
  onSubmit,
  onUpdate,
}: Props) {
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState<string>("");

  // IMPORTANT:
  // Denne ref-en skal KUN sitte på "current step"-inputen (registrering).
  // Ikke på edit-inputen. Ellers mister du fokus-target når edit-input unmountes.
  const { ref: currentMeasurementRef, focus: focusCurrentMeasurement } =
    useAutoFocusOnVisibility<HTMLInputElement>();

  const isEditing = editingStep !== null;

  // Autofokus:
  // - når state.step endres (normal flyt)
  // - når edit-modus avsluttes (OK/Avbryt), fordi state.step ofte IKKE endres ved oppdatering
  useEffect(() => {
    if (state.finished) return;

    // Vent til DOM er oppdatert etter at editingStep er blitt null
    requestAnimationFrame(() => {
      focusCurrentMeasurement();
    });
  }, [state.step, state.finished, isEditing, focusCurrentMeasurement]);

  return (
    <table className="step-table">
      <thead>
        <tr>
          <th>Steg</th>
          <th>ΔD (mm)</th>
          <th>ae (mm)</th>
          <th>Målt Ø</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: plan.N }, (_, i) => i + 1).map(step => {
          const log = state.log.find(l => l.step === step);

          const isCurrent = !state.finished && state.step + 1 === step;

          // Kun siste utførte steg kan redigeres
          const canEdit = Boolean(log) && step === state.step;

          const next = computeNextTarget(state);

          let deltaD: number | null = null;
          let aeVal: number | null = null;

          if (log) {
            deltaD = log.deltaD;
            aeVal = log.ae;
          } else if (isCurrent && next) {
            deltaD = next.deltaD;
            aeVal = next.ae;
          }

          const rowIsEditing = editingStep === step;

          return (
            <tr key={step}>
              <td>{step}</td>
              <td>{deltaD != null ? deltaD.toFixed(4) : ""}</td>
              <td>{aeVal != null ? aeVal.toFixed(4) : ""}</td>

              {/* Målt Ø */}
              <td>
                {log ? (
                  canEdit && rowIsEditing ? (
                    <input
                      className="measure-input edit-field"
                      value={pendingValue}
                      autoFocus
                      onChange={e => setPendingValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onUpdate(step, pendingValue);
                          setEditingStep(null);
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          setEditingStep(null);
                        }
                      }}
                    />
                  ) : (
                    <span className="readonly-value">
                      {log.measured.toFixed(4)}
                    </span>
                  )
                ) : (
                  <input
                    // Ref skal kun sitte på current input, ikke edit input
                    ref={isCurrent ? currentMeasurementRef : undefined}
                    className="measure-input"
                    value={measurements[step] ?? ""}
                    onChange={e =>
                      setMeasurements(m => ({
                        ...m,
                        [step]: e.target.value,
                      }))
                    }
                    disabled={!isCurrent || isEditing} // lås registrering mens du redigerer
                  />
                )}
              </td>

              {/* Handlinger */}
              <td>
                {/* Når vi redigerer: vis Register (som OK) + Avbryt */}
                {canEdit && rowIsEditing && (
                  <>
                    <RegisterButton
                      disabled={!pendingValue}
                      onClick={() => {
                        onUpdate(step, pendingValue);
                        setEditingStep(null);
                      }}
                    />
                    <CancelButton
                      onClick={() => {
                        setEditingStep(null);
                      }}
                    />
                  </>
                )}

                {/* Oppdater kun på siste utførte steg, og kun når vi ikke er i edit */}
                {canEdit && !rowIsEditing && !isEditing && (
                  <UpdateButton
                    onClick={() => {
                      setEditingStep(step);
                      setPendingValue(log!.measured.toString());
                    }}
                  />
                )}

                {/* Kun ÉN synlig Registrer av gangen:
                    - kun current step
                    - og ikke mens vi er i edit */}
                {isCurrent && !log && !isEditing && (
                  <RegisterButton
                    disabled={!measurements[step]}
                    onClick={() => onSubmit(step)}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
