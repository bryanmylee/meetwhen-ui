<script lang="ts">
  import type { Dayjs } from 'dayjs';
  import GridItem from '$lib/components/Grid/GridItem.svelte';

  export let index: number;
  export let day: Dayjs;
</script>

<GridItem
  x={index}
  class="sticky top-0 z-20 flex flex-col items-center justify-center h-16 bg-default"
>
  <p class="font-bold">{day.format('ddd')}</p>
  <p class="text-sm">{day.format('DD MMM')}</p>
</GridItem>
