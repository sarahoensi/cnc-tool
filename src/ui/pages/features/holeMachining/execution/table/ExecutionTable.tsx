import { useEffect } from "react";

import {
  CancelButton,
  RegisterButton,
  UpdateButton,
} from "@ui/components/Button/Button";
import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";

import type {
  HolePlan,
  HoleExecutionState,
  NextTargetInfo,
} from "@core/holeMachining";

import { formatNumber } from "@utils/format";
import { useDecimalsValue } from "@app/hooks/ui/formatting/useDecimalsValue";
import { useAutoFocusOnVisibility } from "@app/hooks/ui/focus/useAutoFocusOnVisibility";

import { holeExecutionTooltips } from "../ui/executionTooltips";

import {
  CutMode,
  useHoleCutMode,
} from "../workflow/useHoleCutMode";

import { useExecutionRow } from "./useExecutionRow";
import { useExecutionEdit } from "./useExecutionEdit";
import { useExecutionSubmit } from "./useExecutionSubmit";
import { useExecutionKeyboard } from "./useExecutionKeyboard";


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

export function DiameterExecutionTable({
  plan,
  state,
  nextTarget,
  measurements,
  setMeasurements,
  onSubmit,
  onUpdate,
}: Props) {

  const decimals = useDecimalsValue();
  const isCompleted = state.finished;
  /* --------------------------------------------------
   * Editing / cut mode
   * -------------------------------------------------- */
  const edit = useExecutionEdit();
  const {
    mode: cutMode,
    setMode: setCutMode,
  } = useHoleCutMode();

  /* --------------------------------------------------
   * Row model
   * -------------------------------------------------- */
  const getRow = useExecutionRow({
    //mode: diameterMode,
    state,
    nextTarget,
  });

  /* --------------------------------------------------
   * Submit handling
   * -------------------------------------------------- */
  const submit = useExecutionSubmit({
    stateStep: state.step,
    measurements,
    onSubmit,
    onUpdate,
    markSubmitAttempt: edit.markSubmitAttempt,
    clearSubmitAttempt: edit.clearSubmitAttempt,
  });

  /* --------------------------------------------------
   * Autofocus
   * -------------------------------------------------- */
  const { ref: currentRef, focus } =
    useAutoFocusOnVisibility<HTMLInputElement>();

  useEffect(() => {
    if (state.finished) return;
    requestAnimationFrame(() => focus());
  }, [state.step, state.finished, nextTarget, edit.isEditing, focus]);

  /* --------------------------------------------------
   * Keyboard
   * -------------------------------------------------- */
  const keyboardEdit = useExecutionKeyboard({
    onSubmit: () => {
      if (edit.editingStep !== null) {
        submit.update(edit.editingStep, edit.pendingValue);
        edit.cancelEdit();
      }
    },
    onCancel: edit.cancelEdit,
  });

  const keyboardNew = useExecutionKeyboard({
    onSubmit: submit.submitCurrent,
  });

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
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
              label="Start Ø"
              tooltip="Forrige målte diameter"
            />
          </th>

          <th>
            <select
              className="header-select"
              value={cutMode}
              onChange={e =>
                setCutMode(e.target.value as CutMode)
              }
            >
              <option value="deltaD">ΔD</option>
              <option value="ae">ae</option>
            </select>
          </th>

          <th>
            <LabelWithTooltip
              label="Ny måling"
              tooltip={holeExecutionTooltips.measured}
            />
          </th>

          <th />
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: plan.N }, (_, i) => i + 1)
          .filter(step => !state.finished || step <= state.step)
          .map(step => {
            const row = getRow(step);
            const rowIsEditing =
              edit.editingStep === step;



            const error =
              edit.submitAttempted?.step === step
                ? edit.submitAttempted.message
                : null;

            return (
              <tr key={step}>
                <td>{step}</td>

                <td>
                  {row.startDiameter != null
                    ? formatNumber(
                      row.startDiameter,
                      decimals
                    )
                    : ""}
                </td>

                <td>
                  {cutMode === "deltaD" &&
                    row.deltaProgress != null && (
                      <div>
                        {formatNumber(
                          row.deltaProgress,
                          decimals
                        )}
                      </div>
                    )}

                  {cutMode === "ae" &&
                    row.ae != null && (
                      <div>
                        {formatNumber(
                          row.ae,
                          decimals
                        )}
                      </div>
                    )}
                </td>

                <td>
                  {row.log ? (
                    row.canEdit && rowIsEditing ? (
                      <input
                        className="measure-input edit-field"
                        value={edit.pendingValue}
                        autoFocus
                        onChange={e =>
                          edit.setPendingValue(
                            e.target.value
                          )
                        }
                        onKeyDown={
                          keyboardEdit.onKeyDown
                        }
                      />
                    ) : (
                      <span className="readonly-value">
                        {formatNumber(
                          row.log.measured,
                          decimals
                        )}
                      </span>
                    )
                  ) : (
                    <input
                      ref={
                        row.isCurrent
                          ? currentRef
                          : undefined
                      }
                      className="measure-input"
                      value={measurements[step] ?? ""}
                      placeholder={
                        row.isCurrent && nextTarget
                          ? formatNumber(
                            nextTarget.nextDiameter,
                            decimals
                          )
                          : ""
                      }
                      onChange={e =>
                        setMeasurements(m => ({
                          ...m,
                          [step]: e.target.value,
                        }))
                      }
                      onKeyDown={
                        keyboardNew.onKeyDown
                      }
                      disabled={
                        state.finished ||
                        !row.isCurrent ||
                        edit.isEditing
                      }
                    />
                  )}
                </td>

                <td>
                  {row.canEdit &&
                    rowIsEditing && (
                      <>
                        <RegisterButton
                          disabled={
                            !edit.pendingValue ||
                            Boolean(error)
                          }
                          onClick={() => {
                            submit.update(
                              step,
                              edit.pendingValue
                            );
                            edit.cancelEdit();
                          }}
                        />
                        <CancelButton
                          onClick={edit.cancelEdit}
                        />
                        {error && (
                          <div className="measure-error">
                            {error}
                          </div>
                        )}
                      </>
                    )}

                  {row.canEdit &&
                    !rowIsEditing &&
                    !edit.isEditing && (
                      <UpdateButton
                        onClick={() =>
                          edit.startEdit(
                            step,
                            row.log!.measured.toString()
                          )
                        }
                      />
                    )}

                  {row.isCurrent &&
                    !row.log &&
                    !edit.isEditing && (
                      <>
                        <RegisterButton
                          onClick={() =>
                            submit.submitCurrent()
                          }
                        />
                        {error && (
                          <div className="measure-error">
                            {error}
                          </div>
                        )}
                      </>
                    )}
                </td>
              </tr>
            );
          }
          )}

          {state.finished && (
    <tr>
      <td colSpan={5} className="execution-complete">
        ✅ Target Ø er nådd – utførelsen er fullført.
      </td>
    </tr>
          )}

      </tbody>
      
    </table>


  );

}
