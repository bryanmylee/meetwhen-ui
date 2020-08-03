<script>
  import { cardIn, cardOut } from 'src/transitions/paginatedCard';
  import { layoutEnum, layout } from 'src/stores';
  import { detailsEnum, details } from '../stores';

  import EventDetails from './EventDetails.svelte';
  import FilterCard from './filterCard/FilterCard.svelte';

  // PROPS
  // =====
  export let event;
</script>

{#if $layout === layoutEnum.NARROW}
  {#if $details === detailsEnum.EVENT_DETAILS}
    <div
      in:cardIn={{ duration: 300, left: true }}
      out:cardOut={{ duration: 300, left: true }}
    >
      <EventDetails title={event.title} description={event.description} />
    </div>
  {:else if $details === detailsEnum.ATTENDANCE}
    <div
      in:cardIn={{ duration: 300, left: false }}
      out:cardOut={{ duration: 300, left: false }}
    >
      <FilterCard usernames={Object.keys(event.userSchedules)} />
    </div>
  {/if}
{:else if $layout === layoutEnum.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <FilterCard usernames={Object.keys(event.userSchedules)} />
{/if}