<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import help from '$assets/svg/monochrome/help.svg';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import AboutSectionContentRow from './AboutSectionIconContentRow.svelte';

  let showTooltip = false;
  export let commonName: string | undefined = undefined;
  export let issuer: string | undefined = undefined;
  export let organizationalUnit: string | undefined = undefined;
  export let country: string | undefined = undefined;
  export let trustSource: 'official' | 'legacy' | 'none' = 'none';

  // Reactively build the C2PA Conformance Explorer URL with the available DN fields
  $: conformanceUrl = (() => {
    const params = new URLSearchParams();
    if (commonName) params.set('cn', commonName);
    if (issuer) params.set('o', issuer);
    if (organizationalUnit) params.set('ou', organizationalUnit);
    if (country) params.set('c', country);
    return `https://spec.c2pa.org/conformance-explorer/?${params.toString()}`;
  })();
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.about.issuedby')}</svelte:fragment>
  <div slot="content">
    <div class="flex justify-between">
      <AboutSectionContentRow>
        <svelte:fragment slot="content">
          <div class="flex flex-col items-start gap-1.5">
            <!-- Identity Block -->
            {#if trustSource === 'official' && commonName && issuer && commonName !== issuer}
              <div class="flex flex-col leading-snug">
                <span class="text-generalSm font-medium">{commonName}</span>
                <span class="text-xs text-gray-600">{issuer}</span>
              </div>
            {:else}
              <span class="text-generalSm font-medium">{issuer || commonName}</span>
            {/if}

            <!-- Trust Level Badge & CPL Link -->
            {#if trustSource === 'official'}
              <div class="flex flex-col items-start">
                <span class="bg-[#374151] text-white px-1.5 py-0.5 rounded-sm text-xs font-medium">Conformant</span>
                <a 
                  href={conformanceUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  class="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors mt-2"
                >
                  View on the C2PA Conforming Products List ↗
                </a>
              </div>
            {:else if trustSource === 'legacy'}
              <span class="bg-[#fef3c7] text-[#92400e] px-1.5 py-0.5 rounded-sm text-xs font-medium">Legacy trust</span>
            {/if}
          </div>
        </svelte:fragment>
      </AboutSectionContentRow>
      <button on:click={() => (showTooltip = !showTooltip)}
        ><img
          src={help}
          alt={$_('sidebar.verify.search.tooltip.help')} /></button>
    </div>
    {#if showTooltip}
      <Tooltip showTooltip on:showToolip={() => (showTooltip = !showTooltip)}
        ><div slot="tooltip">
          {$_('sidebar.verify.about.issuedby.tooltip')}
        </div>
      </Tooltip>
    {/if}
  </div>
</SubSection>
