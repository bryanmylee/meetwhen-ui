<script>
  import { isSelecting } from '../../../stores.js';
  import { popperFollowMouseY } from '../../../actions/popper.js';
  import { sizePos } from '../../../actions/dayColumn.js';
  import { opacity } from '../../../actions/style.js';

  import JoinEventOtherUsersPopover from './JoinEventOtherUsersPopover.svelte';

  export let start;
  export let end;
  export let usernames;
  export let maxUsernames = 0;

  export let isCollapsed = false;

  let showPopup = false;
  let popup;
  let arrow;
  let mouseY;

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

<div
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  use:sizePos={{start: start, end: end}}
  use:opacity={{opacity: getOpacity(usernames)}}
  use:popperFollowMouseY={{
    popup, mouseY, placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: ({ placement }) => placement.endsWith('end') ? [21, 9] : [-21, 9],
        },
      },
      {
        name: 'arrow',
        options: {
          element: arrow,
          padding: 12,
        },
      },
    ],
  }}
  on:mouseover={() => {showPopup = true}}
  on:mouseleave={() => {showPopup = false}}
  on:mousemove={({ clientY }) => mouseY = clientY}
/>
{#if showPopup}
  <div bind:this={popup} class="popup">
    <JoinEventOtherUsersPopover {start} {end} {usernames} />
    <div bind:this={arrow} class="popup__arrow"></div>
  </div>
{/if}

<style>
  .other-user-selection {
    position: absolute;
    z-index: 10;
    width: var(--select-width);
    border-radius: 5px;
    background-color: var(--primary-0);
    transition: var(--ease-out) width, var(--ease-out) border-radius;
    pointer-events: all;
  }

  .collapsed {
    width: var(--select-collapse-width);
  }

  .pass-through {
    pointer-events: none;
  }

  .popup {
    z-index: 90;
  }

  .popup__arrow {
    z-index: 31;
    left: -0.4rem;
    width: 0.5rem;
    height: 1rem;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
    background-color: white;
    box-shadow: var(--shadow-med);
    pointer-events: none;
  }

  :global([data-popper-placement^="left"]) .popup__arrow {
    left: unset;
    right: -0.4rem;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
</style>
