<script>
  import { createEventDispatcher } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { fade } from 'svelte/transition';

  import { currentColor } from 'src/stores';
  import { calendarSelectionEnabled, isCreatingNewSelection } from '../stores';
  import colorGradient from 'src/actions/colorGradient';
  import { sizePos } from '../actions/selection';
  import { SHOW_OTHER_USERS, HIDE_OTHER_USERS } from '../../../_tooltipDelays';

  import Tooltip from 'src/components/ui/Tooltip.svelte';
  import TooltipDismiss from 'src/components/ui/TooltipDismiss.svelte';
  import OtherUsersPopover from './OtherUsersPopover.svelte';

  const dispatch = createEventDispatcher();
  const [popperRef, popperContent] = createPopperActions();
  const [hintPopperRef, hintPopperContent] = createPopperActions();

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let skipped;
  export let skipping;
  export let minUsers = 0;
  export let maxUsers = 1;
  export let isFirst = false;
  export let isSelected = false;

  // STATE
  // =====
  let showHint = false;
  let hideTimer = null;
  $: if ($calendarSelectionEnabled && isFirst) {
    clearTimeout(hideTimer);
    setTimeout(() => {
      if ($calendarSelectionEnabled) {
        showHint = true;
      }
    }, SHOW_OTHER_USERS);
  } else {
    showHint = false;
  }

  $: if (isSelected) {
    showHint = false;
  }

  $: if (showHint) {
    hideTimer = setTimeout(() => {
      showHint = false;
    }, HIDE_OTHER_USERS);
  }

  // CONSTANTS
  // =========
  const popperOptions = { placement: 'right-start' };
</script>

<div
  class="other-user-selection"
  on:click={() => dispatch('select', { start, end })}
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
  use:hintPopperRef
  in:fade={{ duration: 100 }}
  out:fade={{ duration: 200, delay: 50 }}
/>
{#if showHint}
  <div transition:fade={{ duration: 200 }}>
    <Tooltip use={hintPopperContent} {popperOptions} >
      <div class="tooltip">
        <h5>Other people's schedules</h5>
        <TooltipDismiss on:click={() => showHint = false}/>
      </div>
      <h5 class="tip">Select to view more</h5>
    </Tooltip>
  </div>
{/if}
{#if isSelected}
  <OtherUsersPopover
    on:dismiss
    popperAction={popperContent}
    {start}
    {end}
    {usernames}
  />
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

  .tooltip {
    display: flex;
    align-items: center;
  }

  h5 {
    margin: 0.5em;
    margin-right: 0.5em;
  }
</style>
