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
  import { focusTrap } from 'svelte-focus-trap';
  import { fade } from 'svelte/transition';

  export let label: string;
</script>

<div
  role="dialog"
  aria-modal="true"
  aria-live="polite"
  aria-label={label}
  class="pointer-events-none fixed inset-0 flex items-center justify-center"
  transition:fade|global={{ duration: 100 }}
  use:focusTrap>
  <div class="pointer-events-auto">
    <slot />
  </div>
</div>
