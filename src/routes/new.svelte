<script lang="ts">
  import { getContext } from "svelte";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import { goto } from "@sapper/app";
  dayjs.extend(utc);
  import validate from "@/utils/validator";
  import range from "@/utils/range";
  import { event } from "@/state/event";
  import { colors, primaryBase } from "@/state/colors";
  import Calendar from "@/components/Calendar.svelte";
  import ColorPicker from "@/components/ColorPicker.svelte";
  import Select from "@/components/Select.svelte";
  import Toast from "@/components/Toast.svelte";
  import type { Dayjs } from "dayjs";
  import type Event from "@/models/Event";
  import type Interval from "@/models/Interval";
  import type {
    IColorIndex,
    INewEventName,
    IGetCrossfade,
  } from "./_layout.svelte";
  import type { Validator } from "@/utils/validator";

  const newEventName = getContext<INewEventName>("newEventName");

  const colorIndex = getContext<IColorIndex>("colorIndex");
  $: color = colors[$colorIndex];

  let selectedDates: Dayjs[] = [dayjs().startOf("day")];

  const times = range(0, 25).map((h) => dayjs().startOf("day").add(h, "hour"));
  const displayedTimes = times.map((t) => t.format("ha"));
  let fromIndex = 9;
  let toIndex = 17;
  $: if (fromIndex >= toIndex) {
    if (fromIndex === 24) {
      fromIndex = 23;
    }
    toIndex = fromIndex + 1;
  }
  $: fromTime = times[fromIndex];
  $: toTime = times[toIndex];

  const sign = (n: number) => (n >= 0 ? "+" : "-");
  const padded = (n: number) => `${Math.abs(n)}`.padStart(2, "0");
  const EARLIEST_OFFSET = -12;
  const utcOffsets = range(EARLIEST_OFFSET, 15);
  const displayedUtcOffsets = utcOffsets.map((z) => `${sign(z)}${padded(z)}`);
  const currentUtcOffset = Math.floor(dayjs().utcOffset() / 60);
  let utcOffsetIndex = currentUtcOffset - EARLIEST_OFFSET;
  $: utcOffset = utcOffsets[utcOffsetIndex];

  let schedule: Interval[];
  $: schedule = selectedDates.map((date) => {
    const dayDiff = date.diff(dayjs().startOf("day"), "day");
    return {
      from: fromTime.add(dayDiff, "day").utcOffset(utcOffset),
      to: toTime.add(dayDiff, "day").utcOffset(utcOffset),
    };
  });

  let newEvent: Omit<Event, "eventUrl">;
  $: newEvent = {
    color,
    name: $newEventName,
    schedule,
    users: {},
  };
  const newEventValidator: Validator<typeof newEvent> = {
    color: null,
    name: (name: string) =>
      name.length <= 0 ? "Event name cannot be empty" : null,
    schedule: (schedule: Interval[]) =>
      schedule.length <= 0 ? "Pick at least one date" : null,
    users: null,
  };
  $: validation = validate(newEvent, newEventValidator);

  let errorMessage = "";
  function submit() {
    if (validation.schedule != null) {
      errorMessage = validation.schedule as string;
      return;
    }
    if (validation.name != null) {
      errorMessage = validation.name as string;
      return;
    }
    event.post(newEvent);
    goto("/event");
    $newEventName = "";
  }

  const getCrossfade = getContext<IGetCrossfade>("getCrossfade");
  const [send, receive] = getCrossfade();
</script>

<svelte:head>
  <title>meetwhen.io ✏️ new event</title>
</svelte:head>

<div class="max-w-lg p-6 pt-20 mx-auto space-y-4">
  <div class="flex flex-col p-4 card space-y-4">
    <div class="flex flex-col space-y-4">
      <h2 in:receive="{{ key: 'h2' }}" out:send="{{ key: 'h2' }}">
        New event name
      </h2>
      <input
        type="text"
        bind:value="{$newEventName}"
        placeholder="..."
        in:receive="{{ key: 'input' }}"
        out:send="{{ key: 'input' }}"
        class="flex-1 textfield"
      />
    </div>

    <div>
      <h2>Pick a theme</h2>
      <ColorPicker
        bind:index="{$colorIndex}"
        bind:color="{$primaryBase}"
        colors="{colors}"
      />
    </div>

    <div class="space-y-4">
      <h2>Set a time for everyone</h2>
      <Calendar bind:selectedDates />
      <div class="flex items-center space-x-4">
        <span>From</span>
        <Select
          bind:index="{fromIndex}"
          options="{displayedTimes}"
          class="flex-1 select"
        />
        <span>To</span>
        <Select
          bind:index="{toIndex}"
          options="{displayedTimes}"
          class="flex-1 select"
        />
        <Select bind:index="{utcOffsetIndex}" options="{displayedUtcOffsets}" />
      </div>
    </div>
  </div>

  <button on:click="{submit}" class="w-full p-3 card button gradient">
    Create Event
  </button>
</div>

<Toast
  bind:message="{errorMessage}"
  class="p-3 mt-4 text-sm font-bold text-white bg-red-400 rounded-xl"
/>
