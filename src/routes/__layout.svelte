<script lang="ts" context="module">
  export const load: Load = ({ page }) => ({
    props: {
      key: page.path,
    },
  });
</script>

<script lang="ts">
  import '../app.postcss';
  import '$lib/colors';
  import '$lib/dark-mode';
  import Nav from './_nav.svelte';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import type { Load } from '@sveltejs/kit';

  export let key: string;
</script>

<main>
  <PageTransition {key}>
    <slot />
  </PageTransition>
</main>

{#if key !== '/'}
  <Nav />
{/if}
