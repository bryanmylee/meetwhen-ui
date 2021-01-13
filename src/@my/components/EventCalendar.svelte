<script lang="ts">
  import { setContext, tick } from 'svelte';
  import { writable } from 'svelte/store';
  import dayjs from 'dayjs';
  import { equals } from '@my/utils/array';
  import flat from '@my/utils/flat';
  import range from '@my/utils/range';
  import {
    extendedTaggedDays,
    getDays,
    getHours,
    getScheduleFromHalfHours,
    getTimeTaggedDays,
    getUserTaggedDays,
    getUserTaggedIntervals
  } from '@my/utils/eventCalendar';
  import EventCalendarColumn from '@my/components/EventCalendarColumn.svelte';
  import EventCalendarIndex from '@my/components/EventCalendarIndex.svelte';
  import SelectableProvider from '@my/components/SelectableProvider.svelte';
  import type Interval from '@my/models/Interval';
  import type { SelectableProviderEvent } from '@my/components/SelectableProvider.svelte';

  export { className as class };
  let className = '';

  export let schedule: Interval[] = [];
  $: days = getDays(schedule);
  $: dayIds = days.map(d => d.format('YYYYMMDD'));
  $: hours = getHours(schedule);
  $: hourIds = hours.map(h => h.format('HHmm'));
  $: halfHours = flat(hours.map(h => [h, h.add(30, 'minute')]));
  $: halfHourIds = halfHours.map(h => h.format('HHmm'));
  $: displayedMonth = days[0]?.format('MMM') ?? ' ';

  export let users: Record<string, Interval[]> = {};
  $: userTaggedIntervals = getUserTaggedIntervals(users);
  $: maxPerInterval = Math.max(...userTaggedIntervals.map(interval => interval.users.length));

  export let selectedSchedule: Interval[] = [];
  let selectedIds: string[] = [];
  $: selectedHalfHours = selectedIds.map(id => dayjs(id, 'YYYYMMDDHHmm'));
  $: selectedSchedule = getScheduleFromHalfHours(selectedHalfHours);
  $: selectedSchedule && scheduleToIds();

  function scheduleToIds() {
    const newIds = flat(selectedSchedule.map(({ from, to }) => {
      const halfHourDiff = to.diff(from, 'minute') / 30;
      return range(0, halfHourDiff)
          .map(i => i * 30)
          .map(min => from.add(min, 'minute'))
          .map(d => d.format('YYYYMMDDHHmm'));
    }));
    if (!equals(selectedIds, newIds)) {
      tick().then(() => {
        selectedIds = newIds;
      });
    }
  }

  $: baseTaggedDays = days.map(day => ({ day }));
  $: userTaggedDays = getUserTaggedDays(users);
  $: userTaggedIntervalTaggedDays = userTaggedDays.map(({ day, dayUsers }) => ({
    day,
    userTaggedIntervals: getUserTaggedIntervals(dayUsers),
  }));
  $: selectedTaggedDays = getTimeTaggedDays(selectedHalfHours);
  $: taggedDays = extendedTaggedDays(extendedTaggedDays(baseTaggedDays, userTaggedIntervalTaggedDays), selectedTaggedDays);
  const allUsers = writable([]);
  $: $allUsers = Object.keys(users);
  setContext('allUsers', { subscribe: allUsers.subscribe });

  export let editable = false;
  let calendarElement: HTMLElement;
  $: if (editable) {
    calendarElement.focus();
    focus();
  }

  let selectFocusX = -1;
  let selectFocusY = -1;
  $: selectFocusId = selectFocusX === -1 || selectFocusY === -1 ? -1 : dayIds[selectFocusX] + halfHourIds[selectFocusY];
  function onSelectFocus() {
    if (selectFocusX !== -1 || selectFocusY !== -1) return;
    selectFocusX = 0;
    selectFocusY = 0;
  }

  function onSelectBlur() {
    selectFocusX = -1;
    selectFocusY = -1;
  }

  function onSelectKeydown(event: KeyboardEvent) {
    if (!editable) return;
    const { key } = event;
    if (Object.keys(onSelectActions).includes(key)) {
      onSelectActions[key]();
      event.preventDefault();
    }
    if (selectFocusX < 0) {
      selectFocusX = 0;
    } else if (selectFocusX >= dayIds.length) {
      selectFocusX = dayIds.length - 1;
    }
    if (selectFocusY < 0) {
      selectFocusY = 0;
    } else if (selectFocusY >= halfHourIds.length) {
      selectFocusY = halfHourIds.length - 1;
    }
  }

  let selector: SelectableProvider;
  const onSelectActions = {
    ArrowRight: () => {
      if (selectFocusX < dayIds.length - 1) selectFocusX++;
    },
    ArrowLeft: () => {
      if (selectFocusX > 0) selectFocusX--;
    },
    ArrowUp: () => {
      if (selectFocusY > 0) selectFocusY--;
    },
    ArrowDown: () => {
      if (selectFocusY < halfHourIds.length - 1) selectFocusY++;
    },
    ' ': () => {
      if (selectFocusId === -1) return;
      selector?.toggle(selectFocusId as string);
    },
    get Enter() { return this[' '] },
  };

  function toggle(event: CustomEvent<SelectableProviderEvent['toggle']>) {
    // YYYYMMDDHHmm
    const { id } = event.detail;
    selectFocusX = dayIds.indexOf(id.slice(0, 8));
    selectFocusY = halfHourIds.indexOf(id.slice(8, 12));
  }

  let userFocusX = -1;
  let userFocusY = -1;
  function onUserFocus() {
    if (userFocusX !== -1 || userFocusY !== -1) return;
    userFocusX = 0;
    userFocusY = 0;
  }

  function onUserBlur() {
    userFocusX = -1;
    userFocusY = -1;
  }

  function onUserKeydown(event: KeyboardEvent) {
    const { key } = event;
    if (Object.keys(onSelectActions).includes(key)) {
      onUserActions[key]();
      event.preventDefault();
    }
    if (userFocusX < 0) {
      userFocusX = 0;
    } else if (userFocusX >= dayIds.length) {
      userFocusX = dayIds.length - 1;
    }
    if (userFocusY < 0) {
      userFocusY = 0;
    } else if (userFocusY >= halfHourIds.length) {
      userFocusY = halfHourIds.length - 1;
    }
  }

  let hasUserInDay: boolean[] = [];
  $: hasUserInDay = getHasUserInDay(taggedDays);
  function getHasUserInDay(tagged: typeof taggedDays) {
    // Cannot use map or forEach due to type erasure.
    const usersPerDay = [];
    for (let i = 0; i < tagged.length; i++) {
      usersPerDay.push(taggedDays[i].userTaggedIntervals?.length ?? 0);
    }
    return usersPerDay.map(n => n > 0);
  }

  const onUserActions = {
    ArrowRight: () => {
      if (userFocusX >= taggedDays.length - 1) return;
      const newX = hasUserInDay.indexOf(true, userFocusX + 1);
      if (newX !== -1) {
        userFocusX = newX;
      }
      const { length } = taggedDays[userFocusX].userTaggedIntervals;
      userFocusY = Math.min(userFocusY, length - 1);
    },
    ArrowLeft: () => {
      if (userFocusX <= 0) return;
      const newX = hasUserInDay.lastIndexOf(true, userFocusX - 1);
      if (newX !== -1) {
        userFocusX = newX;
      }
      const { length } = taggedDays[userFocusX].userTaggedIntervals;
      userFocusY = Math.min(userFocusY, length - 1);
    },
    ArrowUp: () => {
      if (userFocusY > 0) userFocusY--;
    },
    ArrowDown: () => {
      const { length } = taggedDays[userFocusX].userTaggedIntervals;
      if (userFocusY < length - 1) userFocusY++;
    },
  };

</script>

<div
  tabindex=0
  on:focus={onUserFocus}
  on:blur={onUserBlur}
  on:keydown={onUserKeydown}
  class="focus:outline-none"
/>

<div class={className}>
  <SelectableProvider
    bind:this={selector}
    on:toggle={toggle}
    bind:selectedIds
    disabled={!editable}
    let:selecting
    >

    <div
      bind:this={calendarElement}
      tabindex={editable ? 0 : -1}
      on:focus={onSelectFocus}
      on:blur={onSelectBlur}
      on:keydown={onSelectKeydown}
      class="relative overflow-hidden focus:outline-none h-full min-h-0"
      >

      <div class="overflow-auto scrollbar-none h-full">
        <div class="relative z-0 flex min-w-full min-h-full w-fit h-fit space-x-2">
          <EventCalendarIndex {hours}/>
          {#each taggedDays as { day, userTaggedIntervals, dayTimes }, i}
            <EventCalendarColumn
              {editable}
              {day}
              {hours}
              userTaggedIntervals={userTaggedIntervals || []}
              {maxPerInterval}
              selectedHours={dayTimes || []}
              {selecting}
              selectFocused={editable && selectFocusX === i}
              {selectFocusY}
              userFocused={userFocusX === i}
              {userFocusY}
            />
          {/each}
        </div>
      </div>

      <div class="absolute top-0 left-0 flex items-center justify-center bg-white h-14 min-w-16">
        <span class="text-xl font-bold">
          {displayedMonth}
        </span>
      </div>

    </div>
  </SelectableProvider>
</div>

