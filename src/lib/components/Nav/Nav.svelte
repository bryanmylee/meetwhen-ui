<script lang="ts">
  import { session } from '$app/stores';
  import AuthModal from '$lib/components/AuthModal/AuthModal.svelte';
  import DarkModeButton from './DarkModeButton.svelte';
  import HomeNavItem from './HomeNavItem.svelte';
  import Template from './Template.svelte';

  export let key: string;

  let showAuthModal = false;
</script>

<Template {key}>
  <svelte:fragment slot="left">
    <HomeNavItem slot="left" />
  </svelte:fragment>
  <svelte:fragment slot="right">
    {#if $session.user !== null}
      <li>
        <a href="/profile">
          Hi, <span class="font-bold">{$session.user.name}</span>
        </a>
      </li>
    {:else}
      <li><button on:click={() => (showAuthModal = true)}>Login</button></li>
    {/if}
    <DarkModeButton />
  </svelte:fragment>
</Template>

{#if showAuthModal}
  <AuthModal on:dismiss={() => (showAuthModal = false)} />
{/if}

<style lang="postcss">
  a,
  button {
    @apply font-medium hover:text-primary hover:underline;
  }
</style>
