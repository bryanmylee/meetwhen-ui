<script>
  import { isLoggedIn, showAuth } from '$lib/app-state';
  $: label = $isLoggedIn ? 'Continue' : 'Continue as Guest';
</script>

<section class="flex space-x-4">
  {#if !$isLoggedIn}
    <button
      type="button"
      on:click={() => ($showAuth = true)}
      class="w-full p-3 button shade rounded-xl"
    >
      Login
    </button>
  {/if}
  <button type="submit" class="w-full p-3 button gradient card">{label}</button>
</section>
