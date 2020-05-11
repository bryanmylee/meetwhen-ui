<script>
  import GridSelection from './GridSelection.svelte';

  export let selections;
</script>

<div>
  {#each selections as selection}
    <GridSelection {...selection} />
  {/each}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>