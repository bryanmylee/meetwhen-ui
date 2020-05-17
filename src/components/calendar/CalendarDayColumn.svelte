<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import CalendarGridCell from './CalendarGridCell.svelte';

  export let day = null;
  export let hours = [];
</script>

<div class="no-highlight">
  {#if day != null}
    <div id="date-label">
      {day.format('ddd D')}
    </div>
    <div id="select-area">
      {#each hours as hour}
        <CalendarGridCell start={day.hour(hour.hour())}
          on:startSelection
          on:gridDrag
          on:stopSelection
        />
      {/each}
      <!-- Slot for selections -->
      <slot />
    </div>
  {/if}
</div>

<style>
  #date-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: var(--header-row-height);
    box-sizing: border-box;
    border-bottom: 1px var(--line-1) solid;
    background-color: white;
  }

  #select-area {
    position: relative;
    user-select: none;
  }
</style>