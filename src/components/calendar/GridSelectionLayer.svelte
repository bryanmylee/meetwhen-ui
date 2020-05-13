<script>
  import Selection from './Selection.svelte';

  export let selections;
  export let activeSelection;
</script>

<div>
  {#each selections as selection}
    <Selection {...selection} />
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