import { useState } from "react";

export function useExecutionEdit() {
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [submitAttempted, setSubmitAttempted] =
    useState<number | null>(null);

  return {
    editingStep,
    pendingValue,
    submitAttempted,
    isEditing: editingStep !== null,

    startEdit(step: number, value: string) {
      setEditingStep(step);
      setPendingValue(value);
    },

    cancelEdit() {
      setEditingStep(null);
    },

    setPendingValue,

    markSubmitAttempt(step: number) {
      setSubmitAttempted(step);
    },

    clearSubmitAttempt() {
      setSubmitAttempted(null);
    },
  };
}
