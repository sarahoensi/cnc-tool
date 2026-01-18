import { useEffect } from "react";
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

import { useAutoFocusOnVisibility } from "@app/hooks/ui/focus/useAutoFocusOnVisibility";

import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";
import { holeExecutionTooltips } from "./holeTooltips";


import { formatNumber } from "@utils/format";

import { useDecimalsValue } from "@app/hooks/ui/formatting/useDecimalsValue";
import { useHoleExecutionKeyboard } from "../workflow/useHoleExecutionKeyboard";
import { useHoleMeasurementValidation } from "../domain/measurement/useHoleMeasurementValidation";
import { useHoleExecutionEditing } from "../workflow/useHoleExecutionEditing";




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

  const decimals = useDecimalsValue();

  const {
    editingStep,
    pendingValue,
    submitAttempted,
    isEditing,
    startEdit,
    cancelEdit,
    setPendingValue,
    markSubmitAttempt,
    clearSubmitAttempt,
  } = useHoleExecutionEditing();

  const { validate } = useHoleMeasurementValidation(state, decimals);

  const { ref: currentRef, focus } =
    useAutoFocusOnVisibility<HTMLInputElement>();

  useEffect(() => {
    if (state.finished) return;
    requestAnimationFrame(() => focus());
  }, [state.step, state.finished, isEditing, focus]);


  const { onKeyDownEdit, onKeyDownNew } =
  useHoleExecutionKeyboard({
    onEditSubmit: () => {
      if (editingStep !== null) {
        onUpdate(editingStep, pendingValue);
        cancelEdit();
      }
    },
    onNewSubmit: () => {
      const value = measurements[state.step + 1] ?? "";
      const error = validate(state.step + 1, value);

      if (!error) {
        onSubmit(state.step + 1);
        clearSubmitAttempt();
      } else {
        markSubmitAttempt(state.step + 1);
      }
    },
    onCancelEdit: cancelEdit,
  });


  return (
    <table className="step-table">
      <thead>
        <tr>
          <th>
            <LabelWithTooltip
              label="Steg"
              tooltip={holeExecutionTooltips.step}
            />
          </th>

          <th>
            <LabelWithTooltip
              label="ΔD (mm)"
              tooltip={holeExecutionTooltips.deltaD}
            />
          </th>

          <th>
            <LabelWithTooltip
              label="ae (mm)"
              tooltip={holeExecutionTooltips.ae}
            />
          </th>

          <th>
            <LabelWithTooltip
              label="Målt Ø"
              tooltip={holeExecutionTooltips.measured}
            />
          </th>

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
              <td>{deltaD != null ? formatNumber(deltaD, decimals) : ""}</td>
              <td>{ae != null ? formatNumber(ae, decimals) : ""}</td>

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
                      onKeyDown={onKeyDownEdit}
                    />
                  ) : (
                    <span className="readonly-value">
                      {formatNumber(log.measured, decimals)}
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
                    onKeyDown={onKeyDownNew}
                    disabled={!isCurrent || isEditing}
                  />
                )}
              </td>

              <td>
                {canEdit && rowIsEditing && (
                  <>
                    {(() => {
                      const error = validate(step, pendingValue);

                      return (
                        <>
                          <RegisterButton
                            disabled={!pendingValue || Boolean(error)}
                            onClick={() => {
                              onUpdate(step, pendingValue);
                              cancelEdit();
                            }}
                          />
                          {error && (
                            <div className="measure-error">{error}</div>
                          )}
                        </>
                      );
                    })()}

                    <CancelButton
                      onClick={cancelEdit}
                    />
                  </>
                )}

                {canEdit && !rowIsEditing && !isEditing && (
                  <UpdateButton
                    onClick={() => {
                      startEdit(step, log!.measured.toString());

                    }}
                  />
                )}

                {isCurrent && !log && !isEditing && (() => {


                  return (
                    <>
                      {(() => {
                        const value = measurements[step] ?? "";
                        const error = validate(step, value);
                        const showError = submitAttempted === step && Boolean(error);

                        return (
                          <>
                            <RegisterButton
                              onClick={() => {
                                markSubmitAttempt(step);

                                if (!error) {
                                  onSubmit(step);
                                  clearSubmitAttempt();
                                }
                              }}
                            />

                            {showError && (
                              <div className="measure-error">{error}</div>
                            )}
                          </>
                        );
                      })()}

                    </>
                  );
                })()}

              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
