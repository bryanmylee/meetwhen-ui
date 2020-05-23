<script>
  import { getTop, getHeight } from '../../../utils/selections.js';

  import JoinEventCalendarOtherUsersPopover
      from './JoinEventCalendarOtherUsersPopover.svelte';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }
   */
  export let interval;
  export let maxUsernames = 0;

  let isCollapsed = false;
  setInterval(() => isCollapsed = true, 1000);

  let isHovered = false;

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

<div
  id="other-user-selection-container"
  style="top:{getTop(interval.start)};"
  on:mouseleave={() => {isHovered = false}}
>
  <div
    id="selection"
    class={isCollapsed ? "collapsed" : ""}
    style="height:{getHeight(interval.end - interval.start)};
           opacity:{getOpacity(interval.usernames)};"
    on:mouseover={() => {isHovered = true}}
  ></div>
  {#if isHovered}
    <JoinEventCalendarOtherUsersPopover {interval} />
  {/if}
</div>

<style>
  #other-user-selection-container {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
    position: absolute;
  }

  #selection {
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-0);
    transition: var(--ease) width;
    pointer-events: all;
  }

  #selection.collapsed {
    width: calc(var(--col-width) / 6);
  }
</style>
