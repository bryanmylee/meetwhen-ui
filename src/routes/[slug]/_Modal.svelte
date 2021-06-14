<script>
  import { ModalState, modalState, isJoined } from './_state/page';
  import { username, password } from './_state/form';
  import Textfield from '$lib/components/Textfield.svelte';
  import { session } from '$app/stores';
</script>

<div class="space-y-4">
  {#if $modalState === ModalState.ADD_GUEST}
    <div class="p-4 space-y-4 card">
      <Textfield
        bind:value={$username.value}
        error={$username.error}
        placeholder="Name"
        focusOnMount
        required
        class="block"
      />
      <Textfield
        bind:value={$password.value}
        error={$password.error}
        placeholder="Password"
        password
        required
        class="block"
      />
    </div>
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($modalState = ModalState.NONE)}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
  {:else if $modalState === ModalState.ADD_AUTH || $modalState === ModalState.EDIT_AUTH}
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($modalState = ModalState.NONE)}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
  {:else}
    <div class="flex space-x-4">
      {#if $session.user === null}
        <button
          type="button"
          on:click={() => ($modalState = ModalState.ADD_GUEST)}
          class="w-full p-3 rounded-full button primary"
        >
          Join as Guest
        </button>
      {:else if $isJoined}
        <button
          type="button"
          on:click={() => ($modalState = ModalState.EDIT_AUTH)}
          class="w-full p-3 rounded-full button primary"
        >
          Edit
        </button>
      {:else}
        <button
          type="button"
          on:click={() => ($modalState = ModalState.ADD_AUTH)}
          class="w-full p-3 rounded-full button primary"
        >
          Join
        </button>
      {/if}
    </div>
  {/if}
</div>
