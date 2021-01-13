<script lang="ts" context="module">
  // import required to first set the colors
  import { primaryBase, DEFAULT_PRIMARY_INDEX } from '@my/state/colors';
  import type { Writable } from 'svelte/store';

  export type IColorIndex = Writable<number>;
  export type INewEventName = Writable<string>;
  export type IGetCrossfade = () => ReturnType<typeof crossfade>;
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { cubicOut } from 'svelte/easing';
  import { crossfade, fade } from 'svelte/transition';
  import PageTransition from '@my/components/PageTransition.svelte';
  import Nav from './_nav.svelte';

  export let segment: string;

  setContext('colorIndex', writable(DEFAULT_PRIMARY_INDEX));

  setContext('newEventName', writable(''));

  const cross = crossfade({
    duration: 500,
    easing: cubicOut,
    fallback: (node, params) => fade(node, {
      ...params,
      duration: 200,
    }),
  });
  setContext('getCrossfade', () => cross);
</script>

<PageTransition refresh={segment}>
  <main class="select-none-all transition">
    <slot/>
  </main>
</PageTransition>

{#if segment}
  <Nav/>
{/if}

