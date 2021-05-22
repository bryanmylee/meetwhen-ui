<script lang="ts">
  import { fade } from 'svelte/transition';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import Textfield from './Textfield.svelte';

  let showModal = false;

  let className = '';
  export { className as class };
</script>

<button
  on:click={() => (showModal = !showModal)}
  class="{className} px-2 py-1 button primary outline rounded-xl"
>
  Login
</button>

{#if showModal}
  <div
    transition:fade={{ duration: 100 }}
    class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
  >
    <form use:clickOutside={() => (showModal = false)} class="flex flex-col p-4 space-y-4 card">
      <h1 class="font-bold text-center">Login</h1>
      <Textfield placeholder="Email" />
      <Textfield placeholder="Password" password />
      <div class="flex space-x-4">
        <button
          on:click|preventDefault={() => (showModal = false)}
          class="flex-1 p-3 button shade rounded-xl"
        >
          Cancel
        </button>
        <button type="submit" class="flex-1 p-3 button primary rounded-xl">Confirm</button>
      </div>
    </form>
  </div>
{/if}
