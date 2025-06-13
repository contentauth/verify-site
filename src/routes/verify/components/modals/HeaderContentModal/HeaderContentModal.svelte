<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
