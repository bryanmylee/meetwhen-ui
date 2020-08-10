<script>
  import { MS_PER_HOUR } from 'src/utils/constants';

  import QuarterHourCell from './QuarterHourTarget.svelte';

  // PROPS
  // =====
  export let start;
  export let end;

  const numHours = (end - start) / MS_PER_HOUR;
  const hours = [...Array(numHours)].map((_, i) => start.add(i, 'hour'));
</script>

<div class="col__targets">
  {#each hours as hour}
    {#each Array(4) as _, quarterIndex}
      <QuarterHourCell quarter={hour.add(quarterIndex * 0.25, 'hour')} />
    {/each}
  {/each}
</div>