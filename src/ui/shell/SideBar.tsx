import "./SideBar.css";
import { NavLink } from "react-router-dom";

export function SideBar() {
  return (
    <div className="sidebar">
      <NavLink to="/" className="nav-item">Hullbearbeiding</NavLink>
      <NavLink to="/cutting-data" className="nav-item">Skjæredata</NavLink>
      <NavLink to="/spiral" className="nav-item">Spiral/Helix</NavLink>
      <NavLink to="/triangle" className="nav-item">Trekant</NavLink>
    </div>
  );
}
