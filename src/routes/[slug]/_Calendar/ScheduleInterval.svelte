<script lang="ts" context="module">
  let hoveredId: Writable<number> = writable(null);
  let activeId: Writable<number> = writable(null);
</script>

<script lang="ts">
  import Interval from './Interval.svelte';
  import type { Interval as IInterval, ShallowUser } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { createPopperActions } from 'svelte-popperjs';
  import { writable } from 'svelte/store';

  export let id: number;
  export let interval: IInterval;
  export let users: ShallowUser[];

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 20] } }],
  });
</script>

<Interval {interval}>
  <div
    use:ref
    on:click={() => ($activeId = id)}
    on:mouseenter={() => ($hoveredId = id)}
    on:mouseleave={() => ($hoveredId = null)}
    class="w-full h-full rounded-xl bg-red-300"
  />
</Interval>

{#if $hoveredId === id || $activeId === id}
  <div use:content>
    {JSON.stringify(users)}
  </div>
{/if}
