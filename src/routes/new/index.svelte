<script lang="ts">
	import AdvancedSettings from '$lib/components/page/new/molecues/AdvancedSettings.svelte';
	import Buttons from '$lib/components/page/new/molecues/Buttons.svelte';
	import Head from '$lib/components/atoms/Head.svelte';
	import MeetingInput from '$lib/components/page/new/molecues/MeetingInput.svelte';
	import { addMeeting } from '$lib/gql/addMeeting';
	import { color, emoji, meetingInput, name } from './_state/meeting';
	import { goto } from '$app/navigation';
	import { loadingMeetingPromise, newMeeting, primaryColorBase } from '$lib/app-state';
	import { page } from '$app/stores';
	import { selectedDates, from, to } from './_state/intervals';

	$: $primaryColorBase = $color;

	let showAdvanced = false;

	const submit = () => {
		if ($selectedDates.value.length === 0) {
			$selectedDates.error = 'Required';
			return;
		}
		$loadingMeetingPromise = addMeeting($meetingInput);
		$newMeeting = { ...$meetingInput, slug: '' };
		goto('/loading');
	};

	$: $page, selectedDates.reset();
</script>

<Head emoji="✏️" subtitle="new event" />

<form on:submit|preventDefault={submit} class="max-w-lg p-6 mx-auto space-y-4">
	<MeetingInput
		bind:name={$name}
		bind:selectedDates={$selectedDates.value}
		bind:selectedDatesError={$selectedDates.error}
		bind:from={$from}
		bind:to={$to}
	/>
	{#if showAdvanced}
		<AdvancedSettings bind:emoji={$emoji} bind:color={$color} />
	{/if}
	<Buttons on:more={() => (showAdvanced = !showAdvanced)} />
</form>
