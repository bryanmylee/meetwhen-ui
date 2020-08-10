<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { isCreatingNewSelection } from '../stores';

  import Tooltip from 'src/components/ui/Tooltip.svelte';
  import TooltipDismiss from 'src/components/ui/TooltipDismiss.svelte';

  const dispatch = createEventDispatcher();

  export let use;

  // CONSTANTS
  // =========
  const popperOptions = { placement: 'right-start' };

  $: if ($isCreatingNewSelection) {
    dispatch('dismiss');
  }
</script>

<div class="tooltip-container" transition:fade={{ duration: 200 }}>
  <Tooltip use={use} {popperOptions} style="font-size: 1rem">
    <div class="tooltip">
      <h4>Other people's schedules</h4>
      <TooltipDismiss on:click={() => dispatch('dismiss')}/>
    </div>
    <h5 class="tip">Select to view more</h5>
  </Tooltip>
</div>

<style>
  .tooltip-container {
    pointer-events: none;
  }

  .tooltip {
    margin: 0.5em;
    display: flex;
    align-items: center;
  }

  h4 {
    margin-right: 0.5em;
  }

  .tip {
    margin: 0 0.5em 0.5em;
  }
</style>
