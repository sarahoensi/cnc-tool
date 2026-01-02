type InputPanelProps = {
  title: string;
  children: React.ReactNode;
};

export function InputPanel({ title, children }: InputPanelProps) {
  return (
    <>
      <h2>{title}</h2>
      {children}
    </>
  );
}
