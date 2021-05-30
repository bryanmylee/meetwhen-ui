<script lang="ts">
  import type { Dayjs } from 'dayjs';

  export let day: Dayjs;
</script>

<div class="sticky top-0 z-20 flex flex-col items-center justify-center h-16 -mx-2 bg-default">
  <p class="font-bold">{day.format('ddd')}</p>
  <p class="text-sm">{day.format('DD MMM')}</p>
</div>
