import { useState, useEffect, useCallback } from "react";

export type ThemeType = "light" | "dark" | "system";
type ActualTheme = "light" | "dark";

/**
 * Custom hook to manage theme state with localStorage persistence
 * @returns Object containing theme state and functions to manipulate it
 */
export function useTheme() {
  // Single state object with theme information
  const [state, setState] = useState<{
    theme: ThemeType;
    resolvedTheme: ActualTheme;
    mounted: boolean;
  }>({
    theme: "system",
    resolvedTheme: "light",
    mounted: false,
  });

  // Get current system preference - memoized with useCallback
  const getSystemTheme = useCallback(
    (): ActualTheme =>
      window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light",
    [],
  );

  // Apply theme to document and update CSS
  const applyTheme = useCallback((theme: ActualTheme) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  // Set theme with localStorage persistence
  const setTheme = useCallback(
    (newTheme: ThemeType) => {
      if (typeof window === "undefined") return;

      localStorage.setItem("theme", newTheme);
      const resolvedTheme = newTheme === "system" ? getSystemTheme() : newTheme;

      setState((prev) => ({ ...prev, theme: newTheme, resolvedTheme }));
      applyTheme(resolvedTheme);
    },
    [getSystemTheme, applyTheme],
  );

  // Initialize theme on mount - only runs once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme") as ThemeType | null;
    const theme = savedTheme || "system";
    const resolvedTheme =
      theme === "system" ? getSystemTheme() : (theme as ActualTheme);

    setState({ theme, resolvedTheme, mounted: true });
    applyTheme(resolvedTheme);
  }, [getSystemTheme, applyTheme]);

  // Handle system theme changes - depends on current theme
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !state.mounted ||
      state.theme !== "system"
    )
      return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const newResolvedTheme = getSystemTheme();
      setState((prev) => ({ ...prev, resolvedTheme: newResolvedTheme }));
      applyTheme(newResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [state.theme, state.mounted, getSystemTheme, applyTheme]);

  // Memoize toggle function to avoid recreating it on every render
  const toggleTheme = useCallback(
    () => setTheme(state.resolvedTheme === "light" ? "dark" : "light"),
    [state.resolvedTheme, setTheme],
  );

  return {
    theme: state.theme,
    resolvedTheme: state.resolvedTheme,
    mounted: state.mounted,
    setTheme,
    toggleTheme,
    isDark: state.resolvedTheme === "dark",
    isLight: state.resolvedTheme === "light",
  };
}
