<script>
  import { MS_PER_HOUR } from 'src/utils/constants';

  import IndexColumnCell from './IndexColumnCell.svelte';

  // PROPS
  // =====
  export let start;
  export let end;

  const numHours = (end - start) / MS_PER_HOUR;
  const hours = [...Array(numHours)].map((_, i) => start.add(i, 'hour'));
</script>

<div class="index-col">
  <span class="month-label-spacer">{start.format('MMM')}</span>
  {#each hours as hour}
    <IndexColumnCell {hour} />
  {/each}
</div>

<style>
  .month-label-spacer {
    display: block;
    padding: 0.5em;
    color: transparent;
  }

  .index-col {
    position: sticky;
    left: -1px;
    z-index: 21;
    min-width: var(--index-col-width);
    background-color: var(--bg);
    display: flex;
    flex-direction: column;
    margin-bottom: 5rem;
  }
</style>