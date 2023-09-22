<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import LoadingOverlay from './LoadingOverlay.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/06v2bXJZ4mpgTpZJ81af6Y/Verify-2.0?type=design&node-id=2769-102165&mode=dev',
  };
</script>

<Meta
  title="Verify/LoadingOverlay"
  component={LoadingOverlay}
  parameters={{ design }} />

<Template let:args>
  <LoadingOverlay {...args} />
</Template>

<Story name="Default" />
