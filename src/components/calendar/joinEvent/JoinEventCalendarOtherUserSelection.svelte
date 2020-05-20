<script>
  import { getTop, getHeight } from '../../../utils/selections.js';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }[]
   */
  export let interval = null;
  export let maxUsernames = 0;

  let isCollapsed = false;
  setInterval(() => isCollapsed = true, 1000);

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

<div
  class={isCollapsed ? "collapsed" : ""}
  style="top:{getTop(interval.start)};
          height:{getHeight(interval.end - interval.start)};
          opacity:{getOpacity(interval.usernames)}"
></div>

<style>
  div {
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-0);
    transition: 1s cubic-bezier(0.3, 0.03, 0.1, 0.97) width;
    pointer-events: all;
  }

  .collapsed {
    width: calc(var(--col-width) / 10);
  }
</style>
