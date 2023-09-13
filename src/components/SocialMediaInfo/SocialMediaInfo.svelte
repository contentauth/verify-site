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
  import Link from '../typography/Link.svelte';
  import SmallDescription from '../typography/SmallDescription.svelte';

  export let link: string;
  export let username: string;
  export let appName: string;
</script>

<div class="flex flex-col">
  <Link><a class="break-all" href={link}>{username}</a></Link>
  <div class="pt-0.5">
    <SmallDescription>{appName}</SmallDescription>
  </div>
</div>
