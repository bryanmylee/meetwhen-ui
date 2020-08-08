<script>
  import { slide } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';

  import { calendarSelectionEnabled } from './stores';

  import Info from 'src/components/icons/Info.svelte';
  import ErrorTip from 'src/components/ui/ErrorTip.svelte';
  import Tooltip from 'src/components/ui/Tooltip.svelte';

  const [popperRef, popperContent] = createPopperActions();

  export let showError = false;

  // STATE
  // =====
  let showTooltip = false;
  // Set showTooltip to false whenever calendarSelecitonEnabled is toggled.
  $: showTooltip = $calendarSelectionEnabled && false;

  const popperOptions = { placement: 'left' };
</script>

<!-- CALENDAR PICKER CARD TITLE HEADER -->
<!-- Wrap the slide transition within an extra div to prevent jitter issue
on Chrome and Firefox -->
{#if $calendarSelectionEnabled}
  <div class="transition-container">
    <div class="container" transition:slide={{ duration: 300 }}>
      <div class="header">
        <h3>Add your schedule</h3>
        <span
          use:popperRef
          on:click={() => showTooltip = !showTooltip}
        >
          <Info color="var(--grey-800)" />
        </span>
      </div>
      <ErrorTip show={showError}>
        Schedule cannot be empty
      </ErrorTip>
    </div>
  </div>
  {#if showTooltip}
    <Tooltip use={popperContent} {popperOptions}>
      <div class="tooltip-content">
        <h5>
          Long touch and drag to make a selection
        </h5>
      </div>
    </Tooltip>
  {/if}
{/if}

<style>
  .transition-container {
    background-color: var(--bg);
    z-index: 21;
    margin-bottom: -1px;
  }

  .container {
    padding: 0.8em;
    padding-bottom: 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  span {
    margin: -4px;
    width: 32px;
    height: 32px;
    padding: 6px;
    z-index: 30;
    border-radius: 500px;
    cursor: pointer;
  }

  span:hover, span:focus {
    background-color: var(--grey-200);
  }

  .tooltip-content {
    padding: 0.5em;
  }
</style>