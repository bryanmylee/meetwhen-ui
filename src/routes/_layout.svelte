<script>
  import Nav from 'src/components/Nav.svelte';
  import mediaQuery from 'src/actions/mediaQuery';
  import { layoutEnum, layout } from 'src/stores';
</script>

<svelte:window
  use:mediaQuery={{
    query: '(min-width: 768px)',
    callback: (matches) => $layout = matches ? layoutEnum.WIDE : layoutEnum.NARROW,
  }}
/>

<Nav />
<main>
  <slot />
</main>

<style>
  main {
    margin-top: var(--nav-height);
  }
</style>