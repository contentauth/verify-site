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
  import L1Incomplete from '$assets/svg/color/cr-icon-incomplete-fill.svg?component';
  import L1Invalid from '$assets/svg/color/cr-icon-invalid-fill.svg?component';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { _ } from 'svelte-i18n';
  import type { ReadableAssetStore } from '../../stores/asset';
  import AssetInfoDate from '../AssetInfo/AssetInfoDate.svelte';
  import TreeL1 from './TreeL1.svelte';

  export let assetStore: ReadableAssetStore;
  export let parent: HierarchyPointNode<ReadableAssetStore> | null;
  export let transformScale: number;

  $: L1IconSize = transformScale >= 0.1 ? 2 : 1.3;
  $: date = $assetStore.manifestData?.date;
  $: issuer = $assetStore.manifestData?.signatureInfo?.issuer;
  $: statusCode = $assetStore.validationResult?.statusCode;
  $: hasCredentials =
    !!$assetStore.manifestData?.signatureInfo?.cert_serial_number;
</script>

{#if statusCode === 'valid' && hasCredentials}
  <TreeL1 {assetStore} {parent} {transformScale}>
    <L1Icon
      width="{L1IconSize}rem"
      height="{L1IconSize}rem"
      class="z-10 me-2 mt-1"
      slot="icon" />
    <svelte:fragment slot="string">
      {#if date}<AssetInfoDate {date} />
      {:else}
        {issuer}{/if}
    </svelte:fragment>
  </TreeL1>
{:else if statusCode === 'incomplete'}
  <TreeL1 {assetStore} {parent} {transformScale}>
    <L1Incomplete
      width="{L1IconSize}rem"
      height="{L1IconSize}rem"
      class="z-10 me-2 mt-1"
      slot="icon" />
    <svelte:fragment slot="string">
      {$_('assetInfo.incomplete')}
    </svelte:fragment>
  </TreeL1>
{:else if statusCode == 'invalid'}
  <TreeL1 {assetStore} {parent} {transformScale}>
    <L1Invalid
      width="{L1IconSize}rem"
      height="{L1IconSize}rem"
      class="z-10 me-2 mt-1"
      slot="icon" />
    <svelte:fragment slot="string">
      {$_('assetInfo.invalid')}
    </svelte:fragment>
  </TreeL1>
{/if}
