<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { getTargets } from 'src/utils/eventHandler';
  import Tooltip from 'src/components/ui/Tooltip.svelte';
  import TooltipDismiss from 'src/components/ui/TooltipDismiss.svelte';

  const dispatch = createEventDispatcher();

  export let use;

  // CONSTANTS
  // =========
  const popperOptions = { placement: 'right-start' };

  function handleClick(event) {
    const targets = getTargets(event);
    const tooltip = targets.find((target) => target.dataset.popperContent != null);
    if (tooltip == null) {
      dispatch('dismiss');
    }
  }
</script>

<svelte:window on:click={handleClick} />

<div transition:fade={{ duration: 200 }}>
  <Tooltip use={use} {popperOptions} style="font-size: 1rem">
    <div class="tooltip">
      <h5>Other people's schedules</h5>
      <TooltipDismiss on:click={() => dispatch('dismiss')}/>
    </div>
    <h5 class="tip">Select to view more</h5>
  </Tooltip>
</div>

<style>
  .tooltip {
    margin: 0.5em;
    display: flex;
    align-items: center;
  }

  h5 {
    margin-right: 0.5em;
  }

  .tip {
    margin: 0 0.5em 0.5em;
  }
</style>
