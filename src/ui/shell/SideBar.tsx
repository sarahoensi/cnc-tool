import "./SideBar.css";
import { NavLink } from "react-router-dom";

type SideBarProps = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { to: "/", label: "Finkjøring" },
  { to: "/cutting-data", label: "Skjæredata" },
  { to: "/spiral", label: "Spiral / Helix" },
  { to: "/triangle", label: "Trekant" },
];

export function SideBar({ open, onClose }: SideBarProps) {
  return (
    <>
      {/* Overlay for mobil */}
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <nav
        className={`sidebar ${open ? "mobile-open" : ""}`}
        aria-label="Hovednavigasjon"
      >
        <div className="sidebar-content">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
