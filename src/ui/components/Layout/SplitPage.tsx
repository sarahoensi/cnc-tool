import "./SplitPage.css";

type SplitPageProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function SplitPage({ left, right }: SplitPageProps) {
  return (
    <div className="split-page">
      <div className="panel input-panel">{left}</div>
      <div className="panel side-panel">{right}</div>
    </div>
  );
}
