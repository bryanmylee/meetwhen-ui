<script>
  import { isSelecting } from '../../../stores.js';
  import { sizePos } from '../../../actions/dayColumn.js';
  import { opacity } from '../../../actions/style.js';

  import JoinEventOtherUsersPopover from './JoinEventOtherUsersPopover.svelte';

  export let start;
  export let end;
  export let usernames;
  export let maxUsernames = 0;
  export let isCollapsed = false;

  let mouseOver = false;
  let referenceNode;
  let clientY;

  function getOpacity(usernames) {
    return usernames.length / maxUsernames;
  }
</script>

<div
  bind:this={referenceNode}
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  class:highlighted={mouseOver}
  use:sizePos={{start: start, end: end}}
  use:opacity={{opacity: getOpacity(usernames)}}
  on:mouseover={() => {mouseOver = true}}
  on:mouseleave={() => {mouseOver = false}}
  on:mousemove={(event) => clientY = event.clientY}
/>
{#if mouseOver}
  <JoinEventOtherUsersPopover
    {referenceNode} {clientY}
    {start} {end} {usernames}
  />
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

  .highlighted {
    background-color: var(--primary-1-0);
  }
</style>
