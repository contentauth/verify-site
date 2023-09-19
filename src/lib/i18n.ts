// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { lang } from '@intl/adobe-locales';
import debug from 'debug';
import groupBy from 'lodash/groupBy';
import {
  getLocaleFromNavigator,
  getLocaleFromQueryString,
  init,
  locale,
  register,
} from 'svelte-i18n';
import { get } from 'svelte/store';

const dbg = debug('i18n');

const LOCALSTORAGE_KEY = 'locale';
const WELSH_LOCALE = 'cy-GB';
const WELSH_LANG = 'Cymraeg';

export const DEFAULT_LOCALE = 'en-US';
export const supportedLocales = __SUPPORTED_LOCALES__;
export const supportedLanguages = groupBy(supportedLocales, lang);

function getSupportedLocale(locale: string | null) {
  if (!locale) {
    return DEFAULT_LOCALE;
  }

  const prefix = locale.split('-')[0];
  const matchingLocales: string[] = supportedLanguages[prefix] ?? [];

  if (matchingLocales.includes(locale)) {
    return locale;
  }

  if (matchingLocales.length) {
    return matchingLocales[0];
  }

  return DEFAULT_LOCALE;
}

export function registerLocales() {
  supportedLocales.forEach((locale) => {
    register(locale, async () => {
      dbg(`Fetching locale information for ${locale}`);
      const data = (await import(`../../locales/${locale}.json`)).default;
      dbg(`Received translations for ${locale}`, data);

      return data;
    });
  });
}

export async function initI18n() {
  registerLocales();

  const prevLocale = window.localStorage.getItem(LOCALSTORAGE_KEY);
  const requestedLocale =
    getLocaleFromQueryString('lang') || prevLocale || getLocaleFromNavigator();
  const initialLocale = getSupportedLocale(requestedLocale);

  if (initialLocale !== DEFAULT_LOCALE) {
    window.localStorage.setItem(LOCALSTORAGE_KEY, initialLocale);
  } else {
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  dbg('Detected language', initialLocale);

  init({
    fallbackLocale: DEFAULT_LOCALE,
    initialLocale,
  });
}

export function setLanguage(lang: string) {
  locale.set(lang);
  window.localStorage.setItem(LOCALSTORAGE_KEY, lang);
}

/**
 * Logic adapted from @intl/language-region-switcher
 */
function getLocaleLanguageName(locale: string) {
  let localLanguageName: string | undefined = '';

  // Handle edge case of always returning translated Welsh.
  if (locale === WELSH_LOCALE) {
    return WELSH_LANG;
  }

  try {
    const intlLocale = new Intl.Locale(locale);
    const languageNames = new Intl.DisplayNames([locale], {
      type: 'language',
    });

    if (['zh-CN', 'zh-TW'].includes(locale)) {
      localLanguageName = languageNames.of(locale);
    } else {
      localLanguageName = languageNames.of(intlLocale.language ?? '');
    }
  } catch {
    console.error(locale, ' is not a valid locale code');

    return getLocaleLanguageName(DEFAULT_LOCALE);
  }

  return `${localLanguageName
    ?.charAt(0)
    .toLocaleUpperCase()
    .concat(localLanguageName?.slice(1).toLocaleLowerCase())}`;
}

export function getLanguageNames() {
  const currLocale = get(locale) ?? DEFAULT_LOCALE;
  const compare = new Intl.Collator(currLocale).compare;

  return supportedLocales
    .filter((locale) => locale !== 'zz-ZZ')
    .map((locale) => {
      return {
        locale,
        name: getLocaleLanguageName(locale),
      };
    })
    .sort((a, b) => compare(a.name, b.name));
}
