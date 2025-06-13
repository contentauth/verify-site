// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { writable } from 'svelte/store';

export function createSidebarMenuState() {
  const { subscribe, set, update } = writable(false);

  return {
    subscribe,
    toggle: () => update((value) => !value),
    setOpen: () => set(true),
    setClosed: () => {
      set(false);
    },
  };
}

export const sidebarMenuState = createSidebarMenuState();
