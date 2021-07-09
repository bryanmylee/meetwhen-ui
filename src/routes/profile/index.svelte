<script lang="ts" context="module">
  export const load: Load = async ({ session }) => {
    if (session.user === null) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    const { owned, joined } = await getMyMeetings();
    return {
      props: {
        ownedMeetings: owned,
        joinedMeetings: joined,
      },
    };
  };
</script>

<script lang="ts">
  import LoadingButton from '$lib/components/Loading/LoadingButton.svelte';
  import type { Load } from '@sveltejs/kit';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { getMyMeetings } from '$lib/gql/getMyMeetings';
  import { logout } from '$lib/gql/logout';
  import { session } from '$app/stores';
  import { setLoadingContext, withLoading } from '$lib/components/Loading';
  import {
    joinedMeetings as joinedInput,
    ownedMeetings as ownedInput,
    upcomingMeetings,
  } from './_state/page';
  import MeetingItem from './_MeetingItem.svelte';

  export let ownedMeetings: ShallowMeeting[];
  export let joinedMeetings: ShallowMeeting[];

  $: $ownedInput = ownedMeetings;
  $: $joinedInput = joinedMeetings;

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
      {#each $upcomingMeetings as meeting}
        <MeetingItem {meeting} />
      {/each}
    </ul>
  </div>
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
