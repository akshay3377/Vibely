import React from "react";
import  {MoonIcon , SunIcon} from "@/icons";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
      title="Toggle Theme"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-500" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}
