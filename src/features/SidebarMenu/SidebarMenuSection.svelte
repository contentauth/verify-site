<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  export let title: undefined | string = undefined;
</script>

{#if title}
  <div class="text-sm mt-8 px-7 pb-2.5 font-medium text-gray-500">{title}</div>
{/if}
<div class="pb-7"><slot /></div>
