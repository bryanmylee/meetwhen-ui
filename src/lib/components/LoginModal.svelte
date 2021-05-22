<script lang="ts">
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
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <form class="flex flex-col p-4 space-y-4 card">
      <h1 class="font-bold text-center">Login</h1>
      <Textfield placeholder="Email" />
      <Textfield placeholder="Password" />
      <div class="flex space-x-4">
        <button class="flex-1 p-3 button shade rounded-xl"> Cancel </button>
        <button class="flex-1 p-3 button primary rounded-xl"> Confirm </button>
      </div>
    </form>
  </div>
{/if}
