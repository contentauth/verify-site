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
  import Body from '$src/components/typography/Body.svelte';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { _ } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import type {
    ReadableAssetData,
    ReadableAssetStore,
  } from '../../stores/asset';
  import AssetInfoBase from '../AssetInfo/AssetInfoBase.svelte';
  import TreeThumbnail from '../Thumbnail/TreeThumbnail.svelte';

  export let data: any;
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;

  $: padding = `${data.padding[1]}px ${data.padding[0]}px`;
  $: tx = x - width / 2;
  $: ty = y - height / 2;
  $: style = `width: ${width}px; height: ${height}px; padding: ${padding}; transform: translate3d(${tx}px, ${ty}px, 0)`;
</script>

<div
  class="absolute left-0 top-0 bg-transparent transition-all focus:shadow motion-reduce:transition-none"
  {style}>
  <div
    class="flex h-full w-full flex-col overflow-hidden rounded border-2 bg-gray-200">
    Label: {data.label}
  </div>
</div>
