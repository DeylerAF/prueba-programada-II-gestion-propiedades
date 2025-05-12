import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./src/i18n/config";

export default createMiddleware({
  // A list of all locales that are supported
  locales: [...locales],

  // The default locale to be used when visiting
  // a non-localized route, e.g. `/about`
  defaultLocale,

  // Always show the locale prefix
  localePrefix: "always",
});

export const config = {
  // Match all routes except for the ones starting with /api, /_next, or containing a dot
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
