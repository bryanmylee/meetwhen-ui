<script lang="ts" context="module">
  export const load: Load = ({ fetch, page }) => {
    queryClient.fetch = fetch;
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
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Nav from '$lib/components/Nav/Nav.svelte';
  import type { Load } from '@sveltejs/kit';

  export let key: string;
</script>

<main class={key === '/' ? 'mt-10' : 'mt-14'}>
  <PageTransition {key}>
    <slot />
  </PageTransition>
</main>

<Nav {key} />

<style lang="postcss">
  main {
    transition: margin 400ms cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
