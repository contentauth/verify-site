<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import BaseLink from '../BaseLink/BaseLink.svelte';
  import Header from '../typography/Header.svelte';

  export let href = `/`;
</script>

<BaseLink class="px-5" {href}><Header><slot /></Header></BaseLink>
