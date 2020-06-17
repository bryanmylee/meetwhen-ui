<script>
  import { cardIn, cardOut } from 'src/transitions/paginatedCard.js';
  import {
    layoutEnum, detailsEnum,
    layout, details,
  } from '../stores.js';

  import EventDetails from './EventDetails.svelte';
  import Attendance from './Attendance.svelte';

  // PROPS
  // =====
  export let event;
</script>

{#if $layout === layoutEnum.NARROW}
  <div>
    {#if $details === detailsEnum.EVENT_DETAILS}
      <div
        in:cardIn={{x: -400, duration: 300}}
        out:cardOut={{x: -400, duration: 300}}
      >
        <EventDetails title={event.title} description={event.description} />
      </div>
    {:else if $details === detailsEnum.ATTENDANCE}
      <div
        in:cardIn={{x: 400, duration: 300}}
        out:cardOut={{x: 400, duration: 300}}
      >
        <Attendance usernames={Object.keys(event.userIntervalsByUsername)} />
      </div>
    {/if}
  </div>
{:else if $layout === layoutEnum.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <Attendance usernames={Object.keys(event.userIntervalsByUsername)} />
{/if}