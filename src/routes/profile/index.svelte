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
  import LoadingButton from '$lib/components/Loading/LoadingButton.svelte';
  import type { Load } from '@sveltejs/kit';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { getProfilePage } from '$lib/gql/getProfilePage';
  import { logout } from '$lib/gql/logout';
  import { session } from '$app/stores';
  import { setLoadingContext, withLoading } from '$lib/components/Loading';
  import Previous from './_Previous.svelte';
  import MeetingItem from './_MeetingItem.svelte';

  export let upcomingMeetings: ShallowMeeting[];
  export let previousMeetings: ShallowMeeting[];

  const isLoading = setLoadingContext(false);

  const handleLogout = withLoading(isLoading, async () => {
    await logout();
    $session.user = null;
    window.history.back();
  });
</script>

<div class="max-w-lg p-6 mx-auto space-y-4">
  <div class="p-4 space-y-4 card">
    <h1 class="text-xl font-bold">Upcoming meetings</h1>
    <ul class="space-y-4">
      {#each upcomingMeetings as meeting}
        <MeetingItem {meeting} />
      {/each}
    </ul>
  </div>
  <Previous {previousMeetings} />
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
