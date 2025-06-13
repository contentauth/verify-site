// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { createSidebarLayoutPageState } from './sidebarLayoutPageState';

describe('store/sidebarLayoutPageState', () => {
  it('should default to page 0', () => {
    const store = createSidebarLayoutPageState();

    expect(get(store)).toBe(0);
  });

  it('should advance to the next page when next is called', () => {
    const store = createSidebarLayoutPageState();

    store.next();

    expect(get(store)).toBe(1);
  });

  it('should not allow page to increment beyond the max', () => {
    const store = createSidebarLayoutPageState();

    store.next();
    expect(get(store)).toBe(1);

    store.next();

    expect(get(store)).toBe(1);
  });

  it('should return to the previous page when back is called', () => {
    const store = createSidebarLayoutPageState();

    store.next();

    expect(get(store)).toBe(1);

    store.back();

    expect(get(store)).toBe(0);
  });

  it('should not allow page to decrement beyond the minimum', () => {
    const store = createSidebarLayoutPageState();

    store.back();

    expect(get(store)).toBe(0);
  });
});
