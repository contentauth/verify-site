<!--
 Copyright 2021-2025 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const url = new URL($page.url.origin);

  const params = new URLSearchParams($page.url.searchParams);

  params.entries().forEach(([key, val]) => {
    url.searchParams.append(key, val);
  });

  goto(url);
</script>
