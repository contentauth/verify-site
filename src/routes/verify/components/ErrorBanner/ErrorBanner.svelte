<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import ContentRow from '../IconContentRow/IconContentRow.svelte';

  export let type: 'info' | 'warning' | 'error' = 'info';
</script>

<div
  class="mx-5 mb-5 rounded p-2.5 text-white"
  class:bg-gray-600={type === 'info'}
  class:bg-orange-700={type === 'warning'}
  class:bg-red-1000={type === 'error'}>
  <ContentRow>
    <div class="grow" slot="content">
      <slot />
    </div>
  </ContentRow>
</div>
