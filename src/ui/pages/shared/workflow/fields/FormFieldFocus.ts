export type FormFieldFocus<K extends PropertyKey> = {
  register: (key: K) => (el: HTMLInputElement | null) => void;
  focus: (key: K) => void;
};
