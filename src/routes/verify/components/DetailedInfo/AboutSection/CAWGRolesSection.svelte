<script lang="ts">
  import type { RoleEntry } from '$src/lib/selectors/cawgRoles';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionContentRow from './AboutSectionIconContentRow.svelte';

  export let roles: RoleEntry[];
</script>

{#each roles as { role, name } (role)}
  <SubSection>
    <svelte:fragment slot="title">
      {$_(`sidebar.verify.cawg.role.${role}`, {
        default: role.charAt(0).toUpperCase() + role.slice(1),
      })}</svelte:fragment>
    <AboutSectionContentRow slot="content">
      <svelte:fragment slot="content">
        <span class="text-generalSm" data-testid="cawg-role-{role}"
          >{name}</span>
      </svelte:fragment>
    </AboutSectionContentRow>
  </SubSection>
{/each}
