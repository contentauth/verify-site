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
