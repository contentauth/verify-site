<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import EmptyImage from '$assets/svg/monochrome/null-state.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import { _ } from 'svelte-i18n';
</script>

<div class="flex h-[45vh] flex-col justify-center">
  <EmptyImage class="h-40 w-40 self-center text-gray-600" />
  <Body
    ><span class="text-center text-gray-600">
      {$_('sidebar.verify.compare.null.picture')}</span
    ></Body>
</div>
