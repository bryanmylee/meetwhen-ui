<script lang="ts" context="module">
  export const load: Load = ({ fetch, page, session }) => {
    queryClient.fetch = fetch;
    currentUser.set(session.user);
    return {
      props: {
        key: page.path,
      },
    };
  };
</script>

<script lang="ts">
  import '../app.postcss';
  import '$lib/colors';
  import '$lib/dark-mode';
  import '$lib/screen-height';
  import { queryClient } from '$lib/gql';
  import { showAuth, currentUser } from '$lib/app-state';
  import { cx } from '$lib/utils/cx';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import AuthModal from './_AuthModal/AuthModal.svelte';
  import Nav from './_Nav.svelte';
  import type { Load } from '@sveltejs/kit';

  export let key: string;
</script>

<main class={cx([key === '/', 'mt-10', 'mt-14'])}>
  <PageTransition {key}>
    <slot />
  </PageTransition>
</main>

<Nav {key} />

{#if $showAuth}
  <AuthModal on:dismiss={() => ($showAuth = false)} />
{/if}

<style>
  main {
    transition: margin 400ms cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
