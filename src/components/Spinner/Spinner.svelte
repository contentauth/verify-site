<script lang="ts">
  import '@spectrum-web-components/progress-circle/sp-progress-circle.js';
  import { _ } from 'svelte-i18n';

  export let size: 's' | 'm' | 'l' = 's';
</script>

<sp-theme color="lightest" scale="medium">
  <sp-progress-circle
    label={$_('spinner.loading')}
    indeterminate="true"
    {size}
    class="loader" />
</sp-theme>
