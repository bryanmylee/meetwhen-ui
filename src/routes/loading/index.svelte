<script lang="ts" context="module">
	export const load: Load = async () => {
		if (get(loadingMeetingPromise) === null) {
			return {
				status: 302,
				redirect: '/',
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import Buttons from '$lib/components/page/meeting/molecues/Buttons.svelte';
	import { Calendar } from '$lib/components/calendar';
	import { Head } from '$lib/components/atoms';
	import { MeetingCard } from '$lib/components/meetings';
	import { MeetingPageTemplate } from '$lib/components/page/meeting';
	import type { Load } from '@sveltejs/kit';
	import type { ShallowMeeting } from '$lib/gql/types';
	import { ScaleOut } from 'svelte-loading-spinners';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { loadingMeetingPromise, newMeeting } from '$lib/app-state';
	import { onMount } from 'svelte';

	onMount(async () => {
		$newMeeting = await $loadingMeetingPromise;
		$loadingMeetingPromise = null;
		goto(`/${$newMeeting.slug}`, { replaceState: true });
	});

	$: meeting = $newMeeting as ShallowMeeting;
</script>

<Head emoji="☁️" subtitle="loading..." />

<MeetingPageTemplate>
	<MeetingCard {meeting} slot="header" />
	<Buttons slot="buttons" />
	<Calendar slot="calendar" />
</MeetingPageTemplate>

<div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-primary">
	<ScaleOut color="currentColor" duration="1.5s" size="120" />
</div>
