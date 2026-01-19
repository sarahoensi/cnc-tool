import "./SplitPage.css";
import { Panel } from "@ui/components/Panel/Panel";

type SplitPageProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function SplitPage({ left, right }: SplitPageProps) {
  return (
    <div className="split-page">
      <Panel>{left}</Panel>
      <Panel>{right}</Panel>
    </div>
  );
}
