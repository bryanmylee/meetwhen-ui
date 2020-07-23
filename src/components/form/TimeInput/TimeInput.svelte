<script>
  import { createPopperActions } from 'svelte-popperjs';

  import DropdownArrow from './DropdownArrow.svelte';
  import TimeDropdown from './TimeDropdown.svelte';

  const [popperRef, popperContent] = createPopperActions();

  // BINDINGS
  // ========
  export let selectedTime;

  // PROPS
  // =====
  export let earliestTime;
  export let latestTime;
  export let label;
  export let style;

  // REACTIVE FUNCTIONS
  // ==================
  $: {
    if (earliestTime
        && (selectedTime == null
            || earliestTime.isAfter(selectedTime, 'hour'))) {
      selectedTime = earliestTime;
    }
  }

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
</script>

<div class="label">
  {label}
</div>
<div
  use:popperRef
  class="container card outline" {style}
  on:click={handleClick}
>
  <span>{selectedTime ? selectedTime.format('ha') : ''}</span>
  <DropdownArrow/>
</div>
{#if showTimes}
  <TimeDropdown
    on:select={select}
    on:hide={() => showTimes = false}
    {earliestTime} {latestTime}
    popperAction={popperContent}
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
    display: grid;
    grid-template-columns: auto 2.5rem;
    align-items: center;
    background-color: var(--background-0);
    cursor: pointer;
    transition: all 200ms ease;
  }

  .container:hover {
    background-color: var(--background-1);
  }

  span {
    margin-left: 0.8rem;
  }
</style>