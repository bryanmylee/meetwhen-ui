<script lang="ts" context="module">
  export const load: Load = async ({ session }) => {
    if (session.user === null) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    return {};
  };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { session } from '$app/stores';
  import { logout } from '$lib/gql/logout';
  import { setLoadingContext, withLoading } from '$lib/components/Loading';
  import LoadingButton from '$lib/components/Loading/LoadingButton.svelte';
  import type { Load } from '@sveltejs/kit';

  const isLoading = setLoadingContext(false);

  const handleLogout = withLoading(isLoading, async () => {
    await logout();
    $session.user = null;
    goto('/', { replaceState: true });
  });
</script>

<div class="max-w-lg p-6 mx-auto space-y-4">
  <div class="p-4 space-y-4 card">
    <h1 class="text-xl font-bold">Upcoming meetings</h1>
    <p>Coming soon...</p>
    <LoadingButton on:click={handleLogout} class="px-4 py-3 rounded-full button shade">
      Logout
    </LoadingButton>
  </div>
</div>
