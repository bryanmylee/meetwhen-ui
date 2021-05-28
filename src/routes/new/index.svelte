<script lang="ts">
  import { addMeeting } from '$lib/gql/addMeeting';
  import { meetingInput } from './_state/meeting';
  import Head from '$lib/components/Head.svelte';
  import MeetingInput from './_MeetingInput.svelte';
  import Buttons from './_Buttons.svelte';

  const submit = async () => {
    const newMeeting = await addMeeting($meetingInput);
    console.log(newMeeting);
  };
</script>

<Head emoji="✏️" subtitle="new event" />

<form on:submit|preventDefault={submit} class="max-w-lg p-6 mx-auto space-y-4">
  <MeetingInput />
  <Buttons />
</form>
