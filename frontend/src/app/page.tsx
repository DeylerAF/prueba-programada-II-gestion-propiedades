import { defaultLocale } from "@/i18n/config";
import { redirect } from "next/navigation";

// This redirects from the root to the default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
