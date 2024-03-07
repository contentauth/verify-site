<script lang="ts">
  import Pin from '$assets/svg/logos/homepage/pin.svg?component';
  import { getSdk, getToolkitSettings } from '$src/lib/sdk';
  // import Pin from '$assets/svg/color/cr-icon-fill.svg';
  import Popup from './Popup.svelte'; // Import the DesktopPopup component

  export let imageUrl: string;
  export let alt: string;
  let isPopupOpen = false;

  async function getManifestStore() {
    const sdk = await getSdk();
    const { manifestStore } = await sdk.read(imageUrl, {
      settings: await getToolkitSettings(),
    });

    return manifestStore;
  }

  function togglePopup() {
    isPopupOpen = !isPopupOpen;
  }

  function handleClose() {
    isPopupOpen = false;
  }
</script>

<div class="group relative aspect-[3/2]">
  <img
    src={imageUrl}
    {alt}
    class="h-full w-full rounded-xl object-cover lg:rounded-[20px]" />
  <div
    class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out group-hover:opacity-100">
    <!-- Logo in the top-right corner -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#await getManifestStore() then manifestStore}
      {#if manifestStore}
        <div on:click={togglePopup}>
          <Pin
            class="absolute right-4 top-4 h-[24px] w-[24px] hover:cursor-pointer" />
        </div>
        <Popup
          isOpen={isPopupOpen}
          {manifestStore}
          {imageUrl}
          on:close={handleClose} />
      {/if}
    {/await}
  </div>
</div>
