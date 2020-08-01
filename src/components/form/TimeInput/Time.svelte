<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  export let time;
  export let earliestTime;

  // REACTIVE ATTRIBUTES
  // ===================
  $: disabled = earliestTime && time.isBefore(earliestTime, 'hour');

  // STATE FUNCTIONS
  // ===============
  function handleClick() {
    if (disabled) return;
    dispatch('select', { time });
  }
</script>

<div
  class:disabled={disabled}
  on:click={handleClick}
>
  {time.format('ha')}
</div>

<style>
  div {
    padding: 1em;
    background-color: var(--bg);
    border-bottom: 1px var(--grey-200) solid;
    cursor: pointer;
  }

  div:hover {
    background-color: var(--grey-50);
  }

  div.disabled {
    color: var(--text-3);
    cursor: unset;
  }
</style>