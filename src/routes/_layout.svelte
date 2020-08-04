<svelte:head>
  <title>meetwhen</title>
</svelte:head>

<script>
  import Nav from 'src/components/ui/Nav.svelte';
  import { mediaQueries } from 'src/actions/mediaQuery';
  import { layoutEnum, layout, currentColor, isDarkMode } from 'src/stores';
  import { getTint } from 'src/utils/colors';

  // Setting primary colors and all tints, as well as dark mode colors.
  $: if (typeof document !== 'undefined') {
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((tint) => {
      document.documentElement.style.setProperty(`--primary-${tint}`, getTint($currentColor.hex, tint));
    });
    document.documentElement.style.setProperty('--primary-gradient-dark', $currentColor.gradientDark);

    if ($isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Setting 100vh units.
  let innerHeight;
  $: if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);
  }
</script>

<svelte:window
  use:mediaQueries={{
    queries: [
      '(min-width: 768px)',
      '(prefers-color-scheme: dark)',
    ],
    callbacks: [
      (matches) => $layout = matches ? layoutEnum.WIDE : layoutEnum.NARROW,
      (matches) => $isDarkMode = matches,
    ],
  }}
  bind:innerHeight
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