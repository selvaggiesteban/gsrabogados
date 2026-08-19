import { languages, defaultLang } from './ui';

export function getLangFromURL(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) return lang;
  return defaultLang;
}

export async function useTranslations(lang: string) {
  try {
    const translations = await import(`./locales/${lang}.json`).then((module) => module.default);
    return new Map(Object.entries(translations));
  } catch (e) {
    console.error(`Could not load translations for language: ${lang}`, e);
    // Fallback to default language
    const fallback = await import(`./locales/${defaultLang}.json`).then((module) => module.default);
    return new Map(Object.entries(fallback));
  }
}
