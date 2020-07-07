<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import dayjs from 'dayjs';
  import { popper } from 'src/actions/popper.js';

  import Time from './Time.svelte';

  // PROPS
  // =====
  export let targetNode;
  export let earliestTime;
  export let latestTime;

  // STATE
  // =====
  const targetWidth = parseFloat(getComputedStyle(targetNode).width);
  const times = [...Array(25)].map((_, inc) => dayjs().hour(inc).minute(0))

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
  use:popper={{
    targetNode,
    popperOptions: {
      placement: 'left',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -targetWidth]
          }
        }
      ]
    }
  }}
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
  }
</style>