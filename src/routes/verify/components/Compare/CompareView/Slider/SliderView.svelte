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
  import ChevronLeft from '$assets/svg/monochrome/back-arrow.svg?component';
  import type { DragEvent } from '@interactjs/types';
  import interact from 'interactjs';
  import { onMount } from 'svelte';
  import cssVars from 'svelte-css-vars';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import type { CompareSelectedAssetStore } from '../../../../stores/compareSelectedAsset';
  import NullState from '../NullState.svelte';

  export let selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;
  let primaryAsset: CompareSelectedAssetStore | null;
  let secondaryAsset: CompareSelectedAssetStore | null;
  const MIN_SIDE_PX = 752;
  let width = 0;
  let height = 0;
  let side = 0;
  let selectorHeight = 0;
  let slider: HTMLDivElement;
  let sliderX = 0.5;

  $: {
    [primaryAsset, secondaryAsset] = $selectedAssets;
  }
  $: {
    const padding = 20;
    side = Math.max(
      MIN_SIDE_PX,
      Math.min(width, height) - padding * 2 - selectorHeight,
    );
  }

  $: styles = {
    width: `${side}px`,
    height: `${side}px`,
    leftWidth: `${sliderX * 100}%`,
    rightWidth: `${100 - sliderX * 100}%`,
  };

  const restrictToParent = interact.modifiers.restrict({
    restriction: 'parent',
    elementRect: { left: 0, right: 0, top: 1, bottom: 1 },
  });
  const snap = interact.modifiers.snap({
    range: 15,
    targets: [{ x: 0 }, () => ({ x: side / 2 }), () => ({ x: side })],
    relativePoints: [{ x: 0, y: 0 }],
  });

  onMount(() => {
    let origSliderX: number;
    interact(slider).draggable({
      origin: 'parent',
      modifiers: [restrictToParent, snap],
      listeners: {
        start() {
          origSliderX = sliderX;
        },
        move(evt: DragEvent) {
          const deltaX = evt.pageX - evt.x0 - 2;
          const newPos = side * origSliderX + deltaX;
          sliderX = Math.min(newPos / side, 1);
        },
      },
    });

    return () => interact(slider).unset();
  });
  $: primaryTitle = $primaryAsset
    ? $primaryAsset.title
    : $_('sidebar.verify.compare.noAssetSelected');
  $: secondaryTitle = $secondaryAsset
    ? $secondaryAsset.title
    : $_('sidebar.verify.compare.noAssetSelected');
  $: ariaLabel = $_('sidebar.verify.compare.view.ariaLabel', {
    values: { primaryTitle: primaryTitle, secondaryTitle: secondaryTitle },
  });
</script>

<div class="flex justify-center px-6" aria-label={ariaLabel}>
  <div
    class="pointer-events-none relative h-[--height] w-[--width] select-none"
    use:cssVars={styles}>
    <div
      class="pointer-events-none absolute bottom-0 left-[--leftWidth] top-0 z-10 w-1 -translate-x-0.5 touch-none border-l border-r border-gray-300 bg-white"
      bind:this={slider}>
      <div
        class="pointer-events-auto absolute top-1/2 flex h-8 w-8 -translate-x-3.5 translate-y-[-15px] select-none items-center justify-center rounded-full border border-gray-300 bg-white"
        data-testId="slider-handle">
        <div class="relative flex">
          <ChevronLeft
            width="16px"
            height="16px"
            class="text-gray-700"
            aria-hidden="true" />
          <ChevronLeft
            width="16px"
            height="16px"
            class="rotate-180 text-gray-700"
            aria-hidden="true" />
        </div>
      </div>
    </div>
    <button
      on:click={$primaryAsset?.select}
      class={[
        'pointer-events-none absolute left-0 top-0 h-full w-[--leftWidth] cursor-default overflow-hidden',
        $primaryAsset?.isActive
          ? 'outline outline-offset-2 outline-blue-800'
          : '',
      ].join(' ')}>
      <div class="pointer-events-auto flex h-[--height] w-[--width]">
        {#if primaryAsset !== null && $primaryAsset?.thumbnail?.url}
          <img
            src={$primaryAsset?.thumbnail?.url}
            alt=""
            aria-hidden="true"
            class="h-[--height] w-[--width] cursor-pointer object-contain object-center" />
        {:else}
          <div class="flex w-[50%] flex-col items-center self-center">
            <NullState />
          </div>
        {/if}
      </div>
    </button>
    <button
      on:click={$secondaryAsset?.select}
      class={[
        'pointer-events-none absolute right-0 top-0 h-full w-[--rightWidth] cursor-default overflow-hidden',
        $secondaryAsset?.isActive
          ? 'outline outline-offset-2 outline-blue-800'
          : '',
      ].join(' ')}>
      <div
        class="pointer-events-auto float-right flex h-[--height] w-[--width]">
        {#if secondaryAsset !== null && $secondaryAsset?.thumbnail?.url}
          <img
            src={$secondaryAsset?.thumbnail?.url}
            alt=""
            aria-hidden="true"
            class="h-[--height] w-[--width] cursor-pointer object-contain object-center" />
        {:else}
          <div class="ms-[376px] flex w-1/2 flex-col items-center self-center">
            <NullState />
          </div>
        {/if}
      </div>
    </button>
  </div>
</div>
