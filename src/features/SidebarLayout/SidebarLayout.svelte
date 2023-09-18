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
<script>
  import ChevronLeft from '$assets/svg/monochrome/chevron-left.svg?component';
  import Header from '$src/components/Header/Header.svelte';
  import LanguagePicker from '$src/components/LanguagePicker/LanguagePicker.svelte';
  import HeaderTypo from '$src/components/typography/Header.svelte';
  import { sidebarLayoutPageState } from './store/sidebarLayoutPageState';

  export let leftColumnTakeover = false;
</script>

<div
  class={[
    'bg-gray-40 grid h-screen grid-cols-[100vw_100vw] overflow-hidden transition-colors duration-100',
    !leftColumnTakeover ? 'lg:grid-cols-[theme(spacing.sidebar)_auto]' : '',
  ].join(' ')}>
  <div class="flex flex-col border-gray-100 bg-white lg:border-e-2">
    <Header><slot name="header" /></Header>
    <div
      class={[
        'relative flex-grow border-t-2 transition-colors duration-100',
        leftColumnTakeover ? 'border-transparent' : 'border-gray-100',
      ].join(' ')}>
      <slot name="sidebar" />
    </div>
    <LanguagePicker />
  </div>
  {#if !leftColumnTakeover}
    <div
      class="z-0 h-screen overflow-hidden transition-transform lg:transform-none"
      class:-translate-x-full={$sidebarLayoutPageState === 1}>
      <div
        class="flex h-header items-center border-b border-gray-100 px-6 lg:hidden">
        <button
          class="flex items-center"
          on:click={() => sidebarLayoutPageState.back()}>
          <ChevronLeft class="pe-3" />
          <HeaderTypo><slot name="back-bar" /></HeaderTypo>
        </button>
      </div>

      <div class="h-full border-t border-gray-100 lg:border-none">
        <slot name="content" />
      </div>
    </div>
  {/if}
</div>
