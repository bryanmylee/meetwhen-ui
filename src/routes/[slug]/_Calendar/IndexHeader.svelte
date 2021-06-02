<script lang="ts">
  import { days } from './state';
</script>

{#each $days as day}
  <div class="flex flex-col items-center justify-center w-full h-16 min-w-32 bg-default">
    <p class="font-bold">{day.format('ddd')}</p>
    <p class="text-sm">{day.format('DD MMM')}</p>
  </div>
{/each}
