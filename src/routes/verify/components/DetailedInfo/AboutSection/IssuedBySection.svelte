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
  export let issuedBy: string;
  export let organization: string | undefined = undefined;
  export let trustSource: 'official' | 'legacy' | 'none' = 'none';
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.about.issuedby')}</svelte:fragment>
  <div slot="content">
    <div class="flex justify-between">
      <AboutSectionContentRow>
        <svelte:fragment slot="content">
          {#if trustSource === 'official' && organization}
            <div class="flex flex-col leading-snug">
              <span class="text-generalSm font-medium">{issuedBy}</span>
              <span class="text-xs text-gray-600">{organization}</span>
            </div>
          {:else}
            {issuedBy}
          {/if}
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
