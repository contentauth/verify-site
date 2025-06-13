<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import Body from '$src/components/typography/Body.svelte';
  import Header from '$src/components/typography/Header.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import DetailedInfo from '../../DetailedInfo/DetailedInfo.svelte';

  export let assetData: Readable<AssetData | null>;

  // It's horrible, only necessary because Svelte doesn't support TS expressions in templates (no casting)
  const assetDataNonNull = assetData as Readable<AssetData>;
</script>

{#if $assetData}
  <DetailedInfo on:close assetData={assetDataNonNull} />
{:else}
  <div class="flex flex-col pe-8 ps-4 pt-4">
    <Header>{$_('sidebar.verify.compare.null.title')}</Header>
    <div class="pt-1">
      <Body
        ><span class="text-gray-500">
          {$_('sidebar.verify.compare.null.description')}</span
        ></Body>
    </div>
  </div>
{/if}
