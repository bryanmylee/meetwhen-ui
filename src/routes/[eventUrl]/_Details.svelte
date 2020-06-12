<script>
  import { fly } from 'svelte/transition';

  import paginatedCard from '@/actions/paginatedCard.js';
  import { layoutStates, titleStates } from './_pageStates.js';

  import EventDetails from './_EventDetails.svelte';
  import WhosAttending from './_WhosAttending.svelte';

  // PROPS
  // =====
  export let titleState;
  export let layoutState;
  export let event;

  let card;
</script>

{#if layoutState === layoutStates.NARROW}
  <div class="paging__container" use:paginatedCard={{card}}>
    {#if titleState === titleStates.EVENT_DETAILS}
      <div
        bind:this={card}
        in:fly={{x: -400, delay: 200, duration: 200}}
        out:fly={{x: -400, duration: 200}}
      >
        <EventDetails title={event.title} description={event.description} />
      </div>
    {:else if titleState === titleStates.WHOS_ATTENDING}
      <div
        bind:this={card}
        in:fly={{x: 400, delay: 200, duration: 200}}
        out:fly={{x: 400, duration: 200}}
      >
        <WhosAttending {event} />
      </div>
    {/if}
  </div>
{:else if layoutState === layoutStates.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <WhosAttending {event} />
{/if}

<style>
  .paging__container {
    position: relative;
    transition: height 200ms ease-out;
  }
</style>