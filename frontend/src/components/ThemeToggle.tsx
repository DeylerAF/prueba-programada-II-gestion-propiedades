"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { type ThemeType } from "@/hooks/theme";
import { useTheme } from "./ThemeProvider";

// Theme configuration defined outside the component
const THEME_OPTIONS = [
  { value: "light" as ThemeType, icon: Sun, label: "Light" },
  { value: "dark" as ThemeType, icon: Moon, label: "Dark" },
  { value: "system" as ThemeType, icon: Monitor, label: "System" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handler to close the menu
  const closeDropdown = useCallback(() => setIsOpen(false), []);

  // Handler to change the theme
  const handleThemeChange = useCallback(
    (newTheme: ThemeType) => {
      setTheme(newTheme);
      closeDropdown();
    },
    [setTheme, closeDropdown],
  );
  // Effect to handle clicks outside the menu and Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(e: MouseEvent | KeyboardEvent) {
      // Close on Escape key
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        closeDropdown();
        return;
      }

      // Close if clicked outside
      if (
        e instanceof MouseEvent &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }

    // Add event listeners
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleOutsideClick);
    };
  }, [isOpen, closeDropdown]);
  // Get the current theme icon
  const CurrentThemeIcon =
    THEME_OPTIONS.find((option) => option.value === theme)?.icon || Sun;

  return (
    <div className="relative" ref={containerRef}>
      {" "}
      <button
        title="Change theme"
        className="p-2 rounded-md transition-colors hover:bg-[var(--hover-bg)] text-[var(--text-color)] flex items-center gap-1"
        aria-label="Theme options"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <CurrentThemeIcon className="w-5 h-5" />
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 p-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md shadow-md z-50"
          role="menu"
        >
          {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              role="menuitem"
              title={`Use ${label.toLowerCase()} theme`}
              className={`flex items-center w-full px-2 py-1.5 rounded-md transition-colors 
                          hover:bg-[var(--hover-bg)] text-left 
                          ${theme === value ? "bg-[var(--hover-bg)] font-medium" : ""}`}
              onClick={() => handleThemeChange(value)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
