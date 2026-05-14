import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "ru"] as const;
type Locale = (typeof locales)[number];

function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ru";
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});