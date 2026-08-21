import { languages, defaultLang } from './ui';

export function getLangFromURL(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) return lang;
  return defaultLang;
}

export async function useTranslations(lang: string) {
  try {
    const translations = await import(`./locales/${lang}.json`).then((module) => module.default);

    return {
      get: (key: string) => {
        const keys = key.split('.');
        let result: any = translations;
        for (const k of keys) {
          if (result && Object.prototype.hasOwnProperty.call(result, k)) {
            result = result[k];
          } else {
            return ''; // Return empty string if key not found
          }
        }
        return result;
      }
    };
  } catch (e) {
    console.error(`Could not load translations for language: ${lang}`, e);
    const fallback = await import(`./locales/${defaultLang}.json`).then((module) => module.default);

    return {
      get: (key: string) => {
        const keys = key.split('.');
        let result: any = fallback;
        for (const k of keys) {
          if (result && Object.prototype.hasOwnProperty.call(result, k)) {
            result = result[k];
          } else {
            return '';
          }
        }
        return result;
      }
    };
  }
}
