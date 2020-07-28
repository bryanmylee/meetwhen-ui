<script>
  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let popperAction;

  // CONSTANTS
  // =========
  const popperOptions = {
    placement: 'right',
    modifiers: [
      { name: 'offset', options: { offset: [0, 9] } },
    ],
  };

  // REACTIVE ATTRIBUTES
  // ===================
  $: timeString = `${start.format('h:mm')} - ${end.format('h:mma')}`;
  $: countString = usernames.length === 1
    ? '1 person'
    : `${usernames.length} people`;
</script>

<div class="popover" use:popperAction={popperOptions}>
  <div class="popover__content">
    <h5>{timeString}</h5>
    <h5 class="tip">{countString}</h5>
    <div class="names__container">
      {#each usernames.sort() as username}
        <p>{username}</p>
      {/each}
    </div>
  </div>
  <div data-popper-arrow class="popover__arrow"></div>
</div>

<style>
  .popover {
    z-index: 90;
  }

  .popover__content {
    z-index: 30;
    width: -moz-max-content;
    width: -webkit-max-content;
    height: -moz-max-content;
    height: -webkit-max-content;
    background-color: white;
    border: 1px solid var(--grey-300);
    border-radius: 5px;
    /* box-shadow: var(--shadow-med); */
  }

  .popover__arrow {
    z-index: 31;
    left: -0.45rem;
    width: 0.5rem;
    height: 1rem;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: var(--grey-300);
    pointer-events: none;
  }

  .popover__arrow:before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1.5px;
    width: calc(0.5rem - 1px);
    height: calc(1rem - 2px);
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: var(--bg);
  }

  :global([data-popper-placement^="left"]) .popover__arrow {
    left: unset;
    right: -0.44rem;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  :global([data-popper-placement^="left"]) .popover__arrow:before {
    left: unset;
    right: 1.5px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  h5 {
    margin: 1em 1em;
  }

  .names__container {
    max-height: 15rem;
    overflow-y: auto;
    padding: 1em;
    border-top: 1px solid var(--grey-300);
  }

  p {
    margin: 0 0 0.5em;
  }

  p:last-child {
    margin: 0;
  }
</style>