<script>
  const data = [
    {
      id: 1,
      title:
        'Watch how artist Hallease Narvaez uses Content Credentials and Adobe Firefly',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: './assets/png/stories.png',
    },
    {
      id: 2,
      title: 'Hear from AP Editor on how she uses Content Credentials',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: './assets/png/stories2.png',
    },
    {
      id: 3,
      title: 'How to use and view Content Credentials in Adobe Photoshop',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: './assets/png/stories3.png',
    },
  ];
</script>

<div class="h-[1400px] w-screen items-center justify-center pb-[100px]">
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="text-secondary-title mb-20 mt-40">Stories</div>
    <div class="flex flex-row gap-5">
      {#each data as item}
        <div class="">
          <div class="flex w-[445px] flex-col">
            <img src={item.image} alt="" class="pb-6" />
            <div class="pb-6 text-sub-title">
              {item.title}
            </div>
            <div class="text-sub-text text-sub-heading">
              {item.description}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
