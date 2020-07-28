<script>
  import { createEventDispatcher } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { fade } from 'svelte/transition';

  import { currentColor } from 'src/stores';
  import { isCreatingNewSelection } from '../stores';
  import { calendarSelectionEnabled } from '../../../stores';
  import colorGradient from 'src/actions/colorGradient';
  import { sizePos } from '../actions/selection';

  import OtherUsersPopover from './OtherUsersPopover.svelte';

  const dispatch = createEventDispatcher();
  const [popperRef, popperContent] = createPopperActions();

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let skipped;
  export let skipping;
  export let minUsers = 0;
  export let maxUsers = 1;
  export let isSelected = false;

  // STATE FUNCTIONS
  // ===============
  function handleClick() {
    dispatch('select', { start, end });
  }
</script>

<div
  class="other-user-selection"
  class:selected={isSelected}
  class:collapsed={$calendarSelectionEnabled}
  class:pass-through={$isCreatingNewSelection}
  class:cap-top={skipped}
  class:cap-bottom={skipping}
  use:sizePos={{ start, end }}
  use:colorGradient={{
    scale: $currentColor.scale,
    index: usernames.length - minUsers + 1,
    total: maxUsers - minUsers + 1,
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

  .other-user-selection.cap-top {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .other-user-selection.cap-bottom {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .collapsed {
    width: var(--select-collapse-width);
  }

  .pass-through {
    pointer-events: none;
  }
</style>
