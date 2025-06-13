<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import Body from '$src/components/typography/Body.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';

  export let manifestData: ManifestData;

  $: exif = manifestData.exif;
  $: captureDetails = exif?.captureDetails;
  $: dimensions =
    captureDetails?.width && captureDetails?.height
      ? [captureDetails.width, captureDetails.height].join(' x ')
      : null;
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
          <div class="break-word" slot="content">
            <Body>{exif.creator}</Body>
          </div>
        </SubSection>
      {/if}
      {#if exif.copyright}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.copyright')}
          </svelte:fragment>
          <div class="break-word" slot="content">
            <Body>{exif.copyright}</Body>
          </div>
        </SubSection>
      {/if}
      {#if exif.captureDate}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.captureDate')}
          </svelte:fragment>
          <div class="break-word" slot="content">
            <Body>
              <FormattedDateTime date={exif.captureDate} />
            </Body>
          </div>
        </SubSection>
      {/if}
      {#if captureDetails?.cameraModel || captureDetails?.lensModel || dimensions}
        <div class="mt-5 space-y-2 rounded bg-gray-40 p-3">
          <Body>
            {#if captureDetails?.cameraModel}
              <div>{captureDetails.cameraModel}</div>
            {/if}
            {#if captureDetails?.lensModel}
              <div>{captureDetails.lensModel}</div>
            {/if}
            {#if dimensions}
              <div>{dimensions}</div>
            {/if}
          </Body>
          <div
            class="mt-2 flex w-full justify-between border-t border-gray-200 pt-2">
            {#if captureDetails?.iso}
              <div><Body>ISO {captureDetails.iso}</Body></div>
            {/if}
            {#if captureDetails?.focalLength}
              <div><Body>{captureDetails.focalLength}mm</Body></div>
            {/if}
            {#if captureDetails?.fNumber}
              <div><Body>f/{captureDetails.fNumber}</Body></div>
            {/if}
            {#if captureDetails?.exposureTime}
              <div>
                <Body>
                  {captureDetails.exposureTime}
                  {$_('sidebar.verify.cameraCapture.secondSuffix')}
                </Body>
              </div>
            {/if}
          </div>
        </div>
      {/if}
      {#if exif.mapUrl}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.approximateLocation')}
          </svelte:fragment>
          <div slot="content">
            <img
              src={exif.mapUrl}
              alt={$_('sidebar.verify.cameraCapture.mapAltText')}
              class="h-auto w-full rounded" />
          </div>
        </SubSection>
      {/if}
    </svelte:fragment>
  </CollapsibleSection>
{/if}
