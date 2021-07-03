<script lang="ts">
  import { classes } from '$lib/utils/classes';
  import Tooltip from '$lib/components/Tooltip.svelte';

  export let isGuestAuth = false;

  const getButtonClass = (active: boolean) =>
    classes([
      'w-full p-2 font-bold',
      active
        ? 'z-10 underline'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600',
      'focus:ring-[3px] ring-primary-lighter',
    ]);
</script>

<div class="flex">
  <Tooltip class="w-full">
    <button
      slot="reference"
      type="button"
      on:click={() => (isGuestAuth = false)}
      disabled={!isGuestAuth}
      class="rounded-tl-xl {getButtonClass(!isGuestAuth)}"
    >
      Plus
    </button>
  </Tooltip>
  <Tooltip class="w-full">
    <button
      slot="reference"
      type="button"
      on:click={() => (isGuestAuth = true)}
      disabled={isGuestAuth}
      class="rounded-tr-xl {getButtonClass(isGuestAuth)}"
    >
      Guest
    </button>
  </Tooltip>
</div>
