<script>
  import { popperFollowMouseY } from '@/actions/popper.js';
  import { selectedUsernames } from '../../stores.js';

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  // For PopperJS
  export let referenceNode = null;
  export let clientY = 0;

  // REACTIVE ATTRIBUTES
  // ===================
  $: popperOptions = ({
    referenceNode,
    clientY,
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: ({ placement }) =>
              placement.endsWith('end') ? [21, 9] : [-21, 9],
        },
      },
      {
        name: 'eventListeners',
        options: {
          scroll: false,
          resize: false,
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
</script>

<div class="popover" use:popperFollowMouseY={popperOptions}>
  <div class="popover__content">
    <h5>{timeString}</h5>
    <h5>{countString}</h5>
    {#each usernames as username}
      <p class:selected={$selectedUsernames.includes(username)}>{username}</p>
    {/each}
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

  .selected {
    color: var(--primary-1);
  }
</style>