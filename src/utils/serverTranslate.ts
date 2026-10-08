import { cookies } from "next/headers";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import ar from "@/locales/ar.json";

const translations: any = { en, fr, ar };

export const getTranslation = async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as "en" | "fr" | "ar") || "fr";

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[locale];
    for (const k of keys) {
      if (value) value = value[k];
    }
    return value || key;
  };

  return { t, locale };
};
