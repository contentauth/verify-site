<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { GenerativeInfo } from '$src/lib/selectors/generativeInfo';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let softwareAgents: GenerativeInfo['softwareAgents'];
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.credit.AI')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#each softwareAgents as softwareAgent}
      <AboutSectionIconContentRow>
        <svelte:fragment slot="content">
          {softwareAgent?.name}</svelte:fragment>
      </AboutSectionIconContentRow>
    {/each}
  </svelte:fragment>
</SubSection>
