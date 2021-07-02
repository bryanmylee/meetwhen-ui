<script lang="ts">
  import { pageState, isJoined } from './_state/page';
  import { username, password } from './_state/form';
  import Textfield from '$lib/components/Textfield.svelte';
  import { session } from '$app/stores';
</script>

<div class="space-y-4">
  {#if $pageState === 'add-guest'}
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
        on:click={() => ($pageState = 'none')}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
  {:else if $pageState === 'login-guest'}
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
        on:click={() => ($pageState = 'none')}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Login </button>
    </div>
  {:else if $pageState === 'add-auth' || $pageState === 'edit-auth' || $pageState === 'edit-guest'}
    <div class="flex space-x-4">
      <button
        type="button"
        on:click={() => ($pageState = 'none')}
        class="w-full p-3 rounded-full button shade"
      >
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
  {:else if $pageState === 'none'}
    <div class="flex space-x-4">
      {#if $session.user === null}
        <button
          type="button"
          on:click={() => ($pageState = 'login-guest')}
          class="w-full p-3 rounded-full button shade"
        >
          Guest Login
        </button>
        <button
          type="button"
          on:click={() => ($pageState = 'add-guest')}
          class="w-full p-3 rounded-full button primary"
        >
          Join as Guest
        </button>
      {:else if $session.user.guestOf === null}
        {#if $isJoined}
          <button
            type="button"
            on:click={() => ($pageState = 'edit-auth')}
            class="w-full p-3 rounded-full button primary"
          >
            Edit
          </button>
        {:else}
          <button
            type="button"
            on:click={() => ($pageState = 'add-auth')}
            class="w-full p-3 rounded-full button primary"
          >
            Join
          </button>
        {/if}
      {:else}
        <button
          type="button"
          on:click={() => ($pageState = 'edit-guest')}
          class="w-full p-3 rounded-full button primary"
        >
          Edit
        </button>
      {/if}
    </div>
  {/if}
</div>
