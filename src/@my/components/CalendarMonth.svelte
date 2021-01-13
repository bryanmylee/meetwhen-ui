<script lang="ts">
  import dayjs from 'dayjs';
  import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
  import type { Dayjs } from 'dayjs';

  export let month: Dayjs;
  $: isCurrentMonth = month.isSame(dayjs(), 'M');
  $: isCurrentYear = month.isSame(dayjs(), 'y');

  function increment() {
    month = month.add(1, 'M');
  }

  function decrement() {
    if (isCurrentMonth) return;
    month = month.subtract(1, 'M');
  }

  function keydown(event: KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case 'ArrowRight': increment(); break;
      case 'ArrowLeft': decrement(); break;
    }
  }
</script>

<div
  tabindex=0
  on:keydown={keydown}
  class="flex justify-between rounded-xl focusable">
  <button tabindex=-1 class="rounded-full button icon" on:click={decrement} disabled={isCurrentMonth}>
    <ChevronLeftIcon class="p-2"/>
  </button>
  <span class="p-2 font-bold">
    {month.format(isCurrentYear ? 'MMMM' : 'MMMM YYYY')}
  </span>
  <button tabindex=-1 class="rounded-full button icon" on:click={increment}>
    <ChevronRightIcon class="p-2"/>
  </button>
</div>

