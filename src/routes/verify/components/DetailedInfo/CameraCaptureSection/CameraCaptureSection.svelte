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
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';

  export let manifestData: ManifestData;

  $: exif = manifestData.exif;
  $: captureDetails = exif?.captureDetails;
  $: lensInfo = [
    captureDetails?.lensMake ?? '',
    captureDetails?.lensModel ?? '',
  ]
    .join(' ')
    .trim();
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
      {#if exif.captureDate}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.captureDate')}
          </svelte:fragment>
          <div class="break-word mt-2.5" slot="content">
            <FormattedDateTime date={exif.captureDate} />
          </div>
        </SubSection>
      {/if}
      <div class="rounded bg-gray-50 p-3 text-gray-600">
        <div>{captureDetails?.cameraMake}</div>
        {#if lensInfo}
          <div>{lensInfo}</div>
        {/if}
        <!-- <div class="flex">
          <div class="flex-grow">{dimensions.replace('x', ' x ')}</div>
          <div class="flex-grow">{fileSize} MB</div>
          <div class="flex-shrink">
            <div
              class="text-xs inline-block rounded bg-gray-400 px-1 text-white">
              JPEG
            </div>
          </div>
        </div>
        <div
          class="mt-2 flex w-full justify-between border-t border-gray-300 pt-2">
          <div>ISO {iso}</div>
          <div>{focalLength}mm</div>
          <div>f/{aperture}</div>
          <div>{shutterSpeed} s</div>
        </div> -->
      </div>
    </svelte:fragment>
  </CollapsibleSection>
{/if}
