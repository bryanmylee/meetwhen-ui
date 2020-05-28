<script>
  import popper from '../../../actions/popper.js';
  import { getTop, getHeight } from '../../../utils/selections.js';

  import JoinEventOtherUsersPopover from './JoinEventOtherUsersPopover.svelte';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }
   */
  export let interval;
  export let maxUsernames = 0;

  export let isCollapsed = false;

  let showPopup = false;
  let popup;

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

<div
  class={"other-user-selection " + (isCollapsed ? "collapsed" : "")}
  style="top:{getTop(interval.start)};
          height:{getHeight(interval.end - interval.start)};
          opacity:{getOpacity(interval.usernames)};"
  on:mouseover={() => {showPopup = true}}
  on:mouseleave={() => {showPopup = false}}
  use:popper={{ popup, placement: 'right-start' }}
></div>
{#if showPopup}
  <div bind:this={popup} class="popup">
    <JoinEventOtherUsersPopover {interval} />
  </div>
{/if}

<style>
  .other-user-selection {
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-0);
    transition: var(--ease) width;
    pointer-events: all;
  }

  .collapsed {
    width: calc(var(--col-width) / 6);
  }

  .popup {
    z-index: 100;
  }
</style>
