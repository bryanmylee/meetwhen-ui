<script>
  import dayjs from 'dayjs';

  import { TimeInput } from 'src/components/form';

  // BINDINGS
  // ========
  export let startTime;
  export let endTime;
</script>

<div class="time-bar">
  <TimeInput
    bind:selectedTime={startTime}
    label="From"
    style="margin-right: 1rem"
    latestTime={dayjs().hour(23).minute(0)}
  />
  <TimeInput
    bind:selectedTime={endTime}
    label="To"
    earliestTime={startTime && startTime.add(1, 'hour')}
  />
</div>

  <style>
    .time-bar {
      padding-top: 0.8rem;
      display: flex;
      flex-flow: row nowrap;
    }
  </style>