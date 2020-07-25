<svelte:head>
  <title>meetwhen</title>
</svelte:head>

<script>
  import Nav from 'src/components/Nav.svelte';
  import mediaQuery from 'src/actions/mediaQuery';
  import { layoutEnum, layout, currentColor } from 'src/stores';

  $: if (typeof document !== 'undefined') {
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((tint) => {
      document.documentElement.style.setProperty(`--primary-${tint}`, $currentColor.getTint(tint));
    });
  }
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