<script>
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<div class="calendar-dates">
  {#each days as day}
    <span>{day}</span>
  {/each}
</div>

<style>
  .calendar-dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: max-content;
    padding: 0.5rem 0;
  }

  span {
    display: flex;
    justify-content: center;
    color: var(--text-1);
    font-weight: 600;
  }
</style>