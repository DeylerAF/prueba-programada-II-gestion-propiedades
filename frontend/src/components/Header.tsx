"use client";

import React, { ReactNode } from "react";
import { useHeaderShadow } from "@/hooks/header";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SidebarToggle from "./sidebar/SidebarToggle";
import LanguageSelector from "./LanguageSelector";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

interface HeaderProps {
  right?: ReactNode;
}

/**
 * Header component with responsive navigation
 */
const Header = ({ right }: HeaderProps) => {
  const t = useTranslations();
  const locale = useLocale();

  // Add shadow to header on scrollable content container
  useHeaderShadow("main-header", "shadow-lg", "content");
  return (
    <nav
      id="main-header"
      className="bg-opacity-90 sticky top-0 z-20 w-full backdrop-blur-sm transition-shadow duration-300"
    >
      <div className="flex flex-wrap items-center justify-between mx-auto p-3">
        {/* Left: Brand and mobile sidebar toggle */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle only visible on mobile */}
          <div className="md:hidden">
            <SidebarToggle isOpen={false} />
          </div>{" "}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/icon-512x512.svg"
              alt="App Logo"
              width={24}
              height={24}
              className="text-[var(--text-color)]"
              loading="eager"
              priority={true}
            />
            <span className="hidden md:block self-center text-xl font-semibold whitespace-nowrap text-[var(--text-color)]">
              {t("common.appName")}
            </span>
          </Link>
        </div>

        {/* Right: Theme toggle and slot */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {right}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Header;
