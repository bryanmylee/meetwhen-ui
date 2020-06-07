<script>
  import { isSelecting } from '../../../stores.js';
  import { sizePos } from '../../../actions/dayColumn.js';
  import colorGradient from '../../../actions/colorGradient.js';

  import JoinEventOtherUsersPopover from './JoinEventOtherUsersPopover.svelte';

  export let start;
  export let end;
  export let usernames;
  export let maxUsernames = 0;
  export let isCollapsed = false;
  $: ratio = usernames.length / maxUsernames;

  let mouseOver = false;
  let referenceNode;
  let clientY;
</script>

<div
  bind:this={referenceNode}
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  class:highlighted={mouseOver}
  use:sizePos={{start: start, end: end}}
  use:colorGradient={{ratio}}
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
    /* border-top: 1px solid;
    border-bottom: 1px solid; */
    box-sizing: border-box;
    transition: var(--ease-out) width;
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
