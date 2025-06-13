<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import '@spectrum-web-components/button/sp-button.js';

  export let size: string;
  export let variant = 'accent';
  export let treatment = 'fill';
</script>

<sp-theme color="lightest" scale="medium">
  <!--  svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <sp-button {size} {variant} {treatment} on:click>
    <slot />
  </sp-button>
</sp-theme>
