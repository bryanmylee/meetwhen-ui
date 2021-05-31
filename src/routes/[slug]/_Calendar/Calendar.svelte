<script lang="ts">
  import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';
  import type { Interval } from '$lib/gql/types';
  import { intervals as intervalsDep, days } from './state';
  import Day from './Day.svelte';
  import Grid from '$lib/components/Grid/Grid.svelte';

  export let intervals: Interval[] = [];
  $: $intervalsDep = intervals;

  let selector: SelectableProvider | undefined;
  let selectedIds: string[] = [];
</script>

<div class="flex flex-col flex-1 overflow-hidden card">
  <div tabindex="0" class="focus:outline-none" />
  <SelectableProvider bind:this={selector} bind:selectedIds let:selecting>
    <div class="relative h-full min-h-0 p-4 pt-1 pl-2 overflow-hidden focus:outline-none">
      <div class="flex flex-col h-full overflow-auto">
        <Grid rows={8} cols={$days.length} class="relative z-0 min-w-full min-h-full">
          {#each $days as day, index}
            <Day {index} {day} />
          {/each}
        </Grid>
      </div>
    </div>
  </SelectableProvider>
</div>
