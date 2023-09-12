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

<script>
  import Alert from '$assets/svg/monochrome/alert.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import Button from '$src/routes/verify/components/Button/Button.svelte';
  import { _ } from 'svelte-i18n';
  import { closeModal } from 'svelte-modals';
  import HeaderContentModal from '../HeaderContentModal/HeaderContentModal.svelte';

  // provided by ModalContainer.svelte
  export let isOpen;
</script>

{#if isOpen}
  <HeaderContentModal
    label={$_('dialog.error.manifestSearchConnectionIssue.title')}>
    <div class="flex items-center justify-between" slot="header">
      <BodyBold
        ><h2>
          {$_('dialog.error.manifestSearchConnectionIssue.title')}
        </h2></BodyBold>
      <span class="text-red-900">
        <Alert />
      </span>
    </div>
    <Body slot="content">
      {$_('dialog.error.manifestSearchConnectionIssue.message')}
    </Body>
    <Button slot="buttons" size="m" on:click={closeModal}
      >{$_('dialog.OK')}</Button>
  </HeaderContentModal>
{/if}
