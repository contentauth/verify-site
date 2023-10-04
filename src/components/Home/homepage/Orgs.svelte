<script>
  import AFP from '$assets/svg/color/logos/AFP.svg';
  import Canon from '$assets/svg/color/logos/Canon.svg';
  import EFE from '$assets/svg/color/logos/EFE.svg';
  import BBC from '$assets/svg/color/logos/Frame.svg';
  import Leica from '$assets/svg/color/logos/Leica.svg';
  import WashPost from '$assets/svg/color/logos/WashingtonPost.svg';

  const data = [
    {
      image: BBC,
    },
    {
      image: AFP,
    },
    {
      image: Leica,
    },
    {
      image: WashPost,
    },
    {
      image: Canon,
    },
    {
      image: EFE,
    },
  ];
</script>

<div class="w-screen max-w-[90rem] py-16 lg:py-[5.5rem] xl:pb-[7.5rem]">
  <div class="px-6">
    <div
      class="relative h-[200px] w-full overflow-hidden rounded-xl bg-gray-40">
      <div
        class="primary absolute left-0 top-0 flex items-center justify-around">
        {#each data as item}
          <div class="h-[100px] max-h-[100px] w-[200px] pr-20">
            <img src={item.image} alt="" class="h-full object-contain" />
          </div>
        {/each}
      </div>
      <div
        class="secondary absolute left-0 top-0 flex items-center justify-around">
        {#each data as item}
          <div class="h-[100px] max-h-[100px] w-[200px] pr-20">
            <img src={item.image} alt="" class="h-full object-contain" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .primary {
    width: inherit;
    height: inherit;
    animation: primary 10s linear infinite;
  }

  .secondary {
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
  }
</style>
