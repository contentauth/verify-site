<!-- Popup.svelte -->
<script lang="ts">
  import X from '$assets/svg/home/x.svg';
  import { selectGenerativeInfo } from '$src/lib/selectors/generativeInfo';
  import {
    selectFormattedGenerator,
    selectProducer,
    selectSocialAccounts,
    type ManifestStore,
  } from 'c2pa';
  import { createEventDispatcher } from 'svelte';
  import { _, date as formatDate } from 'svelte-i18n';

  const dispatch = createEventDispatcher();

  export let isOpen = false;
  export let manifestStore: ManifestStore;
  export let imageUrl: string;

  let activeManifest = manifestStore.activeManifest;
  let issuer = activeManifest.signatureInfo?.issuer;
  let issueDate = activeManifest.signatureInfo?.time
    ? new Date(activeManifest.signatureInfo.time)
    : null;
  let producer = selectProducer(activeManifest)?.name;
  let socialMedia = selectSocialAccounts(activeManifest)?.map((account) => ({
    name: account['@id']?.includes('behance')
      ? 'Behance'
      : account['@id']?.includes('instagram')
      ? 'Instagram'
      : null,
    url: account['@id'],
  }));
  let formattedGenerator = selectFormattedGenerator(activeManifest);
  let generativeInfo = selectGenerativeInfo(activeManifest);
  let generativeInfoType = generativeInfo?.type;
  let aiToolUsed = generativeInfo?.softwareAgents[0];
  let hasAdditionalHistory = !!activeManifest.ingredients.length;

  const verifyUrl = encodeURIComponent(`${window.origin}${imageUrl}`);

  function closePopup() {
    dispatch('close');
  }
</script>

<!-- New: Add background div -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="fixed inset-0 z-[9998] bg-black opacity-50"
  on:click={closePopup}
  class:hidden={!isOpen} />

<!-- Desktop Popup -->
<div class="hidden md:flex">
  {#if isOpen && window.innerWidth >= 768}
    <div
      class="popup shadow-lg absolute right-[3.5rem] top-[1rem] z-[9999] mb-10 rounded-lg bg-brand-white"
      class:visible={isOpen}>
      <div class="h-full w-64 rounded-xl bg-brand-white">
        <div class="justify-center px-4 py-[0.625rem]">
          <h1 class="text-popup-title font-bold">
            {$_('l2popup.title')}
          </h1>
          {#if issueDate}
            <p class="text-popup-text text-gray-900/60">
              {$_('l2popup.issuedBy', {
                values: {
                  issuer,
                  date: $formatDate(issueDate, { format: 'medium' }),
                },
              })}
            </p>
          {/if}
        </div>
        <hr />
        <div class="px-4">
          <div class="items-center py-[0.625rem] text-popup-text">
            {#if generativeInfoType === 'compositeWithTrainedAlgorithmicMedia'}
              {$_('contentSummary.compositeWithTrainedAlgorithmicMedia')}
            {:else if generativeInfoType === 'trainedAlgorithmicMedia'}
              {$_('contentSummary.trainedAlgorithmicMedia')}
            {/if}
          </div>
          <hr />
          {#if producer}
            <div class="py-[0.625rem]">
              <span class="pb-1 text-popup-text font-bold">
                {$_('l2popup.producedBy')}
              </span>
              <span class="text-popup-text">{producer}</span>
            </div>
            <hr />
          {/if}
          {#if socialMedia}
            <div class="py-[0.625rem]">
              <span class="pb-1 text-popup-text font-bold">
                {$_('l2popup.socialMedia')}
              </span>
              <span class="text-popup-text">
                {#each socialMedia as account, i}
                  <a
                    class=" cursor-pointer text-blue-900 underline"
                    href={account.url}>{account.name}</a
                  >{#if i < socialMedia.length - 1}{$_(
                      'wordListDelimiter',
                    )}{' '}
                  {/if}
                {/each}
              </span>
            </div>
            <hr />
          {/if}
          <div class="justify-center py-[0.625rem]">
            <span class="py-1 text-popup-text font-bold">
              {$_('l2popup.deviceUsed')}
            </span>
            <span class="whitespace-nowrap pb-1 text-popup-text"
              >{formattedGenerator}</span>
          </div>
          <hr />
          <div class="justify-center py-[0.625rem]">
            <span class="py-1 text-popup-text font-bold">
              {$_('l2popup.aiToolUsed')}
            </span>
            <span class="whitespace-nowrap pb-1 text-popup-text"
              >{aiToolUsed}</span>
          </div>
          {#if hasAdditionalHistory}
            <hr />
            <div class="py-[0.625rem]">
              <span class="pb-1 text-popup-text font-bold">
                {$_('l2popup.additionalHistory')}
              </span>
              <span class="text-popup-text">{$_('l2popup.yes')}</span>
            </div>
          {/if}
        </div>
        <hr />
        <div class="flex w-full flex-col p-4">
          <a
            href={`/verify?source=${verifyUrl}`}
            class="rounded-full bg-brand-yellow p-3 text-center text-body"
            >{$_('l2popup.inspect')}</a>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Mobile Popup -->
<div class="block">
  {#if isOpen && window.innerWidth < 768}
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center md:hidden">
      <div
        class="fixed bottom-0 h-auto w-screen rounded-t-xl bg-white p-0.5 text-popup-text shadow">
        <div class="h-full rounded-xl bg-brand-white px-2 py-4">
          <div class="flex px-4 py-[0.625rem]">
            <div>
              <h1 class="text-popup-title font-bold">
                {$_('l2popup.title')}
              </h1>
              {#if issueDate}
                <p class="text-popup-text text-gray-900/60">
                  {$_('l2popup.issuedBy', {
                    values: {
                      issuer,
                      date: $formatDate(issueDate, { format: 'medium' }),
                    },
                  })}
                </p>
              {/if}
            </div>
            <button class="ms-auto pb-6 pr-4" on:click={closePopup}>
              <img src={X} alt="close" />
            </button>
          </div>
          <hr />
          <div class="px-4">
            <div class="items-center py-[0.625rem] text-popup-text">
              {#if generativeInfoType === 'compositeWithTrainedAlgorithmicMedia'}
                {$_('contentSummary.compositeWithTrainedAlgorithmicMedia')}
              {:else if generativeInfoType === 'trainedAlgorithmicMedia'}
                {$_('contentSummary.trainedAlgorithmicMedia')}
              {/if}
            </div>
            <hr />
            {#if producer}
              <div class="py-[0.625rem]">
                <span class="pb-1 text-popup-text font-bold">
                  {$_('l2popup.producedBy')}
                </span>
                <span class="text-popup-text">{producer}</span>
              </div>
              <hr />
            {/if}
            {#if socialMedia}
              <div class="py-[0.625rem]">
                <span class="pb-1 text-popup-text font-bold">
                  {$_('l2popup.socialMedia')}
                </span>
                <span class="text-popup-text">
                  {#each socialMedia as account, i}
                    <a
                      class=" cursor-pointer text-blue-900 underline"
                      href={account.url}>{account.name}</a
                    >{#if i < socialMedia.length - 1}{$_(
                        'wordListDelimiter',
                      )}{' '}
                    {/if}
                  {/each}
                </span>
              </div>
              <hr />
            {/if}
            <div class="justify-center py-[0.625rem]">
              <span class="py-1 text-popup-text font-bold">
                {$_('l2popup.deviceUsed')}
              </span>
              <span class="whitespace-nowrap pb-1 text-popup-text"
                >{formattedGenerator}</span>
            </div>
            <hr />
            <div class="justify-center py-[0.625rem]">
              <span class="py-1 text-popup-text font-bold">
                {$_('l2popup.aiToolUsed')}
              </span>
              <span class="whitespace-nowrap pb-1 text-popup-text"
                >{aiToolUsed}</span>
            </div>
            {#if hasAdditionalHistory}
              <hr />
              <div class="py-[0.625rem]">
                <span class="pb-1 text-popup-text font-bold">
                  {$_('l2popup.additionalHistory')}
                </span>
                <span class="text-popup-text">{$_('l2popup.yes')}</span>
              </div>
            {/if}
          </div>

          <hr />
          <div class="flex w-full flex-col p-4">
            <a
              href={`/verify?source=${verifyUrl}`}
              class="rounded-full bg-brand-yellow p-3 text-center text-body"
              >{$_('l2popup.inspect')}</a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .popup {
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  }
</style>
