<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script>
  import { page } from '$app/stores';
  import BaseLink from '../components/BaseLink/BaseLink.svelte';
</script>

<div class="error">
  <div class="text-[12rem] text-body-bold text-gray-900">{$page.status}</div>
  <div class="text-[1.75rem] text-body text-gray-900">
    {$page.error.message}.
    <span class="cursor-pointer text-blue-900 underline"
      ><BaseLink href="/">Go back</BaseLink></span>
  </div>
</div>

<style>
  .error {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
