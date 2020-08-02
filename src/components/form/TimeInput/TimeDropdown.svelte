<script>
  import { createEventDispatcher } from 'svelte';
  import dayjs from 'dayjs';

  import Time from './Time.svelte';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  export let earliestTime;
  export let latestTime;
  export let popperAction;

  // STATE
  // =====
  const times = [...Array(25)].map((_, inc) => dayjs().hour(inc).minute(0));

  // REACTIVE ATTRIBUTES
  // ===================
  $: selfWidth = self ? parseFloat(getComputedStyle(self).width) : 0;
  $: popperOptions = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -selfWidth],
        },
      },
    ],
  };

  // STATE FUNCTIONS
  // ===============
  let firstClicked = false;
  function handleClick(event) {
    if (firstClicked && event.target !== self) {
      dispatch('hide');
    }
    firstClicked = true;
  }

  // NODES
  // =====
  let self;
</script>

<svelte:window on:click={handleClick}/>

<div
  bind:this={self}
  class="card"
  use:popperAction={popperOptions}
>
  {#each times as time}
    {#if !latestTime || !time.isAfter(latestTime, 'hour')}
      <Time on:select {time} {earliestTime} />
    {/if}
  {/each}
</div>

<style>
  .card {
    max-height: 500px;
    overflow-y: scroll;
    z-index: 40;
    border: 1px solid var(--grey-300);
    box-shadow: var(--shadow-small);
  }
</style>