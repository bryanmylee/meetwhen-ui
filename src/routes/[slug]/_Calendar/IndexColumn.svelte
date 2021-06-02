<script lang="ts">
  import { hourStepSize, totalHours } from './state';

  $: lastHour = $totalHours[$totalHours.length - 1].add($hourStepSize, 'hour');
</script>

{#each $totalHours as hour}
  <div class="relative flex items-center justify-center flex-1 transform -translate-y-1/2">
    {#if hour.minute === 0}
      <span class="text-xs text-gray-400">
        {hour.format('ha')}
      </span>
    {/if}
  </div>
{/each}

<div class="absolute bottom-0 flex items-center justify-center w-full">
  {#if lastHour.minute === 0}
    <span class="text-xs text-gray-400">
      {lastHour.format('ha')}
    </span>
  {/if}
</div>
