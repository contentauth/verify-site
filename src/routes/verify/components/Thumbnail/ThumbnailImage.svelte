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
  import { _ } from 'svelte-i18n';
  import fallback from '../../../../../assets/svg/monochrome/emptyImage.svg';

  export let thumbnail: string | null;
  export let fillMode: 'contain' | 'cover' = 'contain';

  $: thumbnailImg = thumbnail ?? fallback;
  $: thumbnailAltText =
    thumbnailImg == fallback ? $_('page.verify.emptyThumbnail') : '';
</script>

<img
  src={thumbnailImg}
  class={`h-full w-full object-${fillMode}`}
  alt={thumbnailAltText} />
