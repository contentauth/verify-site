<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import LegacyCredentialModal from './LegacyCredentialModal.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/06v2bXJZ4mpgTpZJ81af6Y/Verify-2.0?type=design&node-id=2179-98388&mode=dev',
  };

  const backgrounds = {
    default: 'modal-background',
    values: [
      { name: 'modal-background', value: '#0000004d' },
      { name: 'white', value: '#ffffff' },
    ],
  };
</script>

<Meta
  title="Verify/Modals/LegacyCredentialModal"
  component={LegacyCredentialModal}
  parameters={{ design, backgrounds }} />

<Template let:args>
  <LegacyCredentialModal {...args} />
</Template>

<Story name="Default" args={{ isOpen: true }} />
