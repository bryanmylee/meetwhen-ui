<script>
  import Tooltip from 'src/components/ui/Tooltip.svelte';

  // PROPS
  // =====
  export let start;
  export let end;
  export let usernames;
  export let popperAction;

  // CONSTANTS
  // =========
  const popperOptions = {
    placement: 'right',
    modifiers: [
      { name: 'offset', options: { offset: [0, 9] } },
    ],
  };

  // REACTIVE ATTRIBUTES
  // ===================
  $: timeString = `${start.format('h:mm')} - ${end.format('h:mma')}`;
  $: countString = usernames.length === 1
    ? '1 person'
    : `${usernames.length} people`;
</script>

<Tooltip use={popperAction} {popperOptions} >
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