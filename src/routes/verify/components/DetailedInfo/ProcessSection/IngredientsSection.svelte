<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import AiModel from '$assets/svg/monochrome/ai-model.svg?component';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import SmallAssetInfo from '../../AssetInfo/SmallAssetInfo.svelte';
  import type { Fallback } from '../../Thumbnail/ThumbnailImage.svelte';

  export let ingredients: AssetData[];

  const fallbackThumbnailMap: Record<string, Fallback> = {
    model: AiModel,
  };
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.ingredients')}</svelte:fragment>
  <div slot="content" class="flex flex-col gap-3">
    {#each ingredients as ingredient}
      <SmallAssetInfo
        assetData={ingredient}
        hideNoCrStatus={ingredient.dataType === 'model'}
        fallbackThumbnail={(ingredient.dataType &&
          fallbackThumbnailMap[ingredient.dataType]) ||
          null}>
        <span slot="name" title={ingredient.title ?? $_('asset.defaultTitle')}
          >{ingredient.title ?? $_('asset.defaultTitle')}</span
        ></SmallAssetInfo>
    {/each}
  </div></SubSection>
