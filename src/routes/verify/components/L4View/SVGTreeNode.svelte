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
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;
</script>

<g transform={`translate(${x}, ${y})`}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <rect
    tabindex="-1"
    role="button"
    on:click
    {height}
    {width}
    x={-width / 2}
    y={-height / 2}
    rx={6}
    ry={6}
    class="pointer-events-none fill-current text-gray-300 opacity-0 focus:outline-none" />
</g>
