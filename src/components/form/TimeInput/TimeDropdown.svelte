<script>
  import dayjs from 'dayjs';
  import { popper } from 'src/actions/popper.js';

  import Time from './Time.svelte';

  // PROPS
  // =====
  export let targetNode;
  export let earliestTime;

  // STATE
  // =====
  const targetWidth = parseFloat(getComputedStyle(targetNode).width);
  const times = [...Array(25)].map((_, inc) => dayjs().hour(inc).minute(0))
</script>

<div
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
    <Time on:select {time} {earliestTime} />
  {/each}
</div>

<style>
  .card {
    max-height: 500px;
    overflow-y: scroll;
  }
</style>