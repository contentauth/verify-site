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
  import EmptyImage from '$assets/svg/monochrome/missing-thumb-image.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import { _ } from 'svelte-i18n';
</script>

<EmptyImage class="h-40 w-40 text-gray-400"></EmptyImage>
<Body
  ><span class="text-center text-gray-500">
    {$_('sidebar.verify.compare.null.picture')}</span
  ></Body>
