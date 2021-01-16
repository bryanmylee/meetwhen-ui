<script lang="ts">
  import dayjs from 'dayjs';
  import range from '@my/utils/range';
  import { hasLeft, hasRight, hasTop, hasBottom } from '@my/utils/calendar';
  import SelectableProvider from '@my/components/SelectableProvider.svelte';
  import CalendarDate from './CalendarDate.svelte';
  import CalendarMonth from './CalendarMonth.svelte';
  import type { Dayjs } from 'dayjs';
  import type { SelectableProviderEvent } from '@my/components/SelectableProvider.svelte';

  let month = dayjs().startOf('month');
  $: weekDays = range(1, 8)
      .map(day => month.day(day));
  $: monthDates = range(1, month.daysInMonth() + 1)
      .map(d => month.date(d).startOf('day'));
  $: monthDateIds = monthDates.map(d => d.format('YYYYMMDD'));
  $: disabledDateIds = monthDates.filter(d => d.isBefore(dayjs().startOf('day')))
      .map(d => d.format('YYYYMMDD'));

  export let selectedDates: Dayjs[] = [];
  let selectedIds: string[] = [];
  $: selectedDates = selectedIds.map(date => dayjs(date, 'YYYYMMDD'));
  selectedIds = selectedDates.map(date => date.format('YYYYMMDD'));

  let focusedIndex = -1;
  $: focusedId = monthDateIds[focusedIndex];
  function focus() {
    if (focusedIndex !== -1) return;
    if (month.isSame(dayjs(), 'month')) {
      focusedIndex = dayjs().date() - 1;
    } else {
      focusedIndex = 0;
    }
  }

  function blur() {
    focusedIndex = -1;
  }

  function keydown(event: KeyboardEvent) {
    const { key } = event;
    if (Object.keys(actions).includes(key)) {
      actions[key]();
      event.preventDefault();
    }
    if (focusedIndex < 0) {
      month = month.subtract(1, 'month');
      focusedIndex = focusedIndex + month.daysInMonth();
    } else if (focusedIndex >= month.daysInMonth()) {
      focusedIndex = focusedIndex - month.daysInMonth();
      month = month.add(1, 'month');
    }
  }

  const actions = {
    ArrowRight: () => focusedIndex++,
    ArrowLeft: () => focusedIndex--,
    ArrowUp: () => focusedIndex -= 7,
    ArrowDown: () => focusedIndex += 7,
    ' ': () => selector?.toggle(focusedId),
    get Enter() { return this[' '] },
  };

  let selector: SelectableProvider;

  function toggle(event: CustomEvent<SelectableProviderEvent['toggle']>) {
    focusedIndex = monthDateIds.indexOf(event.detail.id);
  }
</script>

<div class="p-4 shade focusable">

  <CalendarMonth bind:month/>

  <div class="grid grid-cols-7">
    {#each weekDays as day}
      <div class="p-2 mb-2 font-bold text-center">
        {day.format('ddd')}
      </div>
    {/each}
  </div>

  <SelectableProvider
    bind:this={selector}
    on:toggle={toggle}
    bind:selectedIds
    disabledIds={disabledDateIds}
    let:selecting
    let:isDisabled
    >
    <div
      tabindex=0
      on:focus={focus}
      on:blur={blur}
      on:keydown={keydown}
      class="focus:outline-none relative z-0 grid grid-cols-7"
      >
      {#each monthDates as date, i (date)}
        <CalendarDate
          {date}
          selected={selectedIds.includes(date.format('YYYYMMDD'))}
          {selecting}
          hasLeft={hasLeft(date, selectedDates)}
          hasRight={hasRight(date, selectedDates)}
          hasTop={hasTop(date, selectedDates)}
          hasBottom={hasBottom(date, selectedDates)}
          disabled={isDisabled(date.format('YYYYMMDD'))}
          focused={focusedIndex === i}
        />
      {/each}
    </div>
  </SelectableProvider>

</div>

