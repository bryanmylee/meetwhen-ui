<script lang="ts">
  import { getLoadingContext } from '$lib/components/Loading';
  import { classes } from '$lib/utils/classes';

  export let isLoggingIn = false;
  export let isGuestAuth = false;
  export let enableGuestLogin = true;

  const isLoading = getLoadingContext();

  $: guestButtonLabel = isLoggingIn ? 'Join as new guest' : 'Already a guest?';
  $: plusButtonLabel = isLoggingIn ? 'Create new account' : 'Already have an account?';
  $: buttonLabel = isGuestAuth ? guestButtonLabel : plusButtonLabel;

  $: guestHeaderLabel = isLoggingIn ? 'Login as guest' : 'Join as new guest';
  $: plusHeaderLabel = isLoggingIn ? 'Login' : 'Join';
  $: headerLabel = isGuestAuth ? guestHeaderLabel : plusHeaderLabel;

  $: buttonClass = classes([
    'text-sm underline text-focusable',
    $isLoading ? 'cursor-default' : 'hover:text-primary-lighter ',
  ]);
</script>

<div class="flex items-baseline justify-between space-x-4">
  <h1 class="text-lg font-medium">{headerLabel}</h1>
  {#if !isGuestAuth || enableGuestLogin}
    <button
      type="button"
      on:click={() => (isLoggingIn = !isLoggingIn)}
      disabled={$isLoading}
      class={buttonClass}
    >
      {buttonLabel}
    </button>
  {/if}
</div>
