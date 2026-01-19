import "./SplitPage.css";
import { Panel } from "@ui/components/Panel/Panel";

type SplitPageProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function SplitPage({ left, right }: SplitPageProps) {
    return (
    <div className="split-page">
      <div className="split-page__left">
        <Panel>{left}</Panel>
      </div>

      <div className="split-page__right">
        <Panel>{right}</Panel>
      </div>
    </div>
  );
}
