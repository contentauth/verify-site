// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { page } from '$app/stores';
import { get } from 'svelte/store';

export function removeParamsFromUrl(params: string[]) {
  const { url } = get(page);

  if (!url) {
    return null;
  }

  const { host, pathname, protocol, searchParams } = url;

  params.forEach((param) => searchParams.delete(param));

  const queryString = searchParams.toString();

  return `${protocol}//${host}${pathname}${
    queryString ? `?${queryString}` : ``
  }`;
}
