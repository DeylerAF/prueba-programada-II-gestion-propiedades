"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe, ChevronDown, Languages } from "lucide-react";
import { getLanguageNames, Locale, locales } from "@/i18n/config";
import { isMobile } from "@/hooks/responsive";

// Language configuration defined outside the component
const LANGUAGE_OPTIONS = [
  { value: "en" as Locale, icon: Languages, label: "English" },
  { value: "es" as Locale, icon: Languages, label: "Español" },
];

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const languageNames = getLanguageNames();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(isMobile());
    };

    // Check on mount and resize
    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  // Handler to close the menu
  const closeDropdown = useCallback(() => setIsOpen(false), []);

  // Handler to change the language
  const handleLanguageChange = useCallback(
    (newLocale: Locale) => {
      if (currentLocale === newLocale || isPending) return;

      startTransition(() => {
        // Replace the locale segment in the URL
        const segments = pathname.split("/");
        if (locales.includes(segments[1] as Locale)) {
          segments[1] = newLocale;
        } else {
          segments.splice(1, 0, newLocale);
        }

        const newPath = segments.join("/");
        router.replace(newPath);
      });
      closeDropdown();
    },
    [pathname, router, currentLocale, closeDropdown, isPending]
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
  // Get the current language icon and label
  const currentLanguage = LANGUAGE_OPTIONS.find(
    (option) => option.value === currentLocale
  );
  const CurrentLanguageIcon = currentLanguage?.icon || Globe;
  const currentLabel = languageNames[currentLocale] || "English";

  return (
    <div className="relative" ref={containerRef}>
      {" "}
      <button
        title="Change language"
        className="p-2 rounded-md transition-colors hover:bg-[var(--hover-bg)] text-[var(--text-color)] flex items-center gap-1"
        aria-label="Language options"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isPending}
      >
        <CurrentLanguageIcon className="w-5 h-5" />
        {!isMobileView && <span className="text-sm">{currentLabel}</span>}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 p-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md shadow-md z-50"
          role="menu"
        >
          {LANGUAGE_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              role="menuitem"
              title={`Switch to ${label}`}
              className={`flex items-center w-full px-2 py-1.5 rounded-md transition-colors 
                          hover:bg-[var(--hover-bg)] text-left 
                          ${
                            currentLocale === value
                              ? "bg-[var(--hover-bg)] font-medium"
                              : ""
                          }`}
              onClick={() => handleLanguageChange(value)}
              disabled={isPending}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
