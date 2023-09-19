<script>
  import Hiw1 from '../../../../assets/png/hiw1.png';
  import Hiw2 from '../../../../assets/png/hiw2.png';
  import Hiw3 from '../../../../assets/png/hiw3.png';
  const data = [
    {
      id: 1,
      label: 'Content Credentials are created',
      labelNumber: 1,
      labelBg: '#EF9349',
      Image: Hiw1,
      description:
        'Creators choose to digitally sign their work by creating Content Credentials, which might include things like whether they used AI or not. Voila—this information gets attached to what they create!',
    },
    {
      id: 2,
      label: 'Once content is published, Content Credentials are too',
      labelNumber: 2,
      labelBg: '#FCE458',
      Image: Hiw2,
      description:
        'Once the content is published, anyone can view the information by clicking on the pin. You can also access the information through a tool called Verify, which allows you to upload content and view associated Content Credentials.',
    },
    {
      id: 3,
      label:
        'As content is edited, Content Credentials are updated to reflect what’s new',
      labelNumber: 3,
      labelBg: '#fe818b',
      Image: Hiw3,
      description:
        'Digital content is constantly being edited and remixed. Content Credentials capture the full edit history of any piece of content, so you can see how it has changed over time.',
    },
  ];
</script>

<div class="flex h-full w-screen flex-col items-center bg-[#F6F5F2] pb-40">
  <div class="pt-[160px] text-home-secondary-title">How it Works</div>
  <div class="flex w-[1142px] flex-col">
    <div class="">
      {#each data as item}
        <div class="gap-[60px]">
          <div class="flex flex-row items-start justify-between pt-20 pb-12">
            <div class="flex flex-row gap-3">
              <div
                class="flex h-[22px] w-[22px] items-center justify-center rounded-full px-4 py-4" style={`background-color: ${item.labelBg}`}>
                {item.labelNumber}
              </div>
              <div class="text-hiw-label pr-10 w-[400px]">{item.label}</div>
            </div>
            <div class="text-hiw-desc text-brand-gray h-[112px] w-[560px]">
              {item.description}
            </div>
          </div>
          <img
            src={item.Image}
            alt="how it works"
            class="h-[642px] w-full rounded-2xl" />
        </div>
      {/each}
    </div>
  </div>
</div>
