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
  import type { Load } from '@sveltejs/kit';

  const handleLogout = async () => {
    await logout();
    $session.user = null;
    goto('/');
  };
</script>

<div class="max-w-lg p-6 mx-auto space-y-4">
  <h1>Upcoming meetings</h1>
  <p>Coming soon...</p>
  <button on:click={handleLogout} class="p-4 button shade rounded-xl"> Logout </button>
</div>
