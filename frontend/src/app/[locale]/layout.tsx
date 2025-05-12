import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, Locale } from "@/i18n/config";
import type { Metadata } from "next";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Property Management",
  description: "A system for managing properties, property types, and owners",
  icons: {
    icon: [
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/icon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icon-48x48.svg", sizes: "48x48", type: "image/svg+xml" },
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/apple-icon-180x180.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
  },
};

// Define the params type - make all properties of params optional to avoid issues with dynamic params
type Props = {
  children: React.ReactNode;
  params: {
    locale?: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: Props) {
  // Await the dynamic params to follow Next.js 15 guidelines
  const { locale: localeParam } = await props.params;
  const { children } = props;

  const locale = localeParam as Locale;

  // Validate that the locale is supported
  if (!locales.includes(locale)) {
    notFound();
  } // Load the messages for the locale
  let messages;
  try {
    messages = (await import(`../../i18n/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Try to fall back to default locale
    try {
      const { defaultLocale } = await import("@/i18n/config");
      messages = (await import(`../../i18n/locales/${defaultLocale}.json`))
        .default;
      console.log(`Falling back to default locale: ${defaultLocale}`);
    } catch (fallbackError) {
      console.error("Failed to load fallback locale:", fallbackError);
      notFound();
    }
  }
  const currentYear = new Date().getFullYear();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <div className="antialiased flex min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
          <Sidebar />
          <div
            id="content"
            className="md:ml-16 flex-grow transition-all duration-300 ease-in-out max-w-full overflow-y-auto overflow-x-hidden flex flex-col h-screen"
          >
            {/* Header component */}
            <Header />
            {/* Content container that will receive the page content */}{" "}
            <div className="p-4 container mx-auto flex-grow">
              <main className="w-full">{children}</main>
            </div>
            {/* Footer */}
            <footer className="mt-auto py-4 text-center text-sm opacity-75">
              <p>
                © {currentYear} {messages.common.appName}.{" "}
                {messages.common.footer}
              </p>
            </footer>
          </div>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
