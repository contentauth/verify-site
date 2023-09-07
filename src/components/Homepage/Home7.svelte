<script>
    import Frame from "../../../assets/png/Frame.png";
    import Frame2 from "../../../assets/png/Frame2.png";
    import Frame3 from "../../../assets/png/Frame3.png";
    import Frame4 from "../../../assets/png/Frame4.png";
    import Frame5 from "../../../assets/png/Frame5.png";
    import Frame6 from "../../../assets/png/Frame6.png";
  const Priciples = [
    {
      image: Frame,
      title: "Privacy",
      description:
        "CAI work respects the privacy of creators, journalists, publishers, and consumers.",
    },
    {
      image: Frame2,
      title: "Accessibility",
      description:
        "We strive to ensure that secure provenance is readily available to anyone, regardless of location or technical proficiency.",
    },
    {
      image: Frame3,
      title: "Interoperability",
      description:
        "We’re fostering an ecosystem of tools that work together seamlessly for people to create, maintain, and communicate content provenance.",
    },
    {
      image: Frame4,
      title: "Simplicity",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: Frame5,
      title: "Extensibility",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: Frame6,
      title: "Openness",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
  ];
</script>

<div class="flex h-[875px] w-screen flex-col">
  <div class="text-secondaryTitle w-screen pl-20 pt-20 text-left">
    Our Guiding Priciples
  </div>
  <div class="flex items-center justify-center pt-20">
    <div class="flex items-center justify-center">
      <div class="flex flex-row flex-wrap items-center justify-center">
        {#each Priciples as principle, index (principle.title)}
          <div
            class="flex w-[33%] flex-col items-center justify-center px-6 py-6"
            key={index}>
            <img src={principle.image} width="88" height="88" alt="logo" />
            <div class="text-subHeading py-6 text-left">
              {principle.title}
            </div>
            <div class="text-general w-[350px] text-center">
              {principle.description}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
