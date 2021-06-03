<script>
  import { showAddGuest } from './_state';
  import { isLoggedIn, showAuth } from '$lib/app-state';
  import Textfield from '$lib/components/Textfield.svelte';

  const handleClick = () => {
    $showAddGuest = true;
  };
</script>

<div class="space-y-4">
  {#if $showAddGuest}
    <div class="p-4 space-y-4 card">
      <Textfield placeholder="Name" class="block" />
      <Textfield placeholder="Password" class="block" />
    </div>
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($showAddGuest = false)}
        class="w-full p-3 button shade rounded-xl"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 button primary rounded-xl"> Confirm </button>
    </div>
  {:else}
    <div class="flex space-x-4">
      {#if !$isLoggedIn}
        <button type="button" on:click={handleClick} class="w-full p-3 button primary rounded-xl">
          Join as Guest
        </button>
      {:else}
        <button type="submit" class="w-full p-3 button primary rounded-xl"> Join </button>
      {/if}
    </div>
  {/if}
</div>
