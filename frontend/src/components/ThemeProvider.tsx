"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { useTheme as useThemeHook } from "@/hooks/theme";

type ThemeContextType = ReturnType<typeof useThemeHook>;

// Create context with meaningful default values to avoid runtime errors
const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

// Simple hook to access theme context with error handling
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValues = useThemeHook();
  // Return null during SSR to avoid hydration mismatch
  if (!themeValues.mounted) {
    // Preserve children but visually hide content
    // to prevent flashing during hydration
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
}

// Added displayName to aid debugging
ThemeProvider.displayName = "ThemeProvider";
