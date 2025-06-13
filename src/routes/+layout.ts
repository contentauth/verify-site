// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import '$lib/i18n';
import { initI18n } from '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
  if (typeof window !== 'undefined') {
    initI18n();
    locale.set(window.navigator.language);
    await waitLocale();
  }
};
