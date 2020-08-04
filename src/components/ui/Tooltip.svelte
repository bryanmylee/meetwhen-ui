<script>
  // PROPS
  // =====
  export let use;
  export let popperOptions;
</script>

<div class="popover" use:use={popperOptions}>
  <div class="popover__content">
    <slot/>
  </div>
  <div data-popper-arrow class="popover__arrow"></div>
</div>

<style>
  .popover {
    z-index: 80;
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
    box-shadow: var(--shadow-small);
  }

  .popover__arrow {
    z-index: 31;
    left: -7px;
    width: 8px;
    height: 16px;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: var(--grey-300);
    pointer-events: none;
  }

  .popover__arrow:before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1.5px;
    width: 7px;
    height: 14px;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: var(--bg);
  }

  :global([data-popper-placement^="left"]) .popover__arrow {
    left: unset;
    right: -7px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  :global([data-popper-placement^="left"]) .popover__arrow:before {
    left: unset;
    right: 1.5px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
</style>