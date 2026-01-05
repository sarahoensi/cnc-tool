import { useEffect, useState } from "react";
import {
  CancelButton,
  RegisterButton,
  UpdateButton,
} from "@ui/components/Button/Button";

import type {
  HolePlan,
  HoleExecutionState,
  NextTargetInfo,
} from "@core/holeMachining";

import { useAutoFocusOnVisibility } from "@app/hooks/ui/useAutoFocusOnVisibility";

type Props = {
  plan: HolePlan;
  state: HoleExecutionState;
  nextTarget: NextTargetInfo | null;

  measurements: Record<number, string>;
  setMeasurements: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;

  onSubmit(step: number): void;
  onUpdate(step: number, value: string): void;
};

export function HoleExecutionTable({
  plan,
  state,
  nextTarget,
  measurements,
  setMeasurements,
  onSubmit,
  onUpdate,
}: Props) {
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState("");

  const { ref: currentRef, focus } =
    useAutoFocusOnVisibility<HTMLInputElement>();

  const isEditing = editingStep !== null;

  useEffect(() => {
    if (state.finished) return;
    requestAnimationFrame(() => focus());
  }, [state.step, state.finished, isEditing, focus]);

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

          const isCurrent =
            !state.finished && state.step + 1 === step;

          const canEdit = Boolean(log) && step === state.step;
          const rowIsEditing = editingStep === step;

          const deltaD =
            log?.deltaD ?? (isCurrent ? nextTarget?.deltaD : null);
          const ae =
            log?.ae ?? (isCurrent ? nextTarget?.ae : null);

          return (
            <tr key={step}>
              <td>{step}</td>
              <td>{deltaD != null ? deltaD.toFixed(4) : ""}</td>
              <td>{ae != null ? ae.toFixed(4) : ""}</td>

              <td>
                {log ? (
                  canEdit && rowIsEditing ? (
                    <input
                      className="measure-input edit-field"
                      value={pendingValue}
                      autoFocus
                      onChange={e =>
                        setPendingValue(e.target.value)
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          onUpdate(step, pendingValue);
                          setEditingStep(null);
                        }
                        if (e.key === "Escape") {
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
                    ref={isCurrent ? currentRef : undefined}
                    className="measure-input"
                    value={measurements[step] ?? ""}
                    onChange={e =>
                      setMeasurements(m => ({
                        ...m,
                        [step]: e.target.value,
                      }))
                    }
                    disabled={!isCurrent || isEditing}
                  />
                )}
              </td>

              <td>
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
                      onClick={() => setEditingStep(null)}
                    />
                  </>
                )}

                {canEdit && !rowIsEditing && !isEditing && (
                  <UpdateButton
                    onClick={() => {
                      setEditingStep(step);
                      setPendingValue(
                        log!.measured.toString()
                      );
                    }}
                  />
                )}

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
