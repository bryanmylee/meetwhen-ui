<script lang="ts">
  import '../app.postcss';
  import '$lib/colors';
  import { page } from '$app/stores';
  import Nav from './_nav.svelte';
  import PageTransition from '$lib/components/PageTransition.svelte';
</script>

<main>
  <PageTransition key={$page.path}>
    <slot />
  </PageTransition>
</main>

{#if $page.path !== '/'}
  <Nav />
{/if}
