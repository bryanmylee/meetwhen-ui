<script>
  import { ModalState, modalState } from './_state/page';
  import { username, password } from './_state/form';
  import Textfield from '$lib/components/Textfield.svelte';
  import { session } from '$app/stores';
</script>

<div class="space-y-4">
  {#if $modalState === ModalState.ADD_GUEST}
    <div class="p-4 space-y-4 card">
      <Textfield bind:value={$username.value} placeholder="Name" focusOnMount class="block" />
      <Textfield bind:value={$password.value} placeholder="Password" password class="block" />
    </div>
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($modalState = ModalState.NONE)}
        class="w-full p-3 button shade rounded-xl"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 button primary rounded-xl"> Confirm </button>
    </div>
  {:else if $modalState === ModalState.ADD_AUTH}
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($modalState = ModalState.NONE)}
        class="w-full p-3 button shade rounded-xl"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 button primary rounded-xl"> Confirm </button>
    </div>
  {:else}
    <div class="flex space-x-4">
      {#if $session.user === null}
        <button
          type="button"
          on:click={() => ($modalState = ModalState.ADD_GUEST)}
          class="w-full p-3 button primary rounded-xl"
        >
          Join as Guest
        </button>
      {:else}
        <button
          type="button"
          on:click={() => ($modalState = ModalState.ADD_AUTH)}
          class="w-full p-3 button primary rounded-xl"
        >
          Join
        </button>
      {/if}
    </div>
  {/if}
</div>
