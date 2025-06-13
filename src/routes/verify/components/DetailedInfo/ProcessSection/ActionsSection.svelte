<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import AlertOutlineIcon from '$assets/svg/color/alert-outline.svg?component';
  import Link from '$src/components/typography/Link.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { DATA_PRIVACY_URL } from '$src/lib/config';
  import type { TranslatedDictionaryCategory } from 'c2pa';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let editsAndActivity: NonNullable<TranslatedDictionaryCategory[]>;
  export let hasInference: boolean;
  export let reviewRatings: ManifestData['reviewRatings'];
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.actions')}</svelte:fragment>
  <div class="flex flex-col gap-2.5" slot="content">
    {#if reviewRatings.hasUnknownActions || reviewRatings.wasPossiblyModified}
      <AboutSectionIconContentRow>
        <AlertOutlineIcon slot="icon" width="1rem" height="1rem" />
        <div slot="content" class="italic text-gray-900">
          <span>{$_('reviewRatings.unknownActions')}</span>
          <a href={DATA_PRIVACY_URL} target="_blank" rel="noreferrer"
            ><Link>{$_('linkText.learnMore')}</Link></a>
        </div></AboutSectionIconContentRow>
    {/if}
    {#each editsAndActivity as category}
      <AboutSectionIconContentRow>
        <svelte:fragment slot="icon">
          {#if category.icon}
            <img
              src={category.icon}
              alt={category.label}
              class="w-4 brightness-0 filter" />
          {/if}
        </svelte:fragment>
        <div slot="content" class="flex flex-col">
          {#if category.id === 'c2pa.created' && hasInference}
            <span
              >{$_(
                'sidebar.verify.process.actions.reference.unknown.title',
              )}</span>
            <span class="text-gray-600"
              >{$_(
                'sidebar.verify.process.actions.reference.unknown.description',
              )}</span>
          {:else}
            <span>{category.label}</span>
            <span class="text-gray-600">{category.description}</span>
          {/if}
        </div></AboutSectionIconContentRow>
    {/each}
  </div>
</SubSection>
