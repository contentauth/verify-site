<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';

  export let date: Date;
</script>

<span data-testid="signedOn"><FormattedDateTime {date} noTime /></span>
