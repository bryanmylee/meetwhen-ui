<script lang="ts">
  import { classes } from '$lib/utils/classes';

  export let isGuestAuth = false;

  const getButtonClass = (active: boolean) =>
    classes([
      'w-full p-2 font-bold',
      active
        ? 'z-10 underline'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600',
    ]);
</script>

<div class="flex">
  <button type="button" on:click={() => (isGuestAuth = false)} class={getButtonClass(!isGuestAuth)}>
    Plus
  </button>
  <button type="button" on:click={() => (isGuestAuth = true)} class={getButtonClass(isGuestAuth)}>
    Guest
  </button>
</div>
