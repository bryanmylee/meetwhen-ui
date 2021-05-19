<script lang="ts" context="module">
  export type INewEventName = Writable<string>;
  export type ICrossfade = Readable<ReturnType<typeof crossfade>>;
</script>

<script lang="ts">
  import '../app.postcss';
  import '$lib/colors';
  import { setContext } from 'svelte';
  import { crossfade, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { Readable, derived, Writable, writable } from 'svelte/store';

  setContext('new-event-name', writable(''));

  const appCrossfade = crossfade({
    duration: 500,
    easing: cubicOut,
    fallback: (node, params) => fade(node, { ...params, duration: 200 }),
  });
  setContext(
    'crossfade',
    derived(writable(appCrossfade), (x) => x)
  );
</script>

<main>
  <slot />
</main>
