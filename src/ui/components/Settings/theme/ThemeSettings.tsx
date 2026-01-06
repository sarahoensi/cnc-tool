//src/ui/components/Settings/theme/ThemeSettings

import { setTheme } from "./useTheme";

export function ThemeSettings() {
  return (
    <>
      <button onClick={() => setTheme("default")}>🌤 Standard</button>
      <button onClick={() => setTheme("pink")}>🌸 Rosa</button>
      <button onClick={() => setTheme("forest")}>🌲 Forest</button>
      <button onClick={() => setTheme("system")}>🖥 System</button>
    </>
  );
}
