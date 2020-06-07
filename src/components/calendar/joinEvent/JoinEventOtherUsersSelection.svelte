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

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }

  let mouseY;
  function handleMouseMove({ clientY }) {
    mouseY = clientY;
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
          offset: [-15, 0],
        },
      },
    ],
  }}
  on:mouseover={() => {showPopup = true}}
  on:mouseleave={() => {showPopup = false}}
  on:mousemove={handleMouseMove}
/>
{#if showPopup}
  <div bind:this={popup} class="popup">
    <JoinEventOtherUsersPopover {start} {end} {usernames} />
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
</style>
