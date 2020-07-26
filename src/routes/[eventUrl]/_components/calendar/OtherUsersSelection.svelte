<script>
  import { createEventDispatcher } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { fade } from 'svelte/transition';

  import { currentColor } from 'src/stores';
  import { isSelecting } from './stores';
  import { sizePos } from 'src/components/calendar/actions/selection';
  import colorGradient from 'src/actions/colorGradient';

  import OtherUsersPopover from './OtherUsersPopover.svelte';

  const dispatch = createEventDispatcher();
  const [popperRef, popperContent] = createPopperActions();

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let minUsernameCount = 0;
  export let maxUsernameCount = 1;
  export let isCollapsed = false;
  export let isSelected = false;

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
  use:sizePos={{ start, end }}
  use:colorGradient={{
    scale: $currentColor.scale,
    index: usernames.length - minUsernameCount + 1,
    total: maxUsernameCount - minUsernameCount + 1,
  }}
  use:popperRef
  on:click={handleClick}
  in:fade={{ duration: 100 }}
  out:fade={{ duration: 200, delay: 50 }}
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
    transition: width 200ms ease-out, background-color 200ms ease-out;
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
