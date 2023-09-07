<script>
  import Creation from '../../../assets/png/create@2x.png';
  import Editing from '../../../assets/png/edit@2x.png';
  import Sharing from '../../../assets/png/sharing@2x.png';
  import Viewing from '../../../assets/png/viewing@2x.png';
  let diagramItems = [
    {
      image: Creation,
      label: 'Creation',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
      id: 1,
    },
    {
      image: Editing,
      label: 'Editing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
      id: 2,
    },
    {
      image: Sharing,
      label: 'Publishing And Sharing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
      id: 3,
    },
    {
      image: Viewing,
      label: 'Viewing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
      id: 4,
    },
  ];
</script>

<div class="h-[875px]">
  <div>
    <div class="flex items-center justify-center">
      <div class="flex w-[720px] flex-col items-center justify-center gap-8">
        <div class="text-secondaryTitle">How It Works</div>
        <div class="text-general pb-10 text-center">
          The Content Authenticity Initiative is a group working together to
          fight misinformation and add a layer of verifiable trust to all types
          of digital content, starting with photo and video, through provenance
          and attribution solutions.{' '}
        </div>
        <div>
          <a
            href="/about"
            class="text-black rounded-full bg-[#FCE458] px-4 py-3 font-bold hover:bg-[#ffeb77] hover:text-[#454545]">
            Learn More
          </a>
        </div>
      </div>
    </div>
    <div>
      <div class="flex flex-row items-center justify-center pt-[10rem]">
        {#each diagramItems as item (item.id)}
          <div
            class="flex w-[275px] flex-col items-center justify-center px-[20px]"
            key={item.id}>
            <img src={item.image} width="200" height="150" alt="infographics" />
            <div
              class="text-subHeading flex flex-wrap items-start justify-start py-10 pb-4 text-center font-bold">
              {item.label}
            </div>
            <div class="pb-4 text-center text-generalSm">{item.description}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
