import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Provide a fallback to the default locale if locale is undefined
  const safeLocale = locale || defaultLocale;

  // Load messages for the current locale
  return {
    locale: safeLocale,
    messages: (await import(`./locales/${safeLocale}.json`)).default,
  };
});
