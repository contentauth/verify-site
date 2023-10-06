<script>
  const data = [
    {
      label: 'Truly open standards',
      description: `Content Credentials are based on open technical specification
            developed and maintained by the <a
              href="https://c2pa.org/"
              class="underline">C2PA</a
            >, a cross-industry standards development organization. You can
            review the specification anytime.`,
      id: 1,
      bgColor: '#84c7fc',
    },
    {
      label: 'Clear tampering detection',
      description:
        'Content Credentials use technology that makes it clear if content has been altered since its Content Credentials were created. Up-to-date context travels with the content, wherever it goes.',
      id: 2,
      bgColor: '#5ac97d',
    },
    {
      label: 'Accountability',
      description:
        'Devices, software, and organizations that issue Content Credentials identify themselves in the Content Credentials they issue. Issuers therefore stake their reputations on their ability to record information accurately.',
      id: 3,
      bgColor: '#888ef8',
    },
  ];
</script>

<div class="flex h-[1000px] w-screen items-center justify-center">
  <div class="flex flex-col items-center justify-center text-sub-title">
    <div class="w-[910px] pb-20 text-center text-home-secondary-title">
      What makes Content Credential trustworthy
    </div>
    <div class="flex w-full flex-row gap-6">
      {#each data as item}
        <div>
          <div class="h-[400px] w-[445px]">
            <div
              class="rounded-t-xl px-[32px] py-[20px] font-base text-hiw-label"
              style={`background-color: ${item.bgColor}`}>
              {item.label}
            </div>
            <div
              class="h-full rounded-b-xl bg-gray-200 px-[32px] py-[20px] text-sub-label">
              {item.description}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
