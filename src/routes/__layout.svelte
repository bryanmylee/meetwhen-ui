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
  import { queryClient } from '$lib/gql';
  import { cx } from '$lib/utils/cx';
  import Nav from './_nav.svelte';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import type { Load } from '@sveltejs/kit';

  export let key: string;
</script>

<main class={cx([key === '/', 'mt-10', 'mt-14'])}>
  <PageTransition {key}>
    <slot />
  </PageTransition>
</main>

<Nav {key} />

<style>
  main {
    transition: margin 400ms cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>