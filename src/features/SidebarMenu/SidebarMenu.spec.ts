// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { fireEvent, render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import SidebarMenu from './SidebarMenu.svelte';
import { sidebarMenuState } from './store/sidebarMenuState';

describe('components/SidebarMenu', () => {
  it('should set the menu state to false when a MenuItem is clicked', async () => {
    const { getByText } = render(SidebarMenu);

    sidebarMenuState.setOpen();
    expect(get(sidebarMenuState)).toBe(true);

    const button = getByText('menu.home');

    fireEvent.click(button);

    expect(get(sidebarMenuState)).toBe(false);
  });
});
