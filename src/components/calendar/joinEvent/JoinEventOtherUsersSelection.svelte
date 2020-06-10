<script>
  import { isSelecting, colorScale } from '@/stores.js';
  import { sizePos } from '@/actions/dayColumn.js';
  import colorGradient from '@/actions/colorGradient.js';

  import JoinEventOtherUsersPopover from './JoinEventOtherUsersPopover.svelte';

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let maxUsernameCount = 0;
  export let isCollapsed = false;

  // REACTIVE ATTRIBUTES
  // ===================
  $: ratio = usernames.length / maxUsernameCount;

  // STATE
  // =====
  let mouseOver = false;
  let clientY;

  // NODES
  // =====
  let referenceNode;
</script>

<div
  bind:this={referenceNode}
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  class:highlighted={mouseOver}
  use:sizePos={{start: start, end: end}}
  use:colorGradient={{scale: $colorScale, ratio, highlighted: mouseOver}}
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
    box-sizing: border-box;
    transition: var(--ease-out) width;
    pointer-events: all;
  }

  .other-user-selection.highlighted {
    border: 1px solid;
  }

  .collapsed {
    width: var(--select-collapse-width);
  }

  .pass-through {
    pointer-events: none;
  }
</style>
