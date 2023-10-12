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
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';
  import Toast from './Toast.svelte';
  import { toast } from './store/toastState';
</script>

<ul
  class="pointer-events-none absolute inset-0 flex flex-col items-center justify-end overflow-hidden px-4 pb-10"
  role="alert">
  {#each $toast as toastItem, idx (toastItem.id)}
    <li
      data-testid={`toast-${idx}`}
      class="mt-2"
      in:fly={{ y: 128 }}
      out:fade={{ duration: 100 }}
      animate:flip={{ duration: 100 }}>
      <Toast {toastItem} />
    </li>
  {/each}
</ul>
