<script>
  import dayjs from 'dayjs';

  let selectedDates = [
    {
      date: '2020-05-09',
      intervals: [
        { start: '08:00:00', end: '09:00:00' },
        { start: '12:00:00', end: '14:00:00' },
      ],
    },
    {
      date: '2020-05-09',
      intervals: [
        { start: '08:00:00', end: '09:00:00' },
        { start: '12:00:00', end: '14:00:00' },
      ],
    },
  ];
  const today = dayjs();
  const midnight = dayjs().startOf('day');
  let numDays = 60;
  $: dates = Array.from(Array(numDays).keys()).map((inc) => today.add(inc, 'day'));
  $: times = Array.from(Array(24).keys()).map((inc) => midnight.add(inc, 'hour'));
</script>

<div class="schedule-picker">
  <!-- Generate a column of times -->
  <div class="schedule__col__time">
    <div class="schedule__header">Times</div>
    {#each times as time}
      <div class="schedule__time-cell">{time.format('HH:mm')}</div>
    {/each}
  </div>
  <!-- Generate the horizontally scrollable pane on the right -->
  <div class="schedule__scroll-horizontal">
    {#each dates as date}
      <div class="schedule__col">
        <div class="schedule__header">
          {date.format('D')}
        </div>
        {#each times as time}
          <div class="schedule__cell">
            <div class="schedule__sub-cell" on:mousedown={() => console.log(1)}></div>
            <div class="schedule__sub-cell" on:mousedown={() => console.log(2)}></div>
            <div class="schedule__sub-cell" on:mousedown={() => console.log(3)}></div>
            <div class="schedule__sub-cell" on:mousedown={() => console.log(4)}></div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .schedule-picker {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: stretch;
    width: auto;
    border: 1px red solid;
  }

  .schedule__scroll-horizontal {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: stretch;
    overflow: scroll;
    width: auto;
    border: 1px red solid;
  }

  .schedule__col__time {
    display: flex;
    flex-direction: column;
    min-width: 4rem;
    border: 1px purple solid;
  }

  .schedule__col {
    display: flex;
    flex-direction: column;
    min-width: 6rem;
    border: 1px pink solid;
  }

  .schedule__header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 0.5rem;
    border: 1px green solid;
  }

  .schedule__cell {
    min-height: 2rem;
    border: 1px cyan solid;
  }

  .schedule__sub-cell {
    min-height: 0.5rem;
  }

  .schedule__time-cell {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 2rem;
    border: 1px blue solid;
  }
</style>