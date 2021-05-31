<script lang="ts">
  import type { Interval } from '$lib/gql/types';
  import { intervals as intervalsDep, days, numRows } from './state';
  import Column from './Column.svelte';
  import Grid from '$lib/components/Grid/Grid.svelte';
  import ColumnHeader from './ColumnHeader.svelte';
  import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';

  export let intervals: Interval[] = [];
  $: $intervalsDep = intervals;

  let selector: SelectableProvider | undefined;
  let selectedIds: string[] = [];
</script>

<div class="flex flex-col flex-1 overflow-hidden card">
  <div tabindex="0" class="focus:outline-none" />
  <SelectableProvider bind:this={selector} bind:selectedIds let:selecting>
    <div class="relative h-full min-h-0 p-4 overflow-hidden focus:outline-none">
      <div class="flex flex-col h-full overflow-auto">
        <div class="sticky top-0 z-20 flex w-full">
          {#each $days as day}
            <ColumnHeader {day} />
          {/each}
        </div>
        <Grid rows={$numRows} cols={$days.length} class="relative z-0 min-w-full min-h-full">
          {#each $days as day, index}
            <Column x={index} {day} />
          {/each}
        </Grid>
      </div>
    </div>
  </SelectableProvider>
</div>
