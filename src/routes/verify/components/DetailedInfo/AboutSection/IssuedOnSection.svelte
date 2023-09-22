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
  import signedOn from '$assets/svg/color/logos/date.svg';
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from './AboutSectionIconContentRow.svelte';

  export let date: Date;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.about.issuedon')}</svelte:fragment>
  <AboutSectionIconContentRow slot="content">
    <img slot="icon" src={signedOn} alt="" class="w-4" />
    <svelte:fragment slot="content"
      ><span data-testid="Signed on"><FormattedDateTime {date} /></span>
    </svelte:fragment>
  </AboutSectionIconContentRow>
</SubSection>
