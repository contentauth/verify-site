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
  import { page } from '$app/stores';
  import Body from '$src/components/typography/Body.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import { SITE_ENV } from '$src/lib/config';
  import Button from '$src/routes/verify/components/Button/Button.svelte';
  import { _ } from 'svelte-i18n';
  import { closeModal } from 'svelte-modals';
  import { get } from 'svelte/store';
  import HeaderContentModal from '../HeaderContentModal/HeaderContentModal.svelte';

  // provided by ModalContainer.svelte
  export let isOpen: boolean;

  async function handleContinue() {
    closeModal();
    const legacyVerifyUrl =
      SITE_ENV === 'stage'
        ? 'https://verify-beta-stage.contentauthenticity.org'
        : 'https://verify-beta.contentauthenticity.org';

    const { search } = get(page).url;

    window.location.assign(`${legacyVerifyUrl}/inspect${search}`);
  }
</script>

{#if isOpen}
  <HeaderContentModal label={$_('dialog.error.legacyCredential.title')}>
    <BodyBold slot="header"
      ><h2>
        {$_('dialog.error.legacyCredential.title')}
      </h2></BodyBold>
    <Body slot="content">
      {$_('dialog.error.legacyCredential.message')}
    </Body>
    <div slot="buttons" class="flex gap-2.5">
      <Button
        treatment="outline"
        variant="secondary"
        size="m"
        on:click={closeModal}>{$_('dialog.cancel')}</Button>
      <Button size="m" on:click={handleContinue}
        >{$_('dialog.continue')}</Button>
    </div>
  </HeaderContentModal>
{/if}
