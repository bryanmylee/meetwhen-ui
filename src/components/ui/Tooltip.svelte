<script>
  // PROPS
  // =====
  export let use;
  export let popperOptions = {};
  export let style = '';

  const defaultOptions = {
    placement: 'right',
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  };
</script>

<div class="popover" use:use={{ ...defaultOptions, ...popperOptions }} {style}>
  <div data-popper-content>
    <slot/>
  </div>
  <div data-popper-arrow></div>
</div>

<style>
  .popover {
    z-index: 80;
  }

  [data-popper-content] {
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

  [data-popper-arrow] {
    z-index: 31;
    width: 8px;
    height: 16px;
    background-color: var(--grey-300);
    pointer-events: none;
  }

  [data-popper-arrow]:before {
    content: '';
    position: absolute;
    top: 1px;
    width: 7px;
    height: 14px;
    background-color: var(--bg);
  }

  :global([data-popper-placement^="right"]) [data-popper-arrow]{
    left: -7px;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
  }

  :global([data-popper-placement^="right"]) [data-popper-arrow]:before {
    left: 1.5px;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
  }

  :global([data-popper-placement^="left"]) [data-popper-arrow] {
    right: -7px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  :global([data-popper-placement^="left"]) [data-popper-arrow]:before {
    right: 1.5px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  :global([data-popper-placement^="top"]) [data-popper-arrow] {
    width: 16px;
    height: 8px;
    bottom: -7px;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  :global([data-popper-placement^="top"]) [data-popper-arrow]:before {
    width: 14px;
    height: 6.5px;
    top: 0px;
    left: 1px;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  :global([data-popper-placement^="bottom"]) [data-popper-arrow] {
    width: 16px;
    height: 8px;
    top: -7px;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }

  :global([data-popper-placement^="bottom"]) [data-popper-arrow]:before {
    width: 14px;
    height: 7px;
    top: 1.5px;
    left: 1px;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
</style>