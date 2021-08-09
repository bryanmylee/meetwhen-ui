<script lang="ts" context="module">
  const UPCOMING_TO_SHOW = 5;
  const PREVIOUS_TO_SHOW = 3;

  export const load: Load = async ({ session }) => {
    if (session.user === null) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    try {
      const { upcomingMeetings, previousMeetings } = await getProfilePage({
        upcomingLimit: UPCOMING_TO_SHOW,
        previousLimit: PREVIOUS_TO_SHOW,
      });
      return {
        props: {
          upcomingMeetings,
          previousMeetings,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        error: JSON.stringify(error),
      };
    }
  };
</script>

<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import LoadingButton from '$lib/components/Loading/LoadingButton.svelte';
  import type { Load } from '@sveltejs/kit';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { getProfilePage } from '$lib/gql/getProfilePage';
  import { logout } from '$lib/gql/logout';
  import { session } from '$app/stores';
  import { setLoadingContext, withLoading } from '$lib/components/Loading';
  import Previous from './_Previous.svelte';
  import Upcoming from './_Upcoming.svelte';

  export let upcomingMeetings: ShallowMeeting[];
  export let previousMeetings: ShallowMeeting[];

  const isLoading = setLoadingContext(false);

  $: isGuest = $session.user?.guestOf !== null ?? true;

  const handleLogout = withLoading(isLoading, async () => {
    await logout();
    $session.user = null;
    window.history.back();
  });
</script>

<Head subtitle="profile" emoji="🤖" />

<div class="max-w-lg p-6 mx-auto space-y-4">
  <section class="p-4 card">
    <h1 class="mb-2 text-2xl font-bold">Profile</h1>
    {#if isGuest}
      <p>You are using a guest account.</p>
    {/if}
  </section>
  {#if !isGuest}
    <Upcoming {upcomingMeetings} />
    {#if previousMeetings.length > 0}
      <Previous {previousMeetings} />
    {/if}
  {/if}
  <div class="flex justify-end p-4 card">
    <LoadingButton
      type="button"
      isPrimary
      on:click={handleLogout}
      class="px-4 py-3 rounded-full button shade"
    >
      Logout
    </LoadingButton>
  </div>
</div>
