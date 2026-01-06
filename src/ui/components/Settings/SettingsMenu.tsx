import { useEffect, useRef, useState } from "react";
import "./SettingsMenu.css";
import { ThemeSettings } from "./theme/ThemeSettings";
import { DecimalSettings } from "./decimals/DecimalSettings";

const SETTINGS_MENU = [
  {
    key: "theme",
    label: "🎨 Tema",
    component: ThemeSettings,
  },

  {
  key: "decimals",
  label: "🔢 Desimaler",
  component: DecimalSettings,
},

  // fremtidige:
  // { key: "language", label: "🌍 Språk", component: LanguageSettings },
];

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

    if (!ref.current) return;

    // hvis klikket er inni settings → ignorer
    if (ref.current.contains(target)) return;

    onClose();
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  const activeItem = SETTINGS_MENU.find(item => item.key === activeKey);

  return (
    <div ref={ref} className="settings-menu chrome-root" onMouseLeave={() => setActiveKey(null)}>
      {/* HOVEDKOLONNE */}
      <div className="menu-column">
        {SETTINGS_MENU.map(item => (
          <div
            key={item.key}
            className="menu-item"
            onMouseEnter={() => setActiveKey(item.key)}
          >
            {item.label}
            <span className="chevron">›</span>
          </div>
        ))}
      </div>

      {/* FLYOUT */}
      {activeItem && (
        <div className="submenu-flyout">
          <activeItem.component />
        </div>
      )}
    </div>
  );
}
