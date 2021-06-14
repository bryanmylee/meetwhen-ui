<script lang="ts">
  import { getLocalIntervalsFromIds } from './state/core';
  import Interval from './Interval.svelte';
  import { Selecting } from '$lib/components/SelectableProvider/selecting';
  import { cx } from '$lib/utils/cx';
  import { schedules } from './state/schedules';

  export let selectingIds: string[];

  export let selecting: Selecting;
  // prettier-ignore
  $: className = cx(
    'pointer-events-none rounded-xl',
    [selecting === Selecting.CREATE, 'bg-primary-fifty shadow-xl-primary border-3 border-primary-darker dark:border-white'],
    [selecting === Selecting.DELETE, 'border-3 border-red-400'],
    [$schedules.length > 0, 'ml-8'],
  );
</script>

{#each $getLocalIntervalsFromIds(selectingIds) as interval}
  <Interval {interval} class={className} />
{/each}
