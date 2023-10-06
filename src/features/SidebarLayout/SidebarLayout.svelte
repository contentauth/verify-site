<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import ChevronLeft from '$assets/svg/monochrome/chevron-left.svg?component';
  import Header from '$src/components/Header/Header.svelte';
  import LanguagePicker from '$src/components/LanguagePicker/LanguagePicker.svelte';
  import HeaderTypo from '$src/components/typography/Header.svelte';
  import { createEventDispatcher } from 'svelte';
  import { sidebarLayoutPageState } from './store/sidebarLayoutPageState';

  export let leftColumnTakeover = false;
  export let showHeader = true;

  const dispatch = createEventDispatcher();

  function handleSidebarScroll(evt: Event) {
    const scrollTop = (evt.target as HTMLDivElement).scrollTop;
    dispatch('sidebarScroll', { scrollTop });
  }
</script>

<div
  class={[
    'grid h-screen grid-cols-[100vw_100vw] overflow-hidden bg-gray-40 transition-colors duration-100',
    !leftColumnTakeover ? 'lg:grid-cols-[theme(spacing.sidebar)_auto]' : '',
  ].join(' ')}>
  <div class="flex h-screen flex-col border-gray-100 bg-white lg:border-e-2">
    <div
      class={[
        'shrink-0 overflow-hidden transition-all duration-300',
        showHeader
          ? 'max-h-16 opacity-100 ease-in'
          : 'max-h-0 opacity-0 ease-out',
      ].join(' ')}>
      <Header><slot name="header" /></Header>
    </div>
    <div
      class="min-height-0 relative w-full flex-grow overflow-y-auto overflow-x-hidden"
      on:scroll={handleSidebarScroll}>
      <slot name="sidebar" />
    </div>
    <div
      class="relative border-t px-5 py-5 transition-colors duration-100"
      class:border-transparent={leftColumnTakeover}
      class:border-gray-100={!leftColumnTakeover}>
      <LanguagePicker />
    </div>
  </div>
  {#if !leftColumnTakeover}
    <div
      class="z-0 h-screen overflow-hidden transition-transform lg:transform-none"
      class:-translate-x-full={$sidebarLayoutPageState === 1}>
      <!-- Mobile header -->
      <div
        class="z-50 flex items-center border-b border-gray-100 bg-white px-5 py-4 lg:hidden">
        <button
          class="flex shrink-0 items-center"
          on:click={() => sidebarLayoutPageState.back()}>
          <ChevronLeft class="relative -top-px h-5 w-5 pe-3" />
          <HeaderTypo><slot name="back-bar" /></HeaderTypo>
        </button>
      </div>

      <div class="z-10 h-full border-t border-gray-100 lg:border-none">
        <slot name="content" />
      </div>
    </div>
  {/if}
</div>
