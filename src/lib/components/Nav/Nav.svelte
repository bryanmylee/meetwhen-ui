<script lang="ts">
  import { session } from '$app/stores';
  import { showAuth } from '$lib/app-state';
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
    {#if $session.user !== null}
      <li>
        <a href="/profile">
          Hi, <span class="font-bold">{$session.user.name}</span>
        </a>
      </li>
    {:else}
      <li><button on:click={() => ($showAuth = true)}>Login</button></li>
    {/if}
    <DarkModeButton />
  </svelte:fragment>
</Template>

<style lang="postcss">
  a,
  button {
    @apply hover:text-primary hover:underline;
  }
</style>
