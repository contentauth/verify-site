<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Body from '$src/components/typography/Body.svelte';
  import IconContentRow from '../../IconContentRow/IconContentRow.svelte';
</script>

<IconContentRow>
  <slot slot="icon" name="icon" />
  <div class="min-w-0" slot="content"><Body><slot name="content" /></Body></div>
</IconContentRow>
