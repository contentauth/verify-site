<script>
  import WashPost from '../../../../assets/png/WashPost.png';
  import BBC from '../../../../assets/png/BBC-Logo.png';
  import AFP from '../../../../assets/png/Agence_France-Presse_logo.png';
  import Leica from '../../../../assets/svg/Leica.svg';
  import Canon from '../../../../assets/png/Canon.png';

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
    <div class="w-[350px] text-sub-label pb-4">Content Credentials is used by the world’s leading organizations</div>
    <div class="flex h-[200px] w-full items-center rounded-xl bg-gray-200">
      <div class="w-full flex flex-row items-center justify-evenly">
        {#each data as item}
          <div class="flex h-[100px] w-[200px] max-h-[100px] items-center justify-center">
            <img src={item.image} alt="" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
