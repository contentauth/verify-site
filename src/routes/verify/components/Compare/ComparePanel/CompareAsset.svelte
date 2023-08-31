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
  import type { CompareAssetStore } from '../../../stores/compareAsset';

  export let compareAssetStore: CompareAssetStore;
</script>

<div
  class="m-2 rounded border p-2"
  class:bg-blue-100={$compareAssetStore.isSelected}
  class:border-gray-900={$compareAssetStore.isActive}>
  <button on:click={$compareAssetStore.select}>
    {$compareAssetStore.id} - {$compareAssetStore.title}
  </button>
</div>
