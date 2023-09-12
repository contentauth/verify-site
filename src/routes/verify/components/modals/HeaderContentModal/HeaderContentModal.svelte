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
  import BaseModal from '../BaseModal/BaseModal.svelte';

  export let label: string;
</script>

<BaseModal {label}>
  <div class="m-2 w-full max-w-sm rounded bg-white p-7">
    <div class="mb-5 border-b-2 pb-5">
      <slot name="header" />
    </div>
    <slot name="content" />
    <div class="flex justify-end pt-10">
      <slot name="buttons" />
    </div>
  </div>
</BaseModal>
