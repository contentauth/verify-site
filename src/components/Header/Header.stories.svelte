<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Header from './Header.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/06v2bXJZ4mpgTpZJ81af6Y/Verify-2.0?type=design&node-id=352%3A37940&t=WHkOoDMn2UY6KS84-1',
  };
</script>

<Meta title="Global/Header" component={Header} parameters={{ design }} />

<Template let:args>
  <Header {...args} />
</Template>

<Story name="Default" />

<Story name="Custom slot">
  <Header>
    <div>My site</div>
  </Header>
</Story>
