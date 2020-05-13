<script>
  import Selection from './Selection.svelte';
  import NewSelection from './NewSelection.svelte';

  export let selections;
  export let newSelection;
</script>

<div>
  {#each selections as selection}
    <Selection {...selection} />
  {/each}
  {#if newSelection && newSelection.start && newSelection.end}
    <NewSelection {...newSelection} />
  {/if}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>