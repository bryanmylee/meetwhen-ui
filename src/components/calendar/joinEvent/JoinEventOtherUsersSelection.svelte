<script>
  import { getTop, getHeight } from '../../../utils/selections.js';

  import JoinEventOtherUsersPopover from './JoinEventOtherUsersPopover.svelte';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }
   */
  export let interval;
  export let maxUsernames = 0;

  export let isCollapsed = false;

  let isHovered = false;

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

<div
  class="other-user-selection-container"
  style="top:{getTop(interval.start)};"
  on:mouseleave={() => {isHovered = false}}
>
  <div
    class={"selection " + (isCollapsed ? "collapsed" : "")}
    style="height:{getHeight(interval.end - interval.start)};
           opacity:{getOpacity(interval.usernames)};"
    on:mouseover={() => {isHovered = true}}
  ></div>
  {#if isHovered}
    <JoinEventOtherUsersPopover {interval} />
  {/if}
</div>

<style>
  .other-user-selection-container {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
    position: absolute;
  }

  .selection {
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-0);
    transition: var(--ease) width;
    pointer-events: all;
  }

  .collapsed {
    width: calc(var(--col-width) / 6);
  }
</style>
