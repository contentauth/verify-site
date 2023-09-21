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
  import { fly } from 'svelte/transition';

  export let showPanel: boolean;
</script>

<div
  class="relative z-10 h-screen overflow-auto overflow-x-hidden border-gray-100 bg-white transition-transform sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
  class:-translate-y-full={showPanel}
  transition:fly={{ duration: 300, opacity: 0, x: 200 }}>
  <slot />
</div>
