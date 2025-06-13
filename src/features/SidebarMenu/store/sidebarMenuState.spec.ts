// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { createSidebarMenuState } from './sidebarMenuState';

describe('store/sidebarMenu', () => {
  it('should default to false', () => {
    const store = createSidebarMenuState();

    expect(get(store)).toBe(false);
  });

  it('should switch state when toggle is called', () => {
    const store = createSidebarMenuState();

    store.toggle();

    expect(get(store)).toBe(true);

    store.toggle();

    expect(get(store)).toBe(false);
  });

  it('should set to true when open is called', () => {
    const store = createSidebarMenuState();

    store.setOpen();

    expect(get(store)).toBe(true);
  });

  it('should set to false when close is called', () => {
    const store = createSidebarMenuState();

    store.setClosed();

    expect(get(store)).toBe(false);
  });
});
