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
  import type { ReadableAssetStore } from '../../stores/asset';
  import AssetInfoDate from '../AssetInfo/AssetInfoDate.svelte';

  export let assetStore: ReadableAssetStore;
  export let parent: HierarchyPointNode<ReadableAssetStore> | null;
  export let transformScale: number;

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
  $: clipPathOffset = transformScale >= 0.25 ? 0 : 200;
  $: removeL1 = transformScale == 0.125 ? true : false;
  $: L1IconSize = transformScale >= 0.125 ? 2 : transformScale * 16;
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
    style="transform: scale({scale}); transform-origin: top left; margin-inline-start: {L1margin}rem; margin-top:{L1margin}rem;">
    <L1Icon
      width="{L1IconSize}rem"
      height="{L1IconSize}rem"
      class="z-10 me-2 mt-1" />
    <div
      aria-label={ariaLabel}
      style="clip-path: inset(-10px {clipPathOffset}px -10px 0px);"
      class="-ms-11 flex items-center rounded-full py-3 pe-3 ps-11 transition-all duration-150 motion-reduce:transition-none"
      class:bg-white={!removeL1}
      class:shadow-md={!removeL1}
      class:rounded-none={removeL1}>
      {#if !removeL1}
        <div class="rounded-full bg-white text-[1.7em]">
          {#if date}<AssetInfoDate {date} />{:else}
            {issuer}{/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
