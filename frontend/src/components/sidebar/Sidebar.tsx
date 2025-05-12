"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../hooks/sidebar";
import SidebarToggle from "./SidebarToggle";
import { Home, Building, Building2, Users2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

/**
 * Sidebar component for navigation
 */

const Sidebar = () => {
  const pathname = usePathname();
  const { closeSidebar, closeSidebarOnNavigation } = useSidebar();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      {/* Overlay for mobile that closes the sidebar when clicked */}
      <div
        id="sidebar-overlay"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 hidden cursor-pointer transition-opacity duration-300"
        aria-hidden="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeSidebar();
        }}
      />
      <aside
        id="sidebar"
        className="fixed top-0 left-0 h-full shadow-md transition-all duration-300 ease-in-out z-40 overflow-y-auto overflow-x-hidden bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] -translate-x-full md:translate-x-0 w-[16rem] border-r border-[var(--border-color)] pointer-events-auto"
        aria-label="Sidebar navigation"
      >
        {/* Header section with toggle - kept outside of the content that might be hidden */}
        <div className="flex justify-between items-center p-3">
          <SidebarToggle />
        </div>
        {/* Wrap the actual content that can be hidden safely */}
        <div className="sidebar-content">
          <nav className="mt-4" aria-label="Main Navigation">
            {" "}
            <ul className="space-y-1">
              <li>
                <Link
                  href={`/${locale}`}
                  className={`flex items-center py-2 px-4 rounded-lg transition-colors relative font-medium ${
                    pathname === `/${locale}`
                      ? "text-[var(--accent-500)] bg-[var(--sidebar-hover)]"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--accent-500)]"
                  }`}
                  aria-current={pathname === `/${locale}` ? "page" : undefined}
                  onClick={closeSidebarOnNavigation}
                >
                  {" "}
                  {/* Home icon replaced with lucide-react Home icon */}{" "}
                  <Home className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">{t("navigation.home")}</span>
                  {pathname === `/${locale}` && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-500)] rounded-r"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/properties`}
                  className={`flex items-center py-2 px-4 rounded-lg transition-colors relative font-medium ${
                    pathname === `/${locale}/properties`
                      ? "text-[var(--accent-500)] bg-[var(--sidebar-hover)]"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--accent-500)]"
                  }`}
                  aria-current={
                    pathname === `/${locale}/properties` ? "page" : undefined
                  }
                  onClick={closeSidebarOnNavigation}
                >
                  {/* Properties icon replaced with lucide-react Building icon */}
                  <Building className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">{t("navigation.properties")}</span>
                  {pathname === `/${locale}/properties` && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-500)] rounded-r"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>{" "}
              <li>
                <Link
                  href={`/${locale}/property-types`}
                  className={`flex items-center py-2 px-4 rounded-lg transition-colors relative font-medium ${
                    pathname === `/${locale}/property-types`
                      ? "text-[var(--accent-500)] bg-[var(--sidebar-hover)]"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--accent-500)]"
                  }`}
                  aria-current={
                    pathname === `/${locale}/property-types`
                      ? "page"
                      : undefined
                  }
                  onClick={closeSidebarOnNavigation}
                >
                  {/* Property Types icon replaced with lucide-react Building2 icon */}
                  <Building2 className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">{t("navigation.propertyTypes")}</span>
                  {pathname === `/${locale}/property-types` && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-500)] rounded-r"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/owners`}
                  className={`flex items-center py-2 px-4 rounded-lg transition-colors relative font-medium ${
                    pathname === `/${locale}/owners`
                      ? "text-[var(--accent-500)] bg-[var(--sidebar-hover)]"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--accent-500)]"
                  }`}
                  aria-current={
                    pathname === `/${locale}/owners` ? "page" : undefined
                  }
                  onClick={closeSidebarOnNavigation}
                >
                  {/* Owners icon replaced with lucide-react Users2 icon */}
                  <Users2 className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">{t("navigation.owners")}</span>
                  {pathname === `/${locale}/owners` && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-500)] rounded-r"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
