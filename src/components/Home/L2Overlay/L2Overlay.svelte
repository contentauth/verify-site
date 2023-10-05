<script>
  export let imageUrl;
  import Pin from '$assets/svg/color/cr-icon-fill.svg?component';
  // import Pin from '$assets/svg/color/cr-icon-fill.svg';
  import Popup from './Popup.svelte'; // Import the DesktopPopup component

  let isPopupOpen = false;

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
    alt="overlay"
    class="h-full w-full rounded-xl lg:rounded-[20px] object-cover" />

  <div
    class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out group-hover:opacity-100">
    <!-- Logo in the top-right corner -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={togglePopup}>
      <Pin
        class="absolute right-4 top-4 h-[24px] w-[24px] hover:cursor-pointer" />
    </div>
  </div>

  <!-- Conditionally render the appropriate popup based on the device type -->
  <!-- svelte-ignore missing-declaration -->
  <Popup isOpen={isPopupOpen} on:close={handleClose} />
</div>
