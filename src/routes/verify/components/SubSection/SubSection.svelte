<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Label from '$src/components/typography/Label.svelte';
</script>

<div class="pt-4">
  <div class="pb-2.5">
    <Label><slot name="title" /></Label>
  </div>
  <div><slot name="content" /></div>
</div>
