export type Locale = "az" | "en";

export const locales: Locale[] = ["az", "en"];
export const defaultLocale: Locale = "az";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
