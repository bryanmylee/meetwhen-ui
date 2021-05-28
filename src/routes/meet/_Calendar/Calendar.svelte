<script lang="ts">
  import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';
  import type { Interval } from '$lib/gql/types/interval';

  export let intervals: Interval[] = [];

  let selector: SelectableProvider | undefined;
  let selectedIds: string[] = [];
</script>

<div class="flex flex-col flex-1 card">
  <div tabindex="0" class="focus:outline-none" />
  <SelectableProvider bind:this={selector} bind:selectedIds let:selecting>
    <div class="relative h-full min-h-0 p-4 pt-1 pl-2 overflow-hidden focus:outline-none">
      <div class="h-full overflow-auto">
        <div class="relative z-0 flex min-w-full min-h-full space-x-2 w-fit h-fit">cool</div>
      </div>
    </div>
  </SelectableProvider>
</div>
