<script>
  import { createPopperActions } from 'svelte-popperjs';

  import CaretDown from 'src/components/icons/CaretDown.svelte';
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
<button
  use:popperRef
  class="container card outline" {style}
  on:click={handleClick}
>
  <span>{selectedTime ? selectedTime.format('ha') : ''}</span>
  <CaretDown/>
</button>
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

  button {
    width: 100%;
    height: min-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--grey-100);
    cursor: pointer;
    transition: all 200ms ease;
  }

  button:focus {
    border: 1px solid var(--primary-500);
  }

  .container:hover {
    background-color: var(--grey-50);
  }

  span {
    margin-left: 0.8rem;
  }
</style>