<script>
  import { createPopperActions } from 'svelte-popperjs';

  import Tooltip from 'src/components/ui/Tooltip.svelte';

  const [popperRef, popperContent] = createPopperActions();

  // PROPS
  // =====
  export let tooltip = 'Required field';

  // STATE
  // =====
  let showTooltip = false;

  // CONSTANTS
  // =========
  const popperOptions = {
    placement: 'right',
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  };
</script>

<span
  use:popperRef
  on:mouseenter={() => showTooltip = true}
  on:mouseleave={() => showTooltip = false}
/>
{#if showTooltip}
  <Tooltip use={popperContent} {popperOptions}>
    <h5>{tooltip}</h5>
  </Tooltip>
{/if}

<style>
  span {
    background-color: var(--grey-400);
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    position: absolute;
    top: 1.15em;
    right: 1em;
  }

  h5 {
    margin: 0.5em;
    font-weight: 600;
  }
</style>