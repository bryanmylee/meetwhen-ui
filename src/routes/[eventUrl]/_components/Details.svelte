<script>
  import { fly } from 'svelte/transition';

  import { cardIn, cardOut } from '@/transitions/paginatedCard.js';
  import {
    detailsStates, formStates, layoutStates,
    detailsState, formState, layoutState, selectedUsernames
  } from '../stores.js';

  import EventDetails from './EventDetails.svelte';
  import Attendance from './Attendance.svelte';

  export let event;

  let card;
</script>

{#if $layoutState === layoutStates.NARROW}
  <div class="paging__container">
    {#if $detailsState === detailsStates.EVENT_DETAILS}
      <div
        bind:this={card}
        in:cardIn={{x: -400, duration: 300}}
        out:cardOut={{x: -400, duration: 300}}
      >
        <EventDetails title={event.title} description={event.description} />
      </div>
    {:else if $detailsState === detailsStates.ATTENDANCE}
      <div
        bind:this={card}
        in:cardIn={{x: 400, duration: 300}}
        out:cardOut={{x: 400, duration: 300}}
      >
        <Attendance usernames={Object.keys(event.userIntervalsByUsername)} />
      </div>
    {/if}
  </div>
{:else if $layoutState === layoutStates.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <Attendance usernames={Object.keys(event.userIntervalsByUsername)} />
{/if}

<style>
  .paging__container {
    transition: height 200ms ease-out;
  }
</style>