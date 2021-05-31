<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import Header from './Header.svelte';
  import type { Dayjs } from 'dayjs';
  import { availables, getIntervalsInAvailableInDay } from './state';

  export let index: number;
  export let day: Dayjs;
</script>

<Header {index} {day} />
{#each $availables as available, availableIndex}
  {#each $getIntervalsInAvailableInDay(available, day) as interval, intervalIndex}
    <GridItem x={index} y={intervalIndex}>
      <p>hello</p>
    </GridItem>
  {/each}
{/each}
