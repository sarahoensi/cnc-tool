import "./Panel.css";

type PanelProps = {
  children: React.ReactNode;
};

export function Panel({ children }: PanelProps) {
  return <div className="panel">{children}</div>;
}
