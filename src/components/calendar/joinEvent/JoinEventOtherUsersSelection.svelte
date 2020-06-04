<script>
  import { isSelecting } from '../../../stores.js';
  import popper from '../../../actions/popper.js';
  import { sizePos } from '../../../actions/column.js';
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
</script>

<div
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  use:sizePos={{start: start, end: end}}
  use:opacity={{opacity: getOpacity(usernames)}}
  use:popper={{ popup, placement: 'right' }}
  on:mouseover={() => {showPopup = true}}
  on:mouseleave={() => {showPopup = false}}
></div>
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
    z-index: 100;
  }
</style>
