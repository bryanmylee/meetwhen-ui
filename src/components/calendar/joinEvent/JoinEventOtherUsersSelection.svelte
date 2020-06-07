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

  let showPopover = false;
  let popoverNode;
  let arrowNode;
  let mouseY;
  $: popperOptions = ({
    popoverNode, mouseY, placement: 'right-start',
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
          element: arrowNode,
          padding: 12,
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
  use:popperFollowMouseY={popperOptions}
  on:mouseover={() => {showPopover = true}}
  on:mouseleave={() => {showPopover = false}}
  on:mousemove={({ clientY }) => mouseY = clientY}
/>
{#if showPopover}
  <JoinEventOtherUsersPopover
    bind:popoverNode={popoverNode}
    bind:arrowNode={arrowNode}
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
</style>
