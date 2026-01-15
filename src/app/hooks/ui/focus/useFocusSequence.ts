import { useRef } from "react";

export function useFocusSequence<T extends HTMLElement>() {
  const refs = useRef<T[]>([]);

  function register(el: T | null) {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  }

  function focusNext() {
    const idx = refs.current.findIndex(
      el => el === document.activeElement
    );
    const next = refs.current[idx + 1];
    next?.focus();
  }

  function focusPrev() {
    const idx = refs.current.findIndex(
      el => el === document.activeElement
    );
    const prev = refs.current[idx - 1];
    prev?.focus();
  }

  return { register, focusNext, focusPrev };
}
