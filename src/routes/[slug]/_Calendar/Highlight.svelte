<script lang="ts">
  import { getLocalIntervalsFromIds } from './state';
  import Interval from './Interval.svelte';
  import { Selecting } from '$lib/components/SelectableProvider/selecting';
  import { cx } from '$lib/utils/cx';

  export let selectingIds: string[];

  export let selecting: Selecting;
  // prettier-ignore
  $: className = cx(
    'pointer-events-none rounded-xl',
    [selecting === Selecting.CREATE, 'bg-primary-lighter shadow-xl-primary border-3 border-white'],
    [selecting === Selecting.DELETE, 'border-3 border-red-400']
  );
</script>

{#each $getLocalIntervalsFromIds(selectingIds) as interval}
  <Interval {interval} class={className} />
{/each}
