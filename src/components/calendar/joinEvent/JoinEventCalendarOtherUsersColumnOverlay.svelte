<script>
  import { getTop, getHeight } from '../../../utils/selections.js';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }[]
   */
  export let mergedIntervals = [];
  export let maxUsernames = 0;

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

{#each mergedIntervals as interval}
  <div
    style="top:{getTop(interval.start)};
           height:{getHeight(interval.end - interval.start)};
           opacity:{getOpacity(interval.usernames)}"
  ></div>
{/each}

<style>
  div {
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-0);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: all;
  }
</style>
