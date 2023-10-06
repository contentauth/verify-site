<script>
  import Trupic from '$assets/svg/logos/homepage/Trupic.svg';
  import Microsoft from '$assets/svg/logos/homepage/Microsoft.svg';
  import CameraBits from '$assets/svg/logos/homepage/CameraBits.png';
  import Adobe from '$assets/svg/logos/homepage/Adobe.svg';
  import Leica from '$assets/svg/logos/homepage/Leica.svg';
  import Nikon from '$assets/svg/logos/homepage/Nikon.svg';
  import Publicis from '$assets/svg/logos/homepage/Publicis.svg';

  const data = [
    {
      image: Adobe,
    },
    {
      image: CameraBits,
    },
    {
      image: Leica,
    },
    {
      image: Microsoft,
    },
    {
      image: Nikon,
    },
    {
      image: Publicis,
    },
    {
      image: Trupic,
    },
  ];
</script>

<div
  class="w-screen max-w-[90rem] py-16 lg:py-[5.5rem] xl:pb-[7.5rem] px-[20px] sm:px-[1.5rem]">
  <div class="px-0">
    <div
      class="relative w-full overflow-hidden rounded-xl lg:rounded-[20px] bg-gray-40">
      <div
        class="primary px-[32px] md:px-[64px] py-[48px] md:py-[80px] flex-wrap flex items-center justify-around">
        {#each data as item}
          <div class="px-[16px] py-[20px] flex">
            <img
              src={item.image}
              alt=""
              class="md:w-[100px] h-[100px] w-[200px] object-contain" />
          </div>
        {/each}
      </div>
      <!-- <div
        class="secondary absolute left-0 top-0 flex items-center justify-around">
        {#each data as item}
          <div class="h-[100px] max-h-[100px] w-[200px] pr-20">
            <img src={item.image} alt="" class="h-full object-contain" />
          </div>
        {/each}
      </div> -->
    </div>
  </div>
</div>

<style>
  /* .primary {
    width: inherit;
    height: inherit;
    animation: primary 10s linear infinite;
  } */

  /* .secondary {
    width: inherit;
    height: inherit;
    animation: secondary 10s linear infinite;
  }

  @keyframes primary {
    from {
      left: 0%;
    }
    to {
      left: -100%;
    }
  }

  @keyframes secondary {
    from {
      left: 100%;
    }
    to {
      left: 0%;
    }
  } */
</style>
