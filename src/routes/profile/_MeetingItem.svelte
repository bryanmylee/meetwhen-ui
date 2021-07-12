<script lang="ts">
  import { goto } from '$app/navigation';
  import MeetingCard from '$lib/components/Meeting/MeetingCard.svelte';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { onSubmitKey } from '$lib/utils/on-submit-key';

  export let meeting: ShallowMeeting;
  export let dimmed = false;

  const navigate = () => {
    goto(`/${meeting.slug}`);
  };
</script>

<li tabindex="0" on:keydown={onSubmitKey(navigate)} class="cursor-pointer button rounded-xl">
  <MeetingCard on:click={navigate} {meeting} {dimmed} />
</li>
