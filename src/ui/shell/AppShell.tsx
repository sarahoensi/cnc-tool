import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import "./AppShell.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <SideBar />
      <div className="main-area">
        <TopBar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
