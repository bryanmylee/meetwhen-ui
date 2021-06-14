<script lang="ts">
  import { modalState, isJoined } from './_state/page';
  import { username, password } from './_state/form';
  import Textfield from '$lib/components/Textfield.svelte';
  import { session } from '$app/stores';
</script>

<div class="space-y-4">
  {#if $modalState === 'add-guest'}
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
        on:click={() => ($modalState = 'none')}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
  {:else if ['add-auth', 'edit-auth'].includes($modalState)}
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($modalState = 'none')}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
  {:else}
    <div class="flex space-x-4">
      {#if $session.user === null && $session.guestUser === null}
        <button
          type="button"
          on:click={() => ($modalState = 'login-guest')}
          class="w-full p-3 rounded-full button shade"
        >
          Login Guest
        </button>
        <button
          type="button"
          on:click={() => ($modalState = 'add-guest')}
          class="w-full p-3 rounded-full button primary"
        >
          Join as Guest
        </button>
      {:else if $session.user !== null}
        {#if $isJoined}
          <button
            type="button"
            on:click={() => ($modalState = 'edit-auth')}
            class="w-full p-3 rounded-full button primary"
          >
            Edit
          </button>
        {:else}
          <button
            type="button"
            on:click={() => ($modalState = 'add-auth')}
            class="w-full p-3 rounded-full button primary"
          >
            Join
          </button>
        {/if}
      {:else if $session.guestUser !== null}
        <button
          type="button"
          on:click={() => ($modalState = 'edit-auth')}
          class="w-full p-3 rounded-full button primary"
        >
          Edit
        </button>
      {/if}
    </div>
  {/if}
</div>
