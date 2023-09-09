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
  import EmptyImage from '$assets/svg/monochrome/emptyImageGray.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import type { DragEvent } from '@interactjs/types';
  import interact from 'interactjs';
  import { onMount } from 'svelte';
  import cssVars from 'svelte-css-vars';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import type { CompareSelectedAssetStore } from '../../../stores/compareSelectedAsset';

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
  ``;
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
</script>

<div class="flex justify-center">
  <div class="inner" use:cssVars={styles}>
    <div class="slider" bind:this={slider}>
      <div class="handle">
        <div>
          <ChevronLeft width="16px" height="16px" class="text-gray-700" />
          <ChevronLeft
            width="16px"
            height="16px"
            class="rotate-180 text-gray-700" />
        </div>
      </div>
    </div>
    <div class="primary">
      <div class="thumbnail flex">
        {#if primaryAsset !== null}
          <img src={$primaryAsset?.thumbnail} alt="" />
        {:else}
          <div class="flex w-[50%] flex-col items-center self-center">
            <EmptyImage class="h-40 w-40 "></EmptyImage>
            <Body
              ><span class=" text-center text-gray-500">
                {$_('sidebar.verify.compare.null.picture')}</span
              ></Body>
          </div>
        {/if}
      </div>
    </div>
    <div class="secondary">
      <div class="thumbnail flex">
        {#if secondaryAsset !== null}
          <img src={$secondaryAsset?.thumbnail} alt="" />
        {:else}
          <div
            class="ms-[376px] flex w-[50%] flex-col items-center self-center">
            <EmptyImage class="h-40 w-40 "></EmptyImage>
            <Body
              ><span class="text-center text-gray-500">
                {$_('sidebar.verify.compare.null.picture')}</span
              ></Body>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .inner {
    @apply pointer-events-none relative select-none;
    width: var(--width);
    height: var(--height);
  }
  .primary,
  .secondary {
    @apply pointer-events-none absolute top-0 h-full overflow-hidden;
  }
  .primary {
    left: 0;
    width: var(--leftWidth);
  }
  .secondary {
    right: 0;
    width: var(--rightWidth);
  }
  .secondary .thumbnail {
    float: right;
  }
  .thumbnail {
    @apply pointer-events-auto;
    width: var(--width);
    height: var(--height);
  }
  .thumbnail img {
    @apply h-full w-full object-contain object-center;
    width: var(--width);
    height: var(--height);
  }
  .slider {
    @apply pointer-events-none absolute bottom-0 top-0 z-10 border-l border-r border-gray-300 bg-white;
    transform: translateX(-2px);
    width: 4px;
    left: var(--leftWidth);
    touch-action: none;
  }
  .handle {
    @apply pointer-events-auto absolute flex select-none items-center justify-center rounded-full border border-gray-300 bg-white;
    top: 50%;
    width: 32px;
    height: 32px;
    transform: translate(-14px, -15px);
  }
  .handle > div {
    @apply relative flex;
  }
</style>
