<script lang="ts">
  import { classes } from '$lib/utils/classes';

  export let isGuestAuth = false;

  const getButtonClass = (active: boolean) =>
    classes([
      'w-full rounded-xl p-2 button',
      active
        ? 'underline bg-gray-100 dark:hover:bg-gray-500'
        : 'hover:bg-gray-100 dark:hover:bg-gray-500',
    ]);
</script>

<div class="flex space-x-4">
  <button type="button" on:click={() => (isGuestAuth = false)} class={getButtonClass(!isGuestAuth)}>
    Plus
  </button>
  <button type="button" on:click={() => (isGuestAuth = true)} class={getButtonClass(isGuestAuth)}>
    Guest
  </button>
</div>
