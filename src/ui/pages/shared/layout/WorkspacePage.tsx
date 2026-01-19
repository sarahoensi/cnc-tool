// WorkspacePage.tsx
import { InputPanel, SidePanel } from "@ui/components/PanelSections";
import { SplitPage } from "@ui/pages/shared/layout/SplitPage";

export function WorkspacePage() {
  return (
    <div className="workspace">
      <SplitPage
        left={<InputPanel title="Inndata">...</InputPanel>}
        right={<SidePanel title="Resultat">...</SidePanel>}
      />
    </div>
  );
}
