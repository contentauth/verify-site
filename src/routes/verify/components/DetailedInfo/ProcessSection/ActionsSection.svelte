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
  import AlertOutlineIcon from '$assets/svg/color/alert-outline.svg?component';
  import Link from '$src/components/typography/Link.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { DATA_PRIVACY_URL } from '$src/lib/config';
  import type { TranslatedDictionaryCategory } from 'c2pa';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let editsAndActivity: NonNullable<TranslatedDictionaryCategory[]>;
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
          <span>{category.label}</span>
          <span class="text-gray-600">{category.description}</span>
        </div></AboutSectionIconContentRow>
    {/each}
  </div>
</SubSection>
