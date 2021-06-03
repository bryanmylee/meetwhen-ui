<script lang="ts">
  import type { Interval } from '$lib/gql/types';
  import {
    intervals as intervalsDep,
    days,
    numRows,
    selectedIds,
    selectedIntervals as selectedIntervalsDep,
    getDayHourIdsBetween,
  } from './state';
  import Column from './Column.svelte';
  import Grid from '$lib/components/Grid/Grid.svelte';
  import IndexHeader from './IndexHeader.svelte';
  import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import IndexColumn from './IndexColumn.svelte';
  import Selected from './Selected.svelte';
  import Highlight from './Highlight.svelte';

  export let intervals: Interval[] = [];
  $: $intervalsDep = intervals;

  export let selectedIntervals: Interval[] = [];
  $: selectedIntervals = $selectedIntervalsDep;

  let selector: SelectableProvider | undefined;
</script>

<div class="z-0 flex flex-col flex-1 overflow-hidden card">
  <div tabindex="0" class="focus:outline-none" />
  <SelectableProvider
    bind:this={selector}
    bind:selectedIds={$selectedIds}
    interpolateBetween={$getDayHourIdsBetween}
    let:selecting
    let:selectingIds
  >
    <div class="relative h-full min-h-0 p-4 overflow-hidden focus:outline-none">
      <div class="layout-grid">
        <GridItem x={1} y={0} class="sticky top-0 z-20 flex space-x-4 bg-default">
          <IndexHeader />
        </GridItem>
        <GridItem x={0} y={1} class="sticky left-0 z-20 flex flex-col bg-default">
          <IndexColumn />
        </GridItem>
        <GridItem x={1} y={1}>
          <Grid
            rows={$numRows}
            cols={$days.length}
            class="relative z-0 min-w-full min-h-full gap-x-4"
          >
            {#each $days as day}
              <Column {day} />
            {/each}
            <Selected />
            <Highlight {selecting} {selectingIds} />
          </Grid>
        </GridItem>
      </div>
    </div>
  </SelectableProvider>
</div>

<style lang="postcss">
  * {
    --header-row-height: 4rem;
    --index-col-width: 3rem;
  }

  .layout-grid {
    grid-template: var(--header-row-height) auto / var(--index-col-width) auto;
    @apply grid h-full overflow-auto;
  }
</style>
