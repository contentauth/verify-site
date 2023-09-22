<script>
  import AFP from '$assets/png/Agence_France-Presse_Logo.png';
  import BBC from '$assets/png/BBC-Logo.png';
  import Canon from '$assets/png/Canon.png';
  import WashPost from '$assets/png/WashPost.png';
  import Leica from '$assets/svg/color/logos/leica.svg';

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
  ];
</script>

<div class="w-screen">
  <div class="px-6">
    <div class="w-[350px] pb-4 text-[1.3125rem] leading-[1.77188rem]">
      Content Credentials is used by the world’s leading organizations
    </div>
    <div class="flex h-[200px] w-full items-center rounded-xl bg-gray-200">
      <div class="flex w-full flex-row items-center justify-evenly">
        {#each data as item}
          <div
            class="flex h-[100px] max-h-[100px] w-[200px] items-center justify-center">
            <img src={item.image} alt="" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
