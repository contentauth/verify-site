<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  export let expanded = true;
  export let hasBorder = true;
  export let hasPadding = true;
</script>

<div class="border-gray-100" class:border-b={hasBorder} class:py-5={hasPadding}>
  <slot name="headerSection" />
  <div class:hidden={!expanded}>
    <slot name="content" />
  </div>
</div>
