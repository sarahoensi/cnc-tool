import { useRef } from "react";

export function useFormFocusManager<K extends PropertyKey>() {
  const refs = useRef<Partial<Record<K, HTMLInputElement>>>({});
  const lastFocused = useRef<K | null>(null);

  function register(key: K) {
    return (el: HTMLInputElement | null) => {
      if (el) refs.current[key] = el;
    };
  }

  function focus(key: K) {
    refs.current[key]?.focus();
    lastFocused.current = key;
  }

  function focusFirst(keys: readonly K[]) {
    focus(keys[0]);
  }

  function focusFirstError(errors: Partial<Record<K, string>>) {
    const key = Object.keys(errors)[0] as K | undefined;
    if (key) focus(key);
  }

  function restoreLast() {
    if (lastFocused.current) {
      focus(lastFocused.current);
    }
  }

  return {
    register,
    focus,
    focusFirst,
    focusFirstError,
    restoreLast,
  };
}
