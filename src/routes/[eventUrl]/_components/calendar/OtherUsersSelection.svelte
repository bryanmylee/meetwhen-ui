<script>
  import { fade } from 'svelte/transition';

  import { colorScale } from 'src/stores.js';
  import { isSelecting } from './stores.js';
  import { sizePos } from 'src/components/calendar/actions/selection.js';
  import colorGradient from 'src/actions/colorGradient.js';

  import OtherUsersPopover from './OtherUsersPopover.svelte';

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
  let targetNode;
</script>

<div
  bind:this={targetNode}
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  class:highlighted={mouseOver}
  use:sizePos={{start: start, end: end}}
  use:colorGradient={{scale: $colorScale, ratio, highlighted: mouseOver}}
  on:mouseover={() => {mouseOver = true}}
  on:mouseleave={() => {mouseOver = false}}
  on:mousemove={(event) => clientY = event.clientY}
  in:fade={{duration: 100}}
  out:fade={{duration: 200, delay: 50}}
/>
{#if mouseOver}
  <OtherUsersPopover
    {targetNode} {clientY}
    {start} {end} {usernames}
  />
{/if}

<style>
  .other-user-selection {
    position: absolute;
    z-index: 10;
    width: calc(100% + 1px);
    box-sizing: border-box;
    transition: width 400ms var(--ease-out-sharp), background-color 400ms var(--ease-out-sharp);
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
