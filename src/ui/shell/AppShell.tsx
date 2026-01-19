import { useState } from "react";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import "./AppShell.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(p => !p)}
        />
      </header>

      <div className="app-layout">
        <aside className="app-sidebar">
          <SideBar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        <main className="app-main">
          <div className="app-body">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
