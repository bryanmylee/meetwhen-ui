<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
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
  let showPopover = false;

  // NODES
  // =====
  let targetNode;

  // STATE FUNCTIONS
  // ===============
  function handleClick(event) {
    dispatch('selectInterval', {
      start,
      end,
      usernames,
      targetNode,
    });
  }
</script>

<div
  bind:this={targetNode}
  class={"other-user-selection"}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  use:sizePos={{start: start, end: end}}
  use:colorGradient={{scale: $colorScale, ratio}}
  on:click={handleClick}
  in:fade={{duration: 100}}
  out:fade={{duration: 200, delay: 50}}
/>

<style>
  .other-user-selection {
    position: absolute;
    z-index: 10;
    width: calc(100% + 1px);
    box-sizing: border-box;
    transition: width 400ms var(--ease-out-sharp), background-color 400ms var(--ease-out-sharp);
    pointer-events: all;
  }

  .other-user-selection:hover {
    border: 1px solid;
  }

  .collapsed {
    width: var(--select-collapse-width);
  }

  .pass-through {
    pointer-events: none;
  }
</style>
