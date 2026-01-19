import { useState } from "react";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import "./AppShell.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-area">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
