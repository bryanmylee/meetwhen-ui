<script>
  import { fly } from 'svelte/transition';

  import { cardIn, cardOut } from '@/transitions/paginatedCard.js';
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
  <div class="paging__container">
    {#if titleState === titleStates.EVENT_DETAILS}
      <div
        bind:this={card}
        in:cardIn={{x: -400, duration: 300}}
        out:cardOut={{x: -400, duration: 300}}
      >
        <EventDetails title={event.title} description={event.description} />
      </div>
    {:else if titleState === titleStates.WHOS_ATTENDING}
      <div
        bind:this={card}
        in:cardIn={{x: 400, duration: 300}}
        out:cardOut={{x: 400, duration: 300}}
      >
        <WhosAttending usernames={Object.keys(event.userIntervalsByUsername)} />
      </div>
    {/if}
  </div>
{:else if layoutState === layoutStates.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <WhosAttending usernames={Object.keys(event.userIntervalsByUsername)} />
{/if}

<style>
  .paging__container {
    transition: height 200ms ease-out;
  }
</style>