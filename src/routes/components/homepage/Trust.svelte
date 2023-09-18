<script>
  const data = [
    {
      label: 'Open-source standards',
      description:
        'Content Credentials are based on open technical standards developed and maintained by the C2PA, a cross-industry membership organization. You can review the standards anytime.',
      id: 1,
      bgColor: '#84c7fc',
    },
    {
      label: 'Clear detection of tampering',
      description:
        'Content Credentials are made possible by cryptographic processes which mean that any unsupported changes made to Content Credentials can be easily identified and exposed.',
      id: 2,
      bgColor: '#5ac97d',
    },
    {
      label: 'Accountability',
      description:
        'Organizations that issue Content Credentials must identify themselves in the Content Credentials they issue. Issuers therefore stake their reputations on their ability to collect and include information with accuracy. Learn more about the Content Credentials trust model.',
      id: 3,
      bgColor: '#888ef8',
    },
  ];
</script>

<div class="flex h-[1000px] w-screen items-center justify-center">
  <div class="flex flex-col items-center justify-center text-sub-title">
    <div class="text-secondary-title w-[910px] pb-20 text-center">
      What makes Content Credential trustworthy
    </div>
    <div class="flex w-full flex-row gap-6">
      {#each data as item}
        <div>
          <div class="h-[400px] w-[445px]">
            <div
              class="text-sub-label rounded-t-xl px-[32px] py-[20px]"
              style={`background-color: ${item.bgColor}`}>
              {item.label}
            </div>
            <div
              class="text-sub-label h-full rounded-b-xl bg-gray-200 px-[32px] py-[20px]">
              {item.description}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
