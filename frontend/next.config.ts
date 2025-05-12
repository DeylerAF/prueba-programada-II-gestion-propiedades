import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/index.ts");

const nextConfig: NextConfig = {
  // App Router internationalization configuration is handled by middleware
  // No need for the i18n config here as it's for Pages Router only
};

export default withNextIntl(nextConfig);
