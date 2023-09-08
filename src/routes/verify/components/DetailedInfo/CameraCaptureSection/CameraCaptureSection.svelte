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
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';

  export let manifestData: ManifestData;

  $: exif = manifestData.exif;
</script>

{#if exif}
  <CollapsibleSection>
    <svelte:fragment slot="header"
      >{$_('sidebar.cameraCapture')}</svelte:fragment>
    <svelte:fragment slot="description">
      {$_('sidebar.verify.cameraCapture.description')}</svelte:fragment>
    <svelte:fragment slot="content">
      {#if exif.creator}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.creator')}
          </svelte:fragment>
          <div class="break-word mt-2.5" slot="content">{exif.creator}</div>
        </SubSection>
      {/if}
      {#if exif.copyright}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.copyright')}
          </svelte:fragment>
          <div class="break-word mt-2.5" slot="content">{exif.copyright}</div>
        </SubSection>
      {/if}
    </svelte:fragment>
  </CollapsibleSection>
{/if}
