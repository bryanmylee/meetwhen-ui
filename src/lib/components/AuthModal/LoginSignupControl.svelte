<script lang="ts">
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
    <button
      type="button"
      on:click={() => (isLoggingIn = !isLoggingIn)}
      class="text-sm underline hover:text-primary-lighter rounded-sm focus:ring-[3px] ring-primary-lighter ring-offset-4 dark:ring-offset-gray-800"
    >
      {buttonLabel}
    </button>
  {/if}
</div>
