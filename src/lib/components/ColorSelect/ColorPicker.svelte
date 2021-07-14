<script lang="ts">
  import { cssVars } from '$lib/utils/css-vars';
  import type { ColorItemEvent } from './ColorPickerItem.svelte';
  import ColorPickerRow from './ColorPickerRow.svelte';

  export let value: string;

  const hues = [0, 35, 60, 100, 160, 180, 220, 260, 300, 330];
  const lights = [0.5, 0.75];

  const handleClick = ({ detail }: CustomEvent<ColorItemEvent['click']>) => {
    value = detail.hex;
  };
</script>

<div class="card p-3" style={cssVars({ numCols: hues.length })}>
  <div class="picker-grid p-3 shade rounded-lg">
    {#each lights as light}
      <ColorPickerRow {hues} {light} sat={1} on:click={handleClick} />
    {/each}
    {#each [...lights].reverse() as light}
      <ColorPickerRow {hues} {light} sat={0.2} on:click={handleClick} />
    {/each}
  </div>
</div>

<style lang="postcss">
  .picker-grid {
    @apply grid gap-2;
    grid-template-columns: repeat(var(--numCols), 1fr);
  }
</style>
