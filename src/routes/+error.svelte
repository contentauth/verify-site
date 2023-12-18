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
