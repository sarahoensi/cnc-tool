type Params = {
  onEditSubmit: () => void;
  onNewSubmit: () => void;
  onCancelEdit: () => void;
};

export function useHoleExecutionKeyboard({
  onEditSubmit,
  onNewSubmit,
  onCancelEdit,
}: Params) {
  function onKeyDownEdit(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEditSubmit();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      onCancelEdit();
    }
  }

  function onKeyDownNew(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      onNewSubmit();
    }
  }

  return {
    onKeyDownEdit,
    onKeyDownNew,
  };
}
