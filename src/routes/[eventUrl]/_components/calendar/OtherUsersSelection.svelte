<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import { createPopperActions } from 'svelte-popperjs';
  const [ popperRef, popperContent ] = createPopperActions();
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
  export let minUsernameCount = 0;
  export let maxUsernameCount = 1;
  export let isCollapsed = false;
  export let isSelected = false;

  // REACTIVE ATTRIBUTES
  // ===================
  $: ratio = (usernames.length - minUsernameCount)
      / Math.max(maxUsernameCount - minUsernameCount, 1);

  // STATE FUNCTIONS
  // ===============
  function handleClick() {
    dispatch('selectInterval', {
      start,
      end,
    });
  }
</script>

<div
  class="other-user-selection"
  class:selected={isSelected}
  class:collapsed={isCollapsed}
  class:pass-through={$isSelecting}
  use:sizePos={{start, end}}
  use:colorGradient={{scale: $colorScale, ratio}}
  use:popperRef
  on:click={handleClick}
  in:fade={{duration: 100}}
  out:fade={{duration: 200, delay: 50}}
/>
{#if isSelected}
  <OtherUsersPopover {start} {end} {usernames} popperAction={popperContent} />
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

  .other-user-selection.selected {
    border: 1px solid;
  }

  .collapsed {
    width: var(--select-collapse-width);
  }

  .pass-through {
    pointer-events: none;
  }
</style>
