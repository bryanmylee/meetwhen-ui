<script>
  import { createEventDispatcher } from 'svelte';

  import { getTargets } from 'src/utils/eventHandler';
  import { allUsernames, selectedUsernames } from '../../../_stores';

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
  $: selectedOrAllUsernames = $selectedUsernames.length === 0 ? $allUsernames : $selectedUsernames;
  $: notAttendingUsernames = selectedOrAllUsernames.filter((u) => !usernames.includes(u));

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
  <h5 class="time">{timeString}</h5>
  <h5 class="header">{usernames.length} attending</h5>
  <div class="names__container">
    {#each usernames.sort() as username}
      <p>
        {username}
      </p>
    {/each}
  </div>
  <h5 class="header">{notAttendingUsernames.length} not attending</h5>
  <div class="names__container">
    {#each notAttendingUsernames.sort() as username}
      <p class="not-attending">
        {username}
      </p>
    {/each}
  </div>
</Tooltip>

<style>
  .time {
    padding: 1em;
  }

  .header {
    font-style: italic;
    padding: 1em;
    padding-bottom: 0;
    border-top: 1px solid var(--grey-300);
  }

  .names__container {
    font-size: 0.8em;
    max-height: 15em;
    overflow-y: auto;
    padding: 1em;
  }

  p {
    margin-bottom: 0.5em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  .not-attending {
    color: var(--text-500);
  }
</style>