<script>
  import DropdownArrow from './DropdownArrow.svelte';
  import TimeDropdown from './TimeDropdown.svelte';

  // BINDINGS
  // ========
  export let selectedTime;

  // PROPS
  // =====
  export let earliestTime;
  $: {
    if (earliestTime
        && (selectedTime == null
            || earliestTime.isAfter(selectedTime, 'hour'))) {
      selectedTime = earliestTime;
    }
  }
  export let label;
  export let style;

  // STATE
  // =====
  let showTimes = false;

  // STATE FUNCTIONS
  // ===============
  function handleClick() {
    showTimes = !showTimes;
  }

  function select(event) {
    const { time } = event.detail;
    selectedTime = time;
    showTimes = false;
  }

  // NODES
  // =====
  let targetNode;
</script>

<div class="label">
  {label}
</div>
<div
  bind:this={targetNode}
  class="container card outline" {style}
  on:click={handleClick}
>
  <span>{selectedTime ? selectedTime.format('ha') : ''}</span>
  <DropdownArrow/>
</div>
{#if showTimes}
  <TimeDropdown
    on:select={select}
    {targetNode} {earliestTime}
  />
{/if}

<style>
  .label {
    padding-right: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }

  .container {
    width: 100%;
    height: min-content;
  }

  .card {
    display: grid;
    grid-template-columns: auto 3rem;
    grid-auto-rows: min-content;
  }

  span {
    margin: 1rem;
  }
</style>