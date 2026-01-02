type SidePanelProps = {
  title: string;
  children: React.ReactNode;
};

export function SidePanel({ title, children }: SidePanelProps) {
  return (
    <>
      <h2>{title}</h2>
      {children}
    </>
  );
}
