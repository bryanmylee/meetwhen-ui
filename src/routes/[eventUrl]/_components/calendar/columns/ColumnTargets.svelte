<script>
  import QuarterHourCell from './QuarterHourTarget.svelte';

  // PROPS
  // =====
  export let day;
</script>

<div class="col__targets">
  {#each Array(24) as _, hour}
    {#each Array(4) as _, quarter}
      <QuarterHourCell {day} hour={hour + quarter * 0.25} />
    {/each}
  {/each}
</div>