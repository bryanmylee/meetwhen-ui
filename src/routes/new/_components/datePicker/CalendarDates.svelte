<script>
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<div class="calendar-dates">
  {#each days as day}
    <h4>{day}</h4>
  {/each}
</div>

<style>
  .calendar-dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: max-content;
    padding: 0.5em 0;
  }

  h4 {
    display: flex;
    justify-content: center;
    color: var(--text-800);
  }
</style>