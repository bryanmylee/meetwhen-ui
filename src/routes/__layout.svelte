<script lang="ts" context="module">
  export type INewEventName = Writable<string>;
  export type ICrossfade = () => ReturnType<typeof crossfade>;
</script>

<script lang="ts">
  import '../app.postcss';
  import '$lib/colors';
  import { setContext } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { writable } from 'svelte/store';
  import { crossfade, fade } from 'svelte/transition';
  import type { Writable } from 'svelte/store';
  import { page } from '$app/stores';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Nav from './_nav.svelte';

  setContext('new-event-name', writable(''));

  const appCrossfade = crossfade({
    duration: 500,
    easing: cubicOut,
    fallback: (node, params) => fade(node, { ...params, duration: 200 }),
  });
  setContext('crossfade', () => appCrossfade);
</script>

<PageTransition key={$page.path}>
  <slot />
</PageTransition>

{#if $page.path !== '/'}
  <Nav />
{/if}
