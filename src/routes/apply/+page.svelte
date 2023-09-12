<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import LegalSection from '$src/components/LegalSection/LegalSection.svelte';
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import Section from '$src/components/SidebarSection/Section.svelte';
  import Description from '$src/components/typography/Description.svelte';
  import Link from '$src/components/typography/Link.svelte';
  import {
    SidebarLayout,
    sidebarLayoutPageState,
  } from '$src/features/SidebarLayout';
  import { _ } from 'svelte-i18n';
  import Button from '../verify/components/Button/Button.svelte';
  import Checkbox from './components/Checkbox/Checkbox.svelte';
  import CheckboxGroup from './components/Checkbox/CheckboxGroup.svelte';
  import Radio from './components/Radio/Radio.svelte';
  import RadioGroup from './components/Radio/RadioGroup.svelte';
  import { count } from './store';
</script>

<SidebarLayout>
  <div slot="header">{$_('page.apply.title')}</div>
  <div slot="sidebar">
    <Section>
      <div slot="title">{$_('sidebar.apply.title')}</div>
      <div slot="content">
        <Description>{$_('sidebar.apply.description')}</Description>
      </div>
    </Section>
    <CollapsibleSection>
      <div slot="header">
        {$_('sidebar.credit')}
      </div>
      <div slot="description">
        {$_('sidebar.apply.credit.description')}
      </div>
      <div slot="content">
        <CheckboxGroup>
          <Checkbox>{$_('sidebar.apply.credit.name')}</Checkbox>
          <Checkbox>{$_('sidebar.apply.credit.contact')}</Checkbox>
          <Checkbox>{$_('sidebar.apply.credit.AI')}</Checkbox>
        </CheckboxGroup>
      </div>
    </CollapsibleSection>
    <CollapsibleSection>
      <div slot="header">
        {$_('sidebar.process')}
      </div>
      <div slot="description">
        {$_('sidebar.apply.process.description')}
      </div>
      <div slot="content">
        <CheckboxGroup>
          <Checkbox>{$_('sidebar.apply.process.ingredients')}</Checkbox>
        </CheckboxGroup>
      </div>
    </CollapsibleSection>
    <CollapsibleSection expanded={false}>
      <div slot="header">
        {$_('sidebar.apply.advanced')}
      </div>
      <div slot="description">
        {$_('sidebar.apply.advanced.description')}
        <Link>
          <a
            href="https://contentauthenticity.org/faq"
            class="text-small-description">
            {$_('sidebar.apply.advanced.learnMore')}</a
          ></Link>
      </div>
      <div slot="content">
        <RadioGroup selected="first" name="storage">
          <Radio value="first">{$_('sidebar.apply.advanced.both')}</Radio>
          <Radio value="second">{$_('sidebar.apply.advanced.publish')}</Radio>
          <Radio value="third">{$_('sidebar.apply.advanced.attach')}</Radio>
        </RadioGroup>
      </div>
    </CollapsibleSection>
    <LegalSection
      ><svelte:fragment slot="legal-text-visible">
        <p>{$_('sidebar.apply.legal.part1')}</p>
      </svelte:fragment>
      <svelte:fragment slot="legal-text-more">
        <p class="pt-2">{$_('sidebar.apply.legal.part2')}</p>
      </svelte:fragment>
    </LegalSection>
    <div
      class="sticky bottom-0 flex h-14 items-center justify-end border-t-2 bg-white px-5 py-8">
      <div class="mr-5 lg:mr-0">
        <Button size="m" treatment="outline" variant="primary">
          {$_('sidebar.apply.preview')}</Button>
      </div>
      <div class="lg:hidden">
        <Button
          size="m"
          variant="accent"
          on:click={() => sidebarLayoutPageState.next()}>
          {$_('sidebar.apply.next')}</Button>
      </div>
    </div>
  </div>
  <div slot="content" class="h-full bg-gray-300">
    Count is {$count}
    <button
      class="m-2 bg-blue-600 p-2 text-white lg:hidden"
      on:click={() => sidebarLayoutPageState.back()}>Back</button>
  </div>
  <svelte:fragment slot="back-bar"
    >{$_('page.apply.backToSettings')}</svelte:fragment>
</SidebarLayout>
