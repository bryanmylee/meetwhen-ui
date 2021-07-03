<script lang="ts">
  import { classes } from '$lib/utils/classes';

  export let isLoggingIn = false;
  export let isGuestAuth = false;
  export let enableGuestLogin = true;

  $: guestButtonLabel = isLoggingIn ? 'Create new guest' : 'Already have an account?';
  $: plusButtonLabel = isLoggingIn ? 'Create new account' : 'Already have an account?';
  $: buttonLabel = isGuestAuth ? guestButtonLabel : plusButtonLabel;

  $: guestHeaderLabel = isLoggingIn ? 'Login as guest' : 'Join as guest';
  $: plusHeaderLabel = isLoggingIn ? 'Login' : 'Join';
  $: headerLabel = isGuestAuth ? guestHeaderLabel : plusHeaderLabel;
</script>

<div class="flex items-baseline justify-between space-x-4">
  <h1 class="text-lg font-medium">{headerLabel}</h1>
  {#if !isGuestAuth || enableGuestLogin}
    <button type="button" on:click={() => (isLoggingIn = !isLoggingIn)} class="text-sm underline">
      {buttonLabel}
    </button>
  {/if}
</div>
