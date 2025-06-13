// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { writable } from 'svelte/store';

const NUM_PAGES = 2;

export function createSidebarLayoutPageState() {
  const { subscribe, update } = writable(0);

  return {
    subscribe,
    next: () => update((value) => Math.min(NUM_PAGES - 1, value + 1)),
    back: () => update((value) => Math.max(0, value - 1)),
  };
}

export const sidebarLayoutPageState = createSidebarLayoutPageState();
