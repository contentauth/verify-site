<!-- Popup.svelte -->
<script>
  import X from '$assets/svg/home/x.svg';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let isOpen = false;

  function closePopup() {
    dispatch('close');
  }

  const data = [
    {
      id: 1,
      Notice:
        'This image combines multiple pieces of content. At least one was generated with an AI tool.',
      ProducedLabel: 'Produced by',
      ProducedValue: 'Benoit Lemoine',
      CompanyLabel: 'Company',
      CompanyValue: 'Area17',
      WebsiteLabel: 'Website',
      WebsiteValue: 'https://area17.com',
      CaptionLabel: 'Caption',
      CaptionValue:
        'Caption goes here and can wrap to multiple lines as needed',
      AppLabel: 'App or device used',
      AppValue: 'Adobe Photoshop 23.0.0',
      AItoolLabel: 'AI tool used',
      AItoolValue: 'Adobe Firefly',
      AdditionalLabel: 'Additional history',
      AdditionalValue: 'Yes',
    },
  ];
</script>

<!-- Desktop Popup -->
<div class="hidden md:flex">
  {#if isOpen && window.innerWidth >= 768}
    <div
      class="popup shadow-lg absolute right-[3.5rem] top-[1rem] z-[9999] mb-10 rounded-lg bg-brand-white pt-2"
      class:visible={isOpen}>
      <div class="h-full w-[256px] rounded-xl bg-brand-white">
        <div class="flex flex-col justify-center px-4 py-[0.625rem]">
          <h1 class=" text-popup-title font-bold">Content Credentials</h1>
          <p class="text-popup-text text-gray-900/60">
            Issued by Adobe Inc. on Feb 2. 2023
          </p>
        </div>
        <hr />
        <div class="px-4">
          {#each data as item}
            <div
              class="flex flex-row items-center gap-1 py-[0.625rem] text-popup-text">
              <div class="">{item.Notice}</div>
            </div>
            <hr class="py-1" />
            <div class="flex flex-row gap-1 py-[0.625rem]">
              <div class="pb-1 text-popup-text font-bold">
                {item.ProducedLabel}
              </div>
              <div class="text-popup-text">{item.ProducedValue}</div>
            </div>
            <hr class="pt-2" />
            <div class="flex flex-row gap-1 py-[0.625rem]">
              <div class="pb-1 text-popup-text font-bold">
                {item.CompanyLabel}
              </div>
              <div class="text-popup-text">{item.CompanyValue}</div>
            </div>
            <hr class="pt-2" />
            <div class="flex flex-row gap-1 py-[0.625rem]">
              <div class="pb-1 text-popup-text font-bold">
                {item.WebsiteLabel}
              </div>
              <div class="text-popup-text text-blue-700 underline">
                <a href={item.WebsiteValue}>{item.WebsiteValue}</a>
              </div>
            </div>
            <hr class="pt-2" />
            <div class="flex flex-col justify-center gap-1 py-[0.625rem]">
              <div class="py-1 text-popup-text font-bold">
                {item.CaptionLabel}
              </div>
              <div class="pb-1 text-popup-text">{item.CaptionValue}</div>
            </div>
            <hr class="pt-2" />
            <div class="flex flex-col justify-center gap-1 py-[0.625rem]">
              <div class="py-1 text-popup-text font-bold">
                {item.AppLabel}
              </div>
              <div class="pb-1 text-popup-text">{item.AppValue}</div>
            </div>
            <hr class="pt-2" />
            <div class="flex flex-row gap-1 py-[0.625rem]">
              <div class="pb-1 text-popup-text font-bold">
                {item.AdditionalLabel}
              </div>
              <div class="text-popup-text">{item.AdditionalValue}</div>
            </div>
          {/each}
        </div>
        <hr />
        <div class="pt-[1rem] pb-[1rem] h-[60px] w-full px-6 py-1">
          <button
            class="h-full w-full rounded-full bg-brand-yellow text-popup-text"
            >View more</button>
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
        class="top-rounded-shadow fixed bottom-0 h-auto w-screen rounded-t-xl bg-white p-0.5 text-popup-text">
        <div class="h-full rounded-xl bg-brand-white px-2 py-4">
          <div class="flex flex-row justify-between">
            <div class="py-3">
              <h1 class="px-6 pb-3 text-[24px] font-bold">
                Content Credentials
              </h1>
              <p class="px-6 text-gray-900/60">
                Issued by Adobe Inc. on Feb 2. 2023
              </p>
            </div>
            <button class="pb-6 pr-4" on:click={closePopup}>
              <img src={X} alt="close" />
            </button>
          </div>
          <hr />
          <div class="px-6 py-3">
            {#each data as item}
              <div class="flex flex-row items-center gap-1 py-2">
                <div class="pb-1 text-popup-text">{item.Notice}</div>
              </div>
              <hr class="py-1" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.ProducedLabel}</div>
                <div>{item.ProducedValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.CompanyLabel}</div>
                <div>{item.CompanyValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.WebsiteLabel}</div>
                <div class="text-blue-700 underline">
                  <a href={item.WebsiteValue}>{item.WebsiteValue}</a>
                </div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-col justify-center gap-1 py-2">
                <div class="py-1 font-bold">{item.CaptionLabel}</div>
                <div class="pb-1">{item.CaptionValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-col justify-center gap-1 py-2">
                <div class="py-1 font-bold">{item.AppLabel}</div>
                <div class="pb-1">{item.AppValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.AdditionalLabel}</div>
                <div>{item.AdditionalValue}</div>
              </div>
              <hr class="pt-2" />
            {/each}
          </div>
          <div class="h-[60px] w-full px-6 py-1">
            <button
              class="h-full w-full rounded-full bg-brand-yellow text-[1rem]"
              >View more</button>
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
