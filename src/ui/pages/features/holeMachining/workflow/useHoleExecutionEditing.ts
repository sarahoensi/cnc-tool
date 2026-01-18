// src/ui/pages/features/holeMachining/workflow/useHoleExecutionEditing.ts

import { useState } from "react";

export function useHoleExecutionEditing() {
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState<number | null>(null);

  const isEditing = editingStep !== null;

  return {
    editingStep,
    pendingValue,
    submitAttempted,
    isEditing,

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
