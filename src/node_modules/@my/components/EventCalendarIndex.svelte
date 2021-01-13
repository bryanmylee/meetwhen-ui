<script lang="ts">
  import type { Dayjs } from 'dayjs';

  export let hours: Dayjs[];
</script>

<div class="sticky left-0 z-10 flex flex-col bg-white min-w-16">
  {#each hours as h}
    <div class="flex items-center justify-center flex-1 transform -translate-y-1/2 first:mt-16">
      <span class="text-xs text-gray-400">
        {h.format('ha')}
      </span>
    </div>
  {/each}
</div>

