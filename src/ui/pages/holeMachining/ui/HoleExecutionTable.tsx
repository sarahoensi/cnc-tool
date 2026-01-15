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

import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";
import { holeExecutionTooltips } from "./holeTooltips";


import { formatNumber } from "@utils/format";

import { useDecimalsValue } from "@app/hooks/ui/useDecimalsValue";

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
  const [submitAttempted, setSubmitAttempted] = useState<number | null>(null);


  const { ref: currentRef, focus } =
    useAutoFocusOnVisibility<HTMLInputElement>();

  const isEditing = editingStep !== null;

  const decimals = useDecimalsValue();


  useEffect(() => {
    if (state.finished) return;
    requestAnimationFrame(() => focus());
  }, [state.step, state.finished, isEditing, focus]);

  function getMinAllowedDiameter(step: number): number {
    const previous = state.log
      .filter(l => l.step < step)
      .sort((a, b) => b.step - a.step)[0];

    return previous ? previous.measured : state.D_start;
  }

  function validateMeasurement(step: number, value: string): string | null {
    if (!value.trim()) return "Målt Ø mangler";

    const num = Number(value.replace(",", "."));
    if (isNaN(num)) return "Ugyldig tall";

    const min = getMinAllowedDiameter(step);

    if (num < min) {
      return `Må være ≥ ${formatNumber(min, decimals)} mm`;
    }

    return null;
  }



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
                    disabled={!isCurrent || isEditing}
                  />
                )}
              </td>

              <td>
                {canEdit && rowIsEditing && (
                  <>
                    {(() => {
                      const error = validateMeasurement(step, pendingValue);

                      return (
                        <>
                          <RegisterButton
                            disabled={!pendingValue || Boolean(error)}
                            onClick={() => {
                              onUpdate(step, pendingValue);
                              setEditingStep(null);
                            }}
                          />
                          {error && (
                            <div className="measure-error">{error}</div>
                          )}
                        </>
                      );
                    })()}

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

                {isCurrent && !log && !isEditing && (() => {
                  const error = validateMeasurement(step, measurements[step] ?? "");

                  return (
                    <>
                      {(() => {
                        const value = measurements[step] ?? "";
                        const error = validateMeasurement(step, value);
                        const showError = submitAttempted === step && Boolean(error);

                        return (
                          <>
                            <RegisterButton
                              onClick={() => {
                                setSubmitAttempted(step);

                                if (!error) {
                                  onSubmit(step);
                                  setSubmitAttempted(null);
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
