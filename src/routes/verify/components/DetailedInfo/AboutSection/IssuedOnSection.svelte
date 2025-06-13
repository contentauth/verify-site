<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import signedOn from '$assets/svg/monochrome/date.svg';
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionContentRow from './AboutSectionIconContentRow.svelte';

  export let date: Date;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.about.issuedon')}</svelte:fragment>
  <AboutSectionContentRow slot="content">
    <img slot="icon" src={signedOn} alt="" class="w-4" />
    <svelte:fragment slot="content"
      ><span data-testid="signedOn"><FormattedDateTime {date} /></span>
    </svelte:fragment>
  </AboutSectionContentRow>
</SubSection>
