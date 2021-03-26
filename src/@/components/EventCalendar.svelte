<script lang="ts" context="module">
  import type { Readable } from "svelte/store";

  export type IAllUsers = Readable<string[]>;
</script>

<script lang="ts">
  import { setContext, tick } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import dayjs from "dayjs";
  import { equals } from "@/utils/array";
  import flat from "@/utils/flat";
  import range from "@/utils/range";
  import {
    extendedTaggedDays,
    getDays,
    getHours,
    getScheduleFromHalfHours,
    getTimeTaggedDays,
    getUserTaggedDays,
    getUserTaggedIntervals,
  } from "@/utils/eventCalendar";
  import { MaximizeIcon, MinimizeIcon } from "svelte-feather-icons";
  import EventCalendarColumn from "@/components/EventCalendarColumn.svelte";
  import EventCalendarIndex from "@/components/EventCalendarIndex.svelte";
  import SelectableProvider from "@/components/SelectableProvider.svelte";
  import type Interval from "@/models/Interval";
  import type { EventCalendarUserIntervalEvent } from "@/components/EventCalendarUserInterval.svelte";
  import type { SelectableProviderEvent } from "@/components/SelectableProvider.svelte";

  export { className as class };
  let className = "";

  export let schedule: Interval[] = [];
  $: days = getDays(schedule);
  $: dayIds = days.map((d) => d.format("YYYYMMDD"));
  $: hours = getHours(schedule);
  $: hourIds = hours.map((h) => h.format("HHmm"));
  $: halfHours = flat(hours.map((h) => [h, h.add(30, "minute")]));
  $: halfHourIds = halfHours.map((h) => h.format("HHmm"));
  $: selectableIds = flat(
    dayIds.map((dId) => halfHourIds.map((hId) => dId + hId))
  );

  $: displayedMonth = days[0]?.format("MMM") ?? " ";

  export let users: Record<string, Interval[]> = {};
  $: userTaggedIntervals = getUserTaggedIntervals(users);
  $: maxPerInterval = Math.max(
    ...userTaggedIntervals.map((interval) => interval.users.length)
  );

  export let selectedSchedule: Interval[] = [];
  let selectedIds: string[] = [];
  $: selectedHalfHours = selectedIds.map((id) => dayjs(id, "YYYYMMDDHHmm"));
  $: selectedSchedule = getScheduleFromHalfHours(selectedHalfHours);
  $: selectedSchedule && selectedScheduleToIds();

  function selectedScheduleToIds() {
    const newIds = flat(
      selectedSchedule.map(({ from, to }) => {
        const halfHourDiff = to.diff(from, "minute") / 30;
        return range(0, halfHourDiff)
          .map((i) => i * 30)
          .map((min) => from.add(min, "minute"))
          .map((d) => d.format("YYYYMMDDHHmm"));
      })
    );
    if (!equals(selectedIds, newIds)) {
      tick().then(() => {
        selectedIds = newIds;
      });
    }
  }

  $: baseTaggedDays = days.map((day) => ({ day }));
  $: userTaggedDays = getUserTaggedDays(users);
  $: userTaggedIntervalTaggedDays = userTaggedDays.map(({ day, dayUsers }) => ({
    day,
    userTaggedIntervals: getUserTaggedIntervals(dayUsers),
  }));
  $: selectedTaggedDays = getTimeTaggedDays(selectedHalfHours);
  $: taggedDays = extendedTaggedDays(
    extendedTaggedDays(baseTaggedDays, userTaggedIntervalTaggedDays),
    selectedTaggedDays
  );
  const allUsers = writable([]);
  $: $allUsers = Object.keys(users);
  setContext("allUsers", { subscribe: allUsers.subscribe });

  export let editable = false;
  let calendarElement: HTMLElement;
  $: if (editable) {
    calendarElement.focus();
    focus();
  }

  const PROMPT_DURATION = 3000;
  let showPrompt = false;
  let promptTimer = null;
  $: if (editable) {
    clearTimeout(promptTimer);
    showPrompt = true;
    promptTimer = setTimeout(() => (showPrompt = false), PROMPT_DURATION);
  } else {
    clearTimeout(promptTimer);
    showPrompt = false;
  }

  let selectFocusX = -1;
  let selectFocusY = -1;
  $: selectFocusId =
    selectFocusX === -1 || selectFocusY === -1
      ? -1
      : dayIds[selectFocusX] + halfHourIds[selectFocusY];
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
    " ": () => {
      if (selectFocusId === -1) return;
      selector?.toggle(selectFocusId as string);
    },
    get Enter() {
      return this[" "];
    },
  };

  function toggle(event: CustomEvent<SelectableProviderEvent["toggle"]>) {
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

  function userClick(
    event: CustomEvent<EventCalendarUserIntervalEvent["intervalclick"]>
  ) {
    const { xIndex, yIndex } = event.detail;
    if (xIndex === userFocusX && yIndex === userFocusY) {
      userFocusX = -1;
      userFocusY = -1;
    } else {
      userFocusX = xIndex;
      userFocusY = yIndex;
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
    return usersPerDay.map((n) => n > 0);
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

  export let width: number = null;

  let fullscreen = false;
  let _fullscreen = fullscreen;
  $: setTimeout(() => {
    _fullscreen = fullscreen;
  }, 20);

  $: style = width != null && !fullscreen ? `width: ${width}px` : "";
</script>

<div
  class="{`${className} flex flex-col ${
    fullscreen ? 'fixed inset-4 z-50 !mt-0' : ''
  }`}"
  style="{style}"
>
  <div
    tabindex="0"
    on:focus="{onUserFocus}"
    on:blur="{onUserBlur}"
    on:keydown="{onUserKeydown}"
    class="focus:outline-none"
  ></div>

  <SelectableProvider
    bind:this="{selector}"
    on:toggle="{toggle}"
    bind:selectedIds
    allIds="{selectableIds}"
    disabled="{!editable}"
    let:selecting
  >
    <div
      bind:this="{calendarElement}"
      tabindex="{editable ? 0 : -1}"
      on:focus="{onSelectFocus}"
      on:blur="{onSelectBlur}"
      on:keydown="{onSelectKeydown}"
      class="relative h-full min-h-0 p-4 pt-1 pl-2 overflow-hidden focus:outline-none"
    >
      <div class="h-full overflow-auto scrollbar-none">
        <div
          class="relative z-0 flex min-w-full min-h-full space-x-2 w-fit h-fit"
        >
          <EventCalendarIndex hours="{hours}" />
          {#each taggedDays as { day, userTaggedIntervals, dayTimes }, i}
            <EventCalendarColumn
              on:intervalclick="{userClick}"
              xIndex="{i}"
              editable="{editable}"
              day="{day}"
              hours="{hours}"
              userTaggedIntervals="{userTaggedIntervals || []}"
              maxPerInterval="{maxPerInterval}"
              selectedHours="{dayTimes || []}"
              selecting="{selecting}"
              selectFocused="{editable && selectFocusX === i}"
              selectFocusY="{selectFocusY}"
              userFocused="{userFocusX === i}"
              userFocusY="{userFocusY}"
            />
          {/each}
        </div>
      </div>

      <div
        class="absolute flex items-center justify-center bg-white top-1 left-2 h-14 min-w-16"
      >
        <span class="text-xl font-bold">
          {displayedMonth}
        </span>
      </div>

      <button
        on:click="{() => (fullscreen = !fullscreen)}"
        class="absolute bg-white rounded-full shadow-md right-2 bottom-2 button icon"
      >
        {#if _fullscreen}
          <MinimizeIcon class="p-2.5" />
        {:else}
          <MaximizeIcon class="p-2.5" />
        {/if}
      </button>

      {#if showPrompt}
        <div
          in:fade="{{ duration: 200 }}"
          out:fade="{{ duration: editable ? 400 : 0 }}"
          on:mouseover="{() => (showPrompt = false)}"
          on:touchstart="{() => (showPrompt = false)}"
          class="{`
            absolute inset-0 flex items-center justify-center bg-primary-opacity-60
            ${!showPrompt ? 'pointer-events-none' : ''}
          `}"
        >
          <span class="font-bold text-white">
            Long touch and drag to make a selection
          </span>
        </div>
      {/if}
    </div>
  </SelectableProvider>
</div>
