<script lang="ts">
  import { classes } from '$lib/utils/classes';

  export let isGuestAuth = false;
  export let enableGuestAuth = false;

  const getButtonClass = (active: boolean) =>
    classes([
      'w-full p-2 py-4 font-bold',
      active
        ? 'z-10 underline'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600',
      'focus:ring-[3px] ring-primary-lighter',
    ]);
</script>

<div class="flex">
  <button
    type="button"
    aria-label="Use plus account"
    on:click={() => (isGuestAuth = false)}
    disabled={!isGuestAuth}
    class="rounded-tl-xl {getButtonClass(!isGuestAuth)}"
  >
    Plus
  </button>
  {#if enableGuestAuth}
    <button
      type="button"
      aria-label="Use guest account"
      on:click={() => (isGuestAuth = true)}
      disabled={isGuestAuth}
      class="rounded-tr-xl {getButtonClass(isGuestAuth)}"
    >
      Guest
    </button>
  {/if}
</div>
