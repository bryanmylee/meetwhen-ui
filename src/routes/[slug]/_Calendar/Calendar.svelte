<script lang="ts">
  import type { Interval } from '$lib/gql/types';
  import { intervals as intervalsDep, days, numRows } from './state';
  import Column from './Column.svelte';
  import Grid from '$lib/components/Grid/Grid.svelte';
  import ColumnHeader from './ColumnHeader.svelte';
  import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';
  import GridItem from '$lib/components/Grid/GridItem.svelte';

  export let intervals: Interval[] = [];
  $: $intervalsDep = intervals;

  let selector: SelectableProvider | undefined;
  let selectedIds: string[] = [];
</script>

<div class="z-0 flex flex-col flex-1 overflow-hidden card">
  <div tabindex="0" class="focus:outline-none" />
  <SelectableProvider bind:this={selector} bind:selectedIds let:selecting>
    <div class="relative h-full min-h-0 p-4 overflow-hidden focus:outline-none">
      <div class="layout-grid">
        <GridItem x={1} y={0} class="sticky top-0 z-20 flex w-full space-x-4">
          {#each $days as day}
            <ColumnHeader {day} />
          {/each}
        </GridItem>
        <GridItem x={0} y={1} class="sticky left-0 z-20 flex flex-col min-w-16 bg-default">
          hello
        </GridItem>
        <GridItem x={1} y={1}>
          <Grid
            rows={$numRows}
            cols={$days.length}
            class="relative z-0 min-w-full min-h-full gap-x-4"
          >
            {#each $days as day, index}
              <Column x={index} {day} />
            {/each}
          </Grid>
        </GridItem>
      </div>
    </div>
  </SelectableProvider>
</div>

<style lang="postcss">
  * {
    --header-row-height: 4rem;
    --index-col-width: 4rem;
  }

  .layout-grid {
    grid-template: var(--header-row-height) auto / var(--index-col-width) auto;
    @apply grid h-full overflow-auto;
  }
</style>
