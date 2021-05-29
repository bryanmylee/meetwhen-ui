<script lang="ts">
  import { currentUser } from '$lib/app-state';
  import DarkModeButton from './DarkModeButton.svelte';
  import HomeNavItem from './HomeNavItem.svelte';
  import Template from './Template.svelte';

  export let key: string;
</script>

<Template {key}>
  <svelte:fragment slot="left">
    <HomeNavItem />
  </svelte:fragment>
  <svelte:fragment slot="right">
    {#if $currentUser !== null}
      <li>Hi, <span class="font-bold">{$currentUser.name}</span></li>
    {/if}
    <DarkModeButton />
  </svelte:fragment>
</Template>
