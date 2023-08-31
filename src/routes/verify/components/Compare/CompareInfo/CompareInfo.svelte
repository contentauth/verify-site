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
  import type { AssetData } from '$src/lib/asset';
  import type { Readable } from 'svelte/store';
  import DetailedInfo from '../../DetailedInfo/DetailedInfo.svelte';

  export let assetData: Readable<AssetData | null>;

  // It's horrible, only necessary because Svelte doesn't support TS expressions in templates (no casting)
  const assetDataNonNull = assetData as Readable<AssetData>;
</script>

{#if $assetData !== null}
  <DetailedInfo on:close assetData={assetDataNonNull} />
{:else}
  Null state pls implement
{/if}
