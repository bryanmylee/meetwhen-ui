<script>
  import { createPopperActions } from 'svelte-popperjs';

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
  <div class="popover" use:popperContent={popperOptions}>
    <div class="popover__content">
      <h5>{tooltip}</h5>
    </div>
    <div data-popper-arrow class="popover__arrow"></div>
  </div>
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

  .popover {
    z-index: 90;
  }

  .popover__content {
    z-index: 30;
    width: -moz-max-content;
    width: -webkit-max-content;
    height: -moz-max-content;
    height: -webkit-max-content;
    background-color: var(--bg);
    border: 1px solid var(--grey-300);
    border-radius: 5px;
  }

  .popover__arrow {
    z-index: 31;
    left: -0.45em;
    width: 0.5em;
    height: 1em;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: var(--grey-300);
    pointer-events: none;
  }

  .popover__arrow:before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1.5px;
    width: calc(0.5em - 1px);
    height: calc(1em - 2px);
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: var(--bg);
  }

  :global([data-popper-placement^="left"]) .popover__arrow {
    left: unset;
    right: -0.44em;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  :global([data-popper-placement^="left"]) .popover__arrow:before {
    left: unset;
    right: 1.5px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  h5 {
    margin: 0.5em;
    font-weight: 600;
  }
</style>