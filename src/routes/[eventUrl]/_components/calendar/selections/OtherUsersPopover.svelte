<script>
  import { createEventDispatcher } from 'svelte';

  import { getTargets } from 'src/utils/eventHandler';
  import Tooltip from 'src/components/ui/Tooltip.svelte';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let popperAction;

  // REACTIVE ATTRIBUTES
  // ===================
  $: timeString = `${start.format('h:mm')} - ${end.format('h:mma')}`;
  $: countString = usernames.length === 1
    ? '1 person'
    : `${usernames.length} people`;

  let firstClicked = false;
  function dismiss(event) {
    const targets = getTargets(event);
    const popperContent = targets.find((target) => target.dataset.popperContent != null);
    if (popperContent == null && firstClicked) {
      dispatch('dismiss');
    }
    firstClicked = true;
  }
</script>

<svelte:window on:click={dismiss} on:touchstart={dismiss} />

<Tooltip use={popperAction} style="font-size: 1rem">
  <h5>{timeString}</h5>
  <h5 class="tip">{countString}</h5>
  <div class="names__container">
    {#each usernames.sort() as username}
      <p>{username}</p>
    {/each}
  </div>
</Tooltip>

<style>
  h5 {
    margin: 1em 1em;
  }

  .names__container {
    max-height: 15em;
    overflow-y: auto;
    padding: 1em;
    border-top: 1px solid var(--grey-300);
  }

  p {
    margin: 0 0 0.5em;
  }

  p:last-child {
    margin: 0;
  }
</style>