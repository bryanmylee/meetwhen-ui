<script lang="ts">
  import dayjs from 'dayjs';
  import type { Dayjs } from 'dayjs';
  import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';
  import { getDatePickerState, toId, fromId } from './state';
  import { hasNeighbours } from './has-neighbours';
  import MonthPicker from './MonthPicker.svelte';
  import DateItem from './DateItem.svelte';

  const { month, weekDays, monthDates, disabledDates } = getDatePickerState();

  export let selectedDates: Dayjs[] = [];
  let selectedIds: string[] = selectedDates.map(toId);
  $: selectedDates = selectedIds.map(fromId);

  // -1 as the blurred state.
  let focusedIndex = -1;
  $: focusedDateId = toId($monthDates[focusedIndex]);

  const focus = () => {
    if (focusedIndex !== -1) {
      return;
    }
    focusedIndex = $month.isSame(dayjs(), 'month') ? dayjs().date() - 1 : 0;
  };

  const blur = () => {
    focusedIndex = -1;
  };

  const keydown = (event: KeyboardEvent) => {
    const { key } = event;
    if (Object.keys(ACTIONS).includes(key)) {
      ACTIONS[key]();
      event.preventDefault();
    }
  };

  const ACTIONS = {
    ArrowRight: () => {
      focusedIndex++;
      incrementMonthIfOverflow();
    },
    ArrowDown: () => {
      focusedIndex += 7;
      incrementMonthIfOverflow();
    },
    ArrowLeft: () => {
      if ($month.isSame(dayjs(), 'month') && focusedIndex - 1 < 0) {
        return;
      }
      focusedIndex--;
      decrementMonthIfUnderflow();
    },
    ArrowUp: () => {
      if ($month.isSame(dayjs(), 'month') && focusedIndex - 7 < 0) {
        return;
      }
      focusedIndex -= 7;
      decrementMonthIfUnderflow();
    },
    Enter: () => selector?.toggle(focusedDateId),
    ' ': () => selector?.toggle(focusedDateId),
  };

  const incrementMonthIfOverflow = () => {
    if (focusedIndex >= $month.daysInMonth()) {
      focusedIndex -= $month.daysInMonth();
      $month = $month.add(1, 'month');
    }
  };

  const decrementMonthIfUnderflow = () => {
    if (focusedIndex < 0) {
      $month = $month.subtract(1, 'month');
      focusedIndex += $month.daysInMonth();
    }
  };

  let selector: SelectableProvider;

  const toggle = ({ detail }: CustomEvent) => {
    focusedIndex = $monthDates.findIndex((date) => toId(date) === detail.id);
  };
</script>

<div class="p-4 bg-gray-100 rounded-xl focusable">
  <MonthPicker bind:month={$month} />

  <SelectableProvider
    bind:this={selector}
    on:toggle={toggle}
    bind:selectedIds
    disabledIds={$disabledDates.map(toId)}
    let:selecting
    let:isDisabled
  >
    <div
      tabindex="0"
      on:focus={focus}
      on:blur={blur}
      on:keydown={keydown}
      class="relative z-0 grid grid-cols-7 focus:outline-none"
    >
      {#each $monthDates as date, index (toId(date))}
        <DateItem
          {date}
          selected={selectedDates.map(toId).includes(toId(date))}
          {selecting}
          neighbours={hasNeighbours(date, selectedDates)}
          disabled={isDisabled(toId(date))}
          focused={focusedIndex === index}
        />
      {/each}
    </div>
  </SelectableProvider>
</div>
