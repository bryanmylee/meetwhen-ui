<script lang="ts">
  import { classes } from '$lib/utils/classes';
  import { getLoadingContext } from '$lib/components/Loading';

  export let isGuestAuth = false;
  export let enableGuestAuth = false;

  const isLoading = getLoadingContext();

  const getButtonClass = (active: boolean, loading: boolean) =>
    classes([
      'w-full p-2 py-4 font-bold focus:ring ring-primary-lighter',
      active ? 'z-10 underline' : 'bg-gray-200 dark:bg-gray-700',
      !active && !loading ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : 'cursor-default',
    ]);
</script>

<div class="flex">
  <button
    type="button"
    aria-label="Use full account"
    on:click={() => (isGuestAuth = false)}
    disabled={!isGuestAuth || $isLoading}
    class="rounded-tl-xl {getButtonClass(!isGuestAuth, $isLoading)}"
  >
    Log In / Sign Up
  </button>
  {#if enableGuestAuth}
    <button
      type="button"
      aria-label="Use guest account"
      on:click={() => (isGuestAuth = true)}
      disabled={isGuestAuth || $isLoading}
      class="rounded-tr-xl {getButtonClass(isGuestAuth, $isLoading)}"
    >
      Guest
    </button>
  {/if}
</div>
