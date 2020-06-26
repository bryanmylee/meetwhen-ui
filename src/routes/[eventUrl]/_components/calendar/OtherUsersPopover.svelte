<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import { popper } from 'src/actions/popper.js';

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  // For PopperJS
  export let targetNode = null;

  // REACTIVE ATTRIBUTES
  // ===================
  $: popperOptions = ({
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      },
    ],
  });

  // ATTRIBUTES
  // ==========
  const timeString = `${start.format('h:mm')} - ${end.format('h:mma')}`;
  const countString = usernames.length === 1
      ? '1 person:'
      : `${usernames.length} people:`;

  // STATE FUNCTIONS
  // ===============
  function handleClick(event) {
    if (event.target !== targetNode) {
      dispatch('deselectInterval');
    }
  }
</script>

<div class="popover" use:popper={{targetNode, popperOptions}}>
  <div class="popover__content">
    <h5>{timeString}</h5>
    <h5>{countString}</h5>
    {#each usernames as username}
      <p>{username}</p>
    {/each}
  </div>
  <div data-popper-arrow class="popover__arrow"></div>
</div>

<svelte:window on:click={handleClick}/>

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
    padding: 0.5em;
    border-radius: 5px;
    box-shadow: var(--shadow-med);
  }

  .popover__arrow {
    z-index: 31;
    left: -0.4rem;
    width: 0.5rem;
    height: 1rem;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: white;
    box-shadow: var(--shadow-med);
    pointer-events: none;
  }

  :global([data-popper-placement^="left"]) .popover__arrow {
    left: unset;
    right: -0.4rem;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  h5 {
    margin: 0.2em 0 0.5em;
  }

  p {
    margin: 0.2em 0;
  }
</style>