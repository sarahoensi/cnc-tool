import { useState } from "react";

export function useExecutionEdit() {
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [submitAttempted, setSubmitAttempted] =
    useState<{ step: number; message: string } | null>(null);

  return {
    editingStep,
    pendingValue,
    submitAttempted,
    isEditing: editingStep !== null,

    startEdit(step: number, value: string) {
      setEditingStep(step);
      setPendingValue(value);
      setSubmitAttempted(null);
    },

    cancelEdit() {
      setEditingStep(null);
      setSubmitAttempted(null);
    },

    setPendingValue,

    markSubmitAttempt(step: number, message = "Ugyldig verdi") {
      setSubmitAttempted({ step, message });
    },

    clearSubmitAttempt() {
      setSubmitAttempted(null);
    },
  };
}
