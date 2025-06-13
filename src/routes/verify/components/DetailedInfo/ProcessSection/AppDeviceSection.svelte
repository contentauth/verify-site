<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { ClaimGeneratorDisplayInfo } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let generator: ClaimGeneratorDisplayInfo;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.app')}</svelte:fragment>
  <AboutSectionIconContentRow slot="content">
    <div slot="content" class="break-all">{generator.label}</div>
  </AboutSectionIconContentRow>
</SubSection>
