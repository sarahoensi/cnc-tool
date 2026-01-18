type Params = {
  onSolve: () => void;
  onReset: () => void;
};

export function useTriangleKeyboard({
  onSolve,
  onReset,
}: Params) {
  return {
    onEnterKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSolve();
      }
    },
    shortcuts: {
      Escape: onReset,
      "Ctrl+Enter": onSolve,
    },
  };
}
