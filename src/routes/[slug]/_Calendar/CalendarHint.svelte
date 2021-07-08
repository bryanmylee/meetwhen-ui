<script lang="ts">
  import DelayedHint from '$lib/components/DelayedHint.svelte';
  import Interval from './Interval.svelte';
  import { touchEnabled } from '$lib/app-state';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CalendarState } from './state/core';

  const state = getContext<CalendarState>('state');
  const { allDayHours, hourStepSize, selectedIds } = state;
  const disabled = getContext<Writable<boolean>>('disabled');
  // hours[1] always guaranteed to exist.
  $: selectedHour = $allDayHours[1];
  $: interval = {
    beg: selectedHour,
    end: selectedHour.add($hourStepSize, 'hour'),
  };
</script>

<Interval let:element {interval} class="w-full h-full pointer-events-none">
  <DelayedHint
    show={!$disabled && $selectedIds.length === 0}
    delay={5000}
    referenceElement={element}
  >
    {$touchEnabled ? 'Long press and drag to pick your time' : 'Click and drag to pick your time'}
  </DelayedHint>
</Interval>
