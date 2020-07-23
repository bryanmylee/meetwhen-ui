<script>
  import { createEventDispatcher } from 'svelte';
  import dayjs from 'dayjs';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  export let date;
  export let selected = false;

  // STATE
  // =====
  const firstDayOfWeek = date.date() === 1 ? date.day() : null;
  const isPast = date.isBefore(dayjs(), 'day');

  // STATE FUNCTIONS
  // ===============
  function handleDragStart() {
    if (isPast) return;
    dispatch('dragStart', { date, selecting: !selected });
  }

  function handleDragEnter(event) {
    if (event.buttons !== 1 || isPast) return;
    dispatch('dragMove', { date });
  }

  function handleDragStop() {
    dispatch('dragStop');
  }
</script>

<div
  style={firstDayOfWeek == null ? '' : `grid-column-start: ${firstDayOfWeek + 1}`}
  class:past={isPast}
  class:today={date.isSame(dayjs(), 'day')}
  class:selected={selected}
  on:mousedown={handleDragStart}
  on:mouseenter={handleDragEnter}
  on:mouseup={handleDragStop}
>
  <span>{date.date()}</span>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0.2rem 0;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 500px;
    min-height: 2.5rem;
    min-width: 2.5rem;
    max-height: 2.5rem;
    max-width: 2.5rem;
    color: var(--text-0);
  }

  span:hover {
    background-color: var(--background-1);
  }

  div.today > span {
    color: var(--primary-1);
    border: 1px var(--primary-1) solid;
  }

  div.past {
    cursor: unset;
  }

  div.past > span {
    color: var(--text-3);
  }

  div.past > span:hover {
    background-color: unset;
  }


  div.selected > span {
    color: white;
    background-color: var(--primary-1);
  }
</style>