<script>
  import { showAuth } from '$lib/app-state';
</script>

<section class="flex space-x-4">
  <button
    type="button"
    on:click={() => ($showAuth = true)}
    class="w-full p-3 button shade rounded-xl"
  >
    Login
  </button>
  <button type="submit" class="w-full p-3 button gradient card"> Continue as Guest </button>
</section>
