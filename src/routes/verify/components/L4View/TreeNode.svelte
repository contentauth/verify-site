<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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
  import { groupBy, isEqual, sortBy, toPairs } from 'lodash';
  import { verifyStore } from '../../stores/verifyStore';

  export let data: any;
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;

  const { selectL4Node, selectedL4Node } = verifyStore;

  $: padding = `${data.padding[1]}px ${data.padding[0]}px`;
  $: selectedManifest = $selectedL4Node?.[0] === data.uri;
  $: assertions = sortBy(
    toPairs(groupBy(data.assertions, 'label')),
    (x) => x[0],
  );
  $: tx = x - width / 2;
  $: ty = y - height / 2;
  $: style = `width: ${width}px; height: ${height}px; padding: ${padding}; transform: translate3d(${tx}px, ${ty}px, 0)`;
</script>

<div
  class="absolute left-0 top-0 overflow-hidden bg-transparent transition-all focus:shadow motion-reduce:transition-none"
  {style}>
  <div
    class="flex h-full w-full flex-col overflow-hidden rounded-lg border-2 bg-white p-4 transition-colors"
    class:border-blue-900={selectedManifest}>
    <div class="pb-3">
      <div class="text-header">Manifest</div>
      <div class="truncate text-informational text-gray-500">{data.uri}</div>
    </div>
    <button
      on:click={() => selectL4Node(data.signatureInfo.ref)}
      class={[
        `pointer-events-auto mb-4 flex h-14 items-center rounded border p-3 transition-colors`,
        isEqual(data.signatureInfo.ref, $selectedL4Node)
          ? `border-blue-900 bg-blue-900 text-white`
          : `bg-brand-yellow-200 hover:border-brand-yellow-1400 hover:text-brand-yellow-1400 border-brand-yellow-400`,
      ].join(' ')}>
      <div>
        <div class="text-l4-section-header">Signature</div>
        <div class="truncate text-informational opacity-50">
          {data.signatureInfo.issuer_org}
        </div>
      </div>
    </button>
    <button
      on:click={() => selectL4Node(data.claim.ref)}
      class={[
        `pointer-events-auto mb-4 flex h-14 items-center rounded border p-3 transition-colors`,
        isEqual(data.claim.ref, $selectedL4Node)
          ? `border-blue-900 bg-blue-900 text-white`
          : `bg-brand-blue-200 hover:border-brand-blue-1400 hover:text-brand-blue-1400 border-brand-blue-400`,
      ].join(' ')}>
      <div class="text-l4-section-header">Claim</div>
    </button>
    <div class="bg-brand-red-200 border-brand-red-400 mb-4 rounded border p-3">
      <div class="flex items-center pb-3">
        <div class="text-l4-section-header">Assertion store</div>
      </div>
      {#each assertions as [label, instances]}
        <button
          on:click={() => selectL4Node(instances[0].ref)}
          class={[
            `pointer-events-auto mb-1 flex w-full items-center justify-between rounded border p-2 text-informational transition-colors`,
            isEqual(instances[0].ref, $selectedL4Node)
              ? `border-blue-900 bg-blue-900 text-white`
              : `border-brand-red-400 bg-white hover:border-brand-red hover:text-brand-red`,
          ].join(' ')}>
          <div class="truncate">{label}</div>
          {#if instances.length > 1}
            <div
              class="flex items-center rounded-full border border-gray-300 px-2 text-[0.75rem] text-gray-500">
              <div>{instances.length}</div>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>
