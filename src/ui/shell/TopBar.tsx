import { useState } from "react";
import "./TopBar.css";
import { SettingsButton } from "@ui/components/Button/Button";
import { SettingsMenu } from "@ui/components/Settings/SettingsMenu";

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-title">CNC Tool</div>

      <div className="topbar-actions">
        <SettingsButton
          aria-label="Innstillinger"
          title="Innstillinger"
          onClick={() => setOpen(v => !v)}
        />
        {open && <SettingsMenu onClose={() => setOpen(false)} />}
      </div>
    </div>
  );
}
