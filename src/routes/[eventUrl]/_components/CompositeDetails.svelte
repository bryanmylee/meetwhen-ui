<script>
  import { leftRight } from 'src/transitions/leftRightToggle';
  import { layoutEnum, layout } from 'src/stores';
  import { detailsEnum, details } from '../stores';

  import EventDetails from './EventDetails.svelte';
  import FilterCard from './filterCard/FilterCard.svelte';

  const { leftIn, leftOut, rightIn, rightOut } = leftRight({ duration: 400 });

  // PROPS
  // =====
  export let event;
</script>

{#if $layout === layoutEnum.NARROW}
  {#if $details === detailsEnum.EVENT_DETAILS}
    <div id="left"
      in:leftIn
      out:leftOut
    >
      <EventDetails title={event.title} description={event.description} />
    </div>
  {:else if $details === detailsEnum.ATTENDANCE}
    <div id="right"
      in:rightIn
      out:rightOut
    >
      <FilterCard usernames={Object.keys(event.userSchedules)} />
    </div>
  {/if}
{:else if $layout === layoutEnum.WIDE}
  <EventDetails title={event.title} description={event.description} />
  <FilterCard usernames={Object.keys(event.userSchedules)} />
{/if}