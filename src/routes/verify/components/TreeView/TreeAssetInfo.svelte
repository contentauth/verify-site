<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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
  import L1Icon from '$assets/svg/color/cr-icon-fill.svg?component';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { _ } from 'svelte-i18n';

  import { get } from 'svelte/store';

  import { sineIn } from 'svelte/easing';
  import type { ReadableAssetStore } from '../../stores/asset';
  import AssetInfoDate from '../AssetInfo/AssetInfoDate.svelte';

  export let assetStore: ReadableAssetStore;
  export let parent: HierarchyPointNode<ReadableAssetStore> | null;
  export let transformScale: number;

  function L1SlidesIn(node, { duration }) {
    return {
      duration,
      easing: sineIn,
      css: (timer) => {
        return `
        clip-path: inset(0px ${timer * 180}px 0px 0px)

  		`;
      },
    };
  }
  function L1SlidesOut(node, { duration }) {
    return {
      duration,
      easing: sineIn,

      css: (timer) => {
        console.log('isscale', isScaleIncreasing);

        return `
        clip-path: inset(0px ${180 - timer * 180}px 0px 0px);
      
  		`;
      },
    };
  }
  let previous: number;
  let isScaleIncreasing: boolean;

  $: {
    if (previous !== undefined) {
      isScaleIncreasing = transformScale > previous ? true : false;
    }

    previous = transformScale;
  }

  $: title = $assetStore.title ?? $_('asset.defaultTitle');
  $: hasContentCredentials = $assetStore.manifestData
    ? $_('page.verify.hasCC.date', {
        values: { date: $assetStore.manifestData?.date },
      })
    : $_('sidebar.verify.noCC');
  $: parentData = parent?.data ? get(parent?.data) : null;
  $: parentTitle = parentData?.title;
  $: parentLabel =
    parent == null
      ? $_('sidebar.verify.compare.root')
      : $_('sidebar.verify.compare.child', {
          values: { parentTitle },
        });
  $: ariaLabel = $_('page.verify.treeNode.ariaLabel', {
    values: { title, hasContentCredentials, parentLabel },
  });
  $: L1toPinTransition = transformScale < 0.25 ? true : false;
  $: removeL1 = transformScale == 0.125 ? true : false;
  $: date = $assetStore.manifestData?.date;
  $: issuer = $assetStore.manifestData?.signatureInfo?.issuer;
  $: statusCode = $assetStore.validationResult?.statusCode;
  $: hasCredentials =
    !!$assetStore.manifestData?.signatureInfo?.cert_serial_number;
  $: scale = transformScale >= 0.5 ? 1 : 0.5 / transformScale;
  $: L1margin = transformScale >= 0.25 ? 1 : transformScale / 0.25;
</script>

{#if statusCode === 'valid' && hasCredentials}
  <div
    class="absolute flex"
    style="transform: scale({scale}); transform-origin: top left">
    {#if !L1toPinTransition}
      <div
        aria-label={ariaLabel}
        style="margin-inline-start: {L1margin}rem; margin-top:{L1margin}rem"
        class="flex items-center rounded-full py-1 pe-3 ps-1"
        class:bg-white={!removeL1}
        class:shadow-md={!removeL1}
        class:rounded-none={removeL1}>
        <L1Icon width="2rem" height="2rem" class="me-2" />

        <div class="rounded-full bg-white text-[1.7em]">
          {#if date}<AssetInfoDate {date} />{:else}
            {issuer}{/if}
        </div>
      </div>
    {:else if isScaleIncreasing}
      <div
        style="margin-inline-start: {L1margin}rem; margin-top:{L1margin}rem"
        class="flex items-center py-1 pe-3">
        <L1Icon width="2rem" height="2rem" class="me-2 shrink-0" />
        <div
          in:L1SlidesOut={{ duration: 500 }}
          aria-label={ariaLabel}
          class=" h-full w-full rounded-full bg-white ps-1 shadow-md">
          {#if !removeL1}
            <div class="rounded-full bg-white text-[1.7em]">
              {#if date}<AssetInfoDate {date} />{:else}
                {issuer}{/if}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div
        in:L1SlidesIn={{ duration: 250 }}
        aria-label={ariaLabel}
        style="margin-inline-start: {L1margin}rem; margin-top:{L1margin}rem"
        class="flex items-center rounded-full py-1 pe-3 ps-1"
        class:bg-white={!removeL1}
        class:shadow-md={!removeL1}
        class:rounded-none={removeL1}>
        <L1Icon width="2rem" height="2rem" class="me-2" />
        {#if !removeL1}
          <div class="rounded-full bg-white text-[1.7em]">
            {#if date}<AssetInfoDate {date} />{:else}
              {issuer}{/if}
          </div>
        {/if}
      </div>{/if}
  </div>
{/if}
