"use client";

import Link from "next/link";
import { Building, Building2, Eye, Users2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-2 sm:px-4 bg-[var(--bg-color)]">
      <div className="text-center mb-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
          {t("common.welcome")}
        </h1>
        <p className="text-[var(--neutral-600)] dark:text-[var(--neutral-400)] text-lg mb-6">
          {t("common.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Properties Card */}
        <div className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6 flex flex-col items-center text-center min-h-[320px] w-full transition-colors">
          <Building
            className="w-12 h-12 mb-4 text-[var(--accent-500)]"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold mb-2 text-[var(--accent-500)]">
            {t("navigation.properties")}
          </h2>{" "}
          <p className="text-[var(--neutral-600)] dark:text-[var(--neutral-400)] mb-6 flex-grow">
            {t("properties.description")}
          </p>{" "}
          <div className="flex gap-2 mt-auto">
            <Link href={`/${t("locale")}/properties`}>
              <div className="bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white py-2 px-4 rounded-md text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {t("actions.view")}
              </div>
            </Link>
          </div>
        </div>

        {/* Property Types Card */}
        <div className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6 flex flex-col items-center text-center min-h-[320px] w-full transition-colors">
          <Building2
            className="w-12 h-12 mb-4 text-[var(--accent-500)]"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold mb-2 text-[var(--accent-500)]">
            {t("navigation.propertyTypes")}
          </h2>{" "}
          <p className="text-[var(--neutral-600)] dark:text-[var(--neutral-400)] mb-6 flex-grow">
            {t("propertyTypes.pageDescription")}
          </p>{" "}
          <div className="flex gap-2 mt-auto">
            <Link href={`/${t("locale")}/property-types`}>
              <div className="bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white py-2 px-4 rounded-md text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {t("actions.view")}
              </div>
            </Link>
          </div>
        </div>

        {/* Owners Card */}
        <div className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6 flex flex-col items-center text-center min-h-[320px] w-full transition-colors">
          <Users2
            className="w-12 h-12 mb-4 text-[var(--accent-500)]"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold mb-2 text-[var(--accent-500)]">
            {t("navigation.owners")}
          </h2>
          <p className="text-[var(--neutral-600)] dark:text-[var(--neutral-400)] mb-6 flex-grow">
            {t("owners.description")}
          </p>{" "}
          <div className="flex gap-2 mt-auto">
            <Link href={`/${t("locale")}/owners`}>
              <div className="bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white py-2 px-4 rounded-md text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {t("actions.view")}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
