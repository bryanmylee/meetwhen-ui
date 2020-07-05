<script>
  import { cardIn, cardOut } from 'src/transitions/paginatedCard.js';
  import { layoutEnum, layout } from 'src/stores.js';
  import { detailsEnum, details } from '../stores.js';

  import EventDetails from './EventDetails.svelte';
  import Attendance from './Attendance.svelte';

  // PROPS
  // =====
  export let event;
</script>

{#if $layout === layoutEnum.NARROW}
  {#if $details === detailsEnum.EVENT_DETAILS}
    <div
      in:cardIn={{x: -500, duration: 400}}
      out:cardOut={{x: -500, duration: 400}}
    >
      <EventDetails title={event.title} description={event.description} />
    </div>
  {:else if $details === detailsEnum.ATTENDANCE}
    <div
      in:cardIn={{x: 500, duration: 400}}
      out:cardOut={{x: 500, duration: 400}}
    >
      <Attendance usernames={Object.keys(event.userSchedules)} />
    </div>
  {/if}
{:else if $layout === layoutEnum.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <Attendance usernames={Object.keys(event.userSchedules)} />
{/if}